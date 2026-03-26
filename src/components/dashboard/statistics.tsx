"use client";

import { useGetAnalyticsOverviewQuery } from "@/redux/features/analytics/analyticsApi";
import { BookUser, Brain, ChartBarStacked, MessageCircle, Rss, SquareChartGantt } from "lucide-react";
import React from "react";

const StatisticsCard = ({
    title,
    count,
    icon: Icon,
    isLoading,
}: {
    title: string;
    count: number | string;
    icon: React.ElementType;
    isLoading: boolean;
}) => {
    return (
        <div className="flex items-center p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
            <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                <Icon size={24} />
            </div>
            <div>
                <p className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </p>
                {isLoading ? (
                    <div className="h-6 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                ) : (
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                        {count ?? 0}
                    </p>
                )}
            </div>
        </div>
    );
};

export default function Statistics() {
    const { data: analyticsData, isLoading } = useGetAnalyticsOverviewQuery(undefined);
    const stats = analyticsData?.data;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
                        Dashboard Overview
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Here is a quick summary of your portfolio data.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <StatisticsCard
                    title="Total Projects"
                    count={stats?.projects ?? 0}
                    icon={SquareChartGantt}
                    isLoading={isLoading}
                />
                <StatisticsCard
                    title="Total Posts"
                    count={stats?.posts ?? 0}
                    icon={Rss}
                    isLoading={isLoading}
                />
                <StatisticsCard
                    title="Total Skills"
                    count={stats?.skills ?? 0}
                    icon={Brain}
                    isLoading={isLoading}
                />
                <StatisticsCard
                    title="Total Experience"
                    count={stats?.experiences ?? 0}
                    icon={BookUser}
                    isLoading={isLoading}
                />
                <StatisticsCard
                    title="Total Categories"
                    count={stats?.categories ?? 0}
                    icon={ChartBarStacked}
                    isLoading={isLoading}
                />
                <StatisticsCard
                    title="Total Comments"
                    count={stats?.comments ?? 0}
                    icon={MessageCircle}
                    isLoading={isLoading}
                />
            </div>
            
            {(stats?.totalViews || stats?.totalShares) ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Post Views</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalViews}</p>
                    </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Post Shares</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalShares}</p>
                    </div>
                </div>
            </div> : null}
        </div>
    );
}
