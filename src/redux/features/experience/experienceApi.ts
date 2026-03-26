import { Experience, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const experienceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSingleExperience: builder.query({
            query: (id) => {
                return {
                    url: `/experience/${id}`,
                };
            },
            providesTags: ["experiences"],
        }),
        getAllExperiences: builder.query({
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
                    url: `/experience`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Experience[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["experiences"],
        }),
        createExperience: builder.mutation({
            query: (data) => {
                return {
                    url: "/experience",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["experiences"],
        }),
        updateExperience: builder.mutation({
            query: (data) => {
                return {
                    url: `/experience/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            invalidatesTags: ["experiences"],
        }),
        deleteExperience: builder.mutation({
            query: (id) => {
                return {
                    url: `/experience/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["experiences"],
        }),
    }),
});

export const {
    useGetAllExperiencesQuery,
    useGetSingleExperienceQuery,
    useCreateExperienceMutation,
    useUpdateExperienceMutation,
    useDeleteExperienceMutation,
} = experienceApi;