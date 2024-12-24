import { TResponseRedux, User } from "@/types";
import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => {
                return {
                    url: `/user/me`,
                };
            },
            transformResponse: (response: TResponseRedux<User>) => {
                return response.data;
            },
            providesTags: ["userData"],
        }),
        getAllUsers: builder.query({
            query: () => {
                return {
                    url: `/user`,
                };
            },
            transformResponse: (response: TResponseRedux<User[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },

            providesTags: ["users"],
        }),
        deleteUser: builder.mutation({
            query: (id) => {
                return {
                    url: `/user/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["users"],
        }),
        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    url: `/user/me`,
                    method: "PUT",
                    body: data,
                };
            },
            invalidatesTags: ["userData"],
        }),
    }),
});

export const {
    useGetMeQuery,
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useUpdateProfileMutation,
} = userApi;
