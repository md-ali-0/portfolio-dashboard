import { Project, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const projectApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSingleProject: builder.query({
            query: (id) => {
                return {
                    url: `/project/${id}`,
                };
            },
            providesTags: ["projects"],
        }),
        getAllProjects: builder.query({
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
                    url: `/project`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Project[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["projects"],
        }),
        createProject: builder.mutation({
            query: (data) => {
                return {
                    url: "/project",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["projects"],
        }),
        updateProject: builder.mutation({
            query: (data) => {
                return {
                    url: `/project/${data?.id}`,
                    method: "PATCH",
                    body: data?.formData,
                };
            },
            invalidatesTags: ["projects"],
        }),
        deleteProject: builder.mutation({
            query: (id) => {
                return {
                    url: `/project/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["projects"],
        }),
    }),
});

export const {
    useGetAllProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useGetSingleProjectQuery
} = projectApi;
