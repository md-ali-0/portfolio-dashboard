import { TResponseRedux } from "@/types";
import { baseApi } from "../../api/baseApi";

interface AnalyticsOverview {
  posts: number;
  projects: number;
  categories: number;
  skills: number;
  experiences: number;
  comments: number;
  totalViews: number;
  totalShares: number;
}

const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAnalyticsOverview: builder.query({
            query: () => {
                return {
                    url: `/analytics/overview`,
                };
            },
            transformResponse: (response: TResponseRedux<AnalyticsOverview>) => {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            },
            providesTags: ["posts", "projects", "categories", "skills", "experiences"],
        }),
    }),
});

export const {
    useGetAnalyticsOverviewQuery
} = analyticsApi;
