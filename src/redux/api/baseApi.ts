import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: `${config.host}/api`,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            headers.set("authorization", `${token}`);
        }
        return headers;
    },
});

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery,
    endpoints: () => ({}),
    tagTypes: [
        "categories",
        "posts",
        "projects",
        "users",
        "userData",
    ],
});
