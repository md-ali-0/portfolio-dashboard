import { Language, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const languageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSingleLanguage: builder.query({
            query: (id) => {
                return {
                    url: `/language/${id}`,
                };
            },
            providesTags: ["languages"],
        }),
        getAllLanguages: builder.query({
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
                    url: `/language`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Language[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["languages"],
        }),
        createLanguage: builder.mutation({
            query: (data) => {
                return {
                    url: "/language",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["languages"],
        }),
        updateLanguage: builder.mutation({
            query: (data) => {
                return {
                    url: `/language/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            invalidatesTags: ["languages"],
        }),
        deleteLanguage: builder.mutation({
            query: (id) => {
                return {
                    url: `/language/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["languages"],
        }),
    }),
});

export const {
    useGetAllLanguagesQuery,
    useGetSingleLanguageQuery,
    useUpdateLanguageMutation,
    useDeleteLanguageMutation,
    useCreateLanguageMutation
} = languageApi;
