import { Post, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const postApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSinglePost: builder.query({
            query: (id) => {
                return {
                    url: `/post/${id}`,
                };
            },
            providesTags: ["posts"],
        }),
        getAllPosts: builder.query({
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
                    url: `/post`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Post[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["posts"],
        }),
        createPost: builder.mutation({
            query: (data) => {
                return {
                    url: "/post",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["posts"],
        }),
        updatePost: builder.mutation({
            query: (data) => {
                return {
                    url: `/post/${data?.id}`,
                    method: "PATCH",
                    body: data?.formData,
                };
            },
            invalidatesTags: ["posts"],
        }),
        deletePost: builder.mutation({
            query: (id) => {
                return {
                    url: `/post/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["posts"],
        }),
    }),
});

export const {
    useGetAllPostsQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useGetSinglePostQuery
} = postApi;
