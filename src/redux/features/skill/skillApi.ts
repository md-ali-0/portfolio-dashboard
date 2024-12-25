import { Skill, TQueryParam, TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

const skillApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSingleSkill: builder.query({
            query: (id) => {
                return {
                    url: `/skill/${id}`,
                };
            },
            providesTags: ["skills"],
        }),
        getAllSkills: builder.query({
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
                    url: `/skill`,
                    params: params,
                };
            },
            transformResponse: (response: TResponseRedux<Skill[]>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["skills"],
        }),
        createSkill: builder.mutation({
            query: (data) => {
                return {
                    url: "/skill",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["skills"],
        }),
        updateSkill: builder.mutation({
            query: (data) => {
                return {
                    url: `/skill/${data.id}`,
                    method: "PATCH",
                    body: data.data,
                };
            },
            invalidatesTags: ["skills"],
        }),
        deleteSkill: builder.mutation({
            query: (id) => {
                return {
                    url: `/skill/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["skills"],
        }),
    }),
});

export const {
    useGetAllSkillsQuery,
    useGetSingleSkillQuery,
    useUpdateSkillMutation,
    useDeleteSkillMutation,
    useCreateSkillMutation
} = skillApi;
