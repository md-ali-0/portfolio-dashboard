import { Comment, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const commentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllComments: builder.query({
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
                    url: `/comments`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Comment[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["comments"],
        }),
        approveComment: builder.mutation({
            query: (id: string) => ({
                url: `/comments/${id}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["comments"],
        }),
        rejectComment: builder.mutation({
            query: (id: string) => ({
                url: `/comments/${id}/reject`,
                method: "PATCH",
            }),
            invalidatesTags: ["comments"],
        }),
        deleteComment: builder.mutation({
            query: (id: string) => ({
                url: `/comments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["comments"],
        }),
    }),
});

export const {
    useGetAllCommentsQuery,
    useApproveCommentMutation,
    useRejectCommentMutation,
    useDeleteCommentMutation,
} = commentApi;
