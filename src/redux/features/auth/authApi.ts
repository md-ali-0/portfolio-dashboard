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
                    url: `/forgot-password?email=${data.email}`,
                    body: data,
                    method: "POST",
                };
            },
        }),
        resetPassword: builder.mutation({
            query: ({ id, newPassword, verification_code }) => ({
                url: "/change-password",
                method: "POST",
                body: { id, newPassword, verification_code },
            }),
        }),
    }),
});

export const {
    useSignUpUserMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
} = authApi;
