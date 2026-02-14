import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { logout } from '../slices/authSlice';

// Define base query outside of createApi
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
        // Add token to headers if it exists
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // Try to logout
        api.dispatch(logout());
    }
    return result;
};

// Define a service using a base URL and expected endpoints
export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Products', 'Categories', 'Reviews', 'Wishlist', 'Cart', 'Brands', 'ActivityLogs', 'Dashboard'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        getProducts: builder.query({
            query: ({ page = 1, limit = 12, category_slug }: any = {}) => ({
                url: '/products',
                params: { page, limit, category_slug },
            }),
            providesTags: ['Products'],
        }),
        getProduct: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }],
        }),
        getCategories: builder.query<any, void>({
            query: () => '/categories',
            providesTags: ['Categories'],
        }),
        // Dashboard
        getDashboardStats: builder.query<any, void>({
            query: () => '/dashboard/stats',
        }),
        getActivityLogs: builder.query<any, { page?: number; limit?: number } | void>({
            query: (arg) => {
                const { page = 1, limit = 10 } = arg || {};
                return {
                    url: '/dashboard/activity-logs',
                    params: { page, limit },
                };
            },
            providesTags: ['ActivityLogs'],
        }),
        // Brands
        getBrands: builder.query<any, void>({
            query: () => '/brands',
            providesTags: ['Brands'],
        }),
        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: '/categories',
                method: 'POST',
                body: categoryData,
            }),
            invalidatesTags: ['Categories', 'ActivityLogs'],
        }),
        createBrand: builder.mutation({
            query: (brandData) => ({
                url: '/brands',
                method: 'POST',
                body: brandData,
            }),
            invalidatesTags: ['Brands', 'ActivityLogs'],
        }),
        createProduct: builder.mutation({
            query: (productData) => ({
                url: '/products',
                method: 'POST',
                body: productData,
            }),
            invalidatesTags: ['Products', 'ActivityLogs', 'Dashboard'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...productData }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: productData,
            }),
            invalidatesTags: ['Products', 'ActivityLogs'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products', 'ActivityLogs'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...categoryData }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                body: categoryData,
            }),
            invalidatesTags: ['Categories', 'ActivityLogs'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories', 'ActivityLogs'],
        }),
        // Reviews
        createReview: builder.mutation({
            query: (reviewData) => ({
                url: '/reviews',
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: ['Reviews', 'Products'],
        }),
        getProductReviews: builder.query({
            query: (productId) => `/products/${productId}/reviews`,
            providesTags: ['Reviews'],
        }),
        // Wishlist
        getWishlist: builder.query<any, void>({
            query: () => '/wishlist',
            providesTags: ['Wishlist'],
        }),
        addToWishlist: builder.mutation({
            query: (product_id) => ({
                url: '/wishlist',
                method: 'POST',
                body: { product_id },
            }),
            invalidatesTags: ['Wishlist'],
        }),
        removeFromWishlist: builder.mutation({
            query: (productId) => ({
                url: `/wishlist/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Wishlist'],
        }),
        // Cart
        getCart: builder.query<any, void>({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: ({ product_id, quantity }) => ({
                url: '/cart',
                method: 'POST',
                body: { product_id, quantity },
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartItem: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: `/cart/${productId}`,
                method: 'PUT',
                body: { quantity },
            }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: `/cart/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetProductsQuery,
    useGetProductQuery,
    useGetCategoriesQuery,
    useLoginMutation,
    useRegisterMutation,
    useGetDashboardStatsQuery,
    useGetActivityLogsQuery,
    useGetBrandsQuery,
    useCreateBrandMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteProductMutation,
    useDeleteCategoryMutation,
    // Commerce Hooks
    useCreateReviewMutation,
    useGetProductReviewsQuery,
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
} = catalogApi;
