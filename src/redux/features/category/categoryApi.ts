import { Category, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSingleCategory: builder.query({
            query: (id) => {
                return {
                    url: `/category/${id}`,
                };
            },
            providesTags: ["categories"],
        }),
        getAllCategories: builder.query({
            query: (args) => {
                const params = new URLSearchParams();
                if (args) {
                    args.forEach((item: TQueryParam) => {
                        if (item.value !== undefined) {
                            params.append(item.name, item.value as string);
                        }
                    });
                }
                return {
                    url: `/category`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Category[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["categories"],
        }),
        createCategory: builder.mutation({
            query: (data) => {
                return {
                    url: "/category",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["categories"],
        }),
        updateCategory: builder.mutation({
            query: (data) => {
                return {
                    url: `/category/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            invalidatesTags: ["categories"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `/category/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["categories"],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetSingleCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
