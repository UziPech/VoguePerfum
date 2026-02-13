import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Define a service using a base URL and expected endpoints
export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
        prepareHeaders: (headers, { getState }) => {
            // Add token to headers if it exists
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Products', 'Categories'],
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
        getCategories: builder.query<any, void>({
            query: () => '/categories',
            providesTags: ['Categories'],
        }),
        // Dashboard
        getDashboardStats: builder.query<any, void>({
            query: () => '/dashboard/stats',
        }),
        // Brands
        getBrands: builder.query<any, void>({
            query: () => '/brands',
        }),
        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: '/categories',
                method: 'POST',
                body: categoryData,
            }),
            invalidatesTags: ['Categories'],
        }),
        createBrand: builder.mutation({
            query: (brandData) => ({
                url: '/brands',
                method: 'POST',
                body: brandData,
            }),
        }),
        createProduct: builder.mutation({
            query: (productData) => ({
                url: '/products',
                method: 'POST',
                body: productData,
            }),
            invalidatesTags: ['Products'],
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useGetProductsQuery,
    useGetCategoriesQuery,
    useLoginMutation,
    useRegisterMutation,
    useGetDashboardStatsQuery,
    useGetBrandsQuery,
    useCreateBrandMutation,
    useCreateProductMutation,
    useCreateCategoryMutation
} = catalogApi;
