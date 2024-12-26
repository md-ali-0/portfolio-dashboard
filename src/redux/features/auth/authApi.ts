import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        SignUpUser: builder.mutation({
            query: (data) => {
                return {
                    url: "/signup",
                    body: data,
                    method: "POST",
                };
            },
        }),
        forgetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: "/auth/forget-password",
                    body: data,
                    method: "POST",
                };
            },
        }),
        resetPassword: builder.mutation({
            query: ({ password, token }) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: { password },
                headers: {
                    Authorization: token,
                },
            }),
        }),
    }),
});

export const {
    useSignUpUserMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
} = authApi;
