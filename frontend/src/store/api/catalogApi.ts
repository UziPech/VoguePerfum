import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Define a service using a base URL and expected endpoints
export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api', // Backend local
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
        // Placeholder endpoints
        getProducts: builder.query({
            query: (params) => ({
                url: 'products',
                params,
            }),
            providesTags: ['Products'],
        }),
        getCategories: builder.query({
            query: () => 'categories',
            providesTags: ['Categories'],
        }),
    }),
});

// Export hooks for usage in functional components
export const { useGetProductsQuery, useGetCategoriesQuery } = catalogApi;
