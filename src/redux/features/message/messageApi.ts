import { ContactMessage } from "@/types/Message";
import { TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllMessages: builder.query({
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
                    url: `/message`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<ContactMessage[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["messages"],
        }),
        getSingleMessage: builder.query({
            query: (id) => ({
                url: `/message/${id}`,
            }),
            providesTags: ["messages"],
        }),
        updateMessageStatus: builder.mutation({
            query: (data) => ({
                url: `/message/${data.id}`,
                method: "PATCH",
                body: data.body,
            }),
            invalidatesTags: ["messages"],
        }),
        deleteMessage: builder.mutation({
            query: (id) => ({
                url: `/message/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["messages"],
        }),
    }),
});

export const {
    useGetAllMessagesQuery,
    useGetSingleMessageQuery,
    useUpdateMessageStatusMutation,
    useDeleteMessageMutation,
} = messageApi;
