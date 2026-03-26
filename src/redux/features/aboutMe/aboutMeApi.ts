import { baseApi } from "../../api/baseApi";

const aboutMeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAboutMe: builder.query({
            query: () => ({
                url: `/about`,
            }),
            providesTags: ["aboutMe"],
        }),

        updateAboutMe: builder.mutation({
            query: (data) => ({
                url: `/about`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["aboutMe"],
        }),
    }),
});

export const {
    useUpdateAboutMeMutation,
    useGetAboutMeQuery
} = aboutMeApi;
