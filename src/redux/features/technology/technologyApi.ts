import { Technology, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const technologyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSingleTechnology: builder.query({
            query: (id) => {
                return {
                    url: `/technology/${id}`,
                };
            },
            providesTags: ["technologies"],
        }),
        getAllTechnologies: builder.query({
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
                    url: `/technology`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Technology[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["technologies"],
        }),
        createTechnology: builder.mutation({
            query: (data) => {
                return {
                    url: "/technology",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["technologies"],
        }),
        updateTechnology: builder.mutation({
            query: (data) => {
                return {
                    url: `/technology/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            invalidatesTags: ["technologies"],
        }),
        deleteTechnology: builder.mutation({
            query: (id) => {
                return {
                    url: `/technology/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["technologies"],
        }),
    }),
});

export const {
    useGetAllTechnologiesQuery,
    useGetSingleTechnologyQuery,
    useUpdateTechnologyMutation,
    useDeleteTechnologyMutation,
    useCreateTechnologyMutation
} = technologyApi;
