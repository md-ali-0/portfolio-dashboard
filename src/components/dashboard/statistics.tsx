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
        <div className="group relative overflow-hidden flex items-center p-6 bg-card border border-border rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30">
            {/* Subtle gradient glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-4 mr-4 text-blue-400 bg-blue-500/10 rounded-xl ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Icon size={26} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 w-full">
                <p className="mb-1 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                </p>
                {isLoading ? (
                    <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                ) : (
                    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
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
            
            {(stats?.totalViews || stats?.totalShares) ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="relative overflow-hidden p-6 bg-card border border-border rounded-2xl flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-indigo-500">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    </div>
                    <div className="relative z-10 w-full">
                        <p className="text-sm font-medium text-indigo-400 mb-1">Total Post Views</p>
                        <p className="text-4xl font-black text-foreground tracking-tight">{stats.totalViews}</p>
                    </div>
                </div>
                <div className="relative overflow-hidden p-6 bg-card border border-border rounded-2xl flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-500">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                    </div>
                    <div className="relative z-10 w-full">
                        <p className="text-sm font-medium text-emerald-400 mb-1">Total Post Shares</p>
                        <p className="text-4xl font-black text-foreground tracking-tight">{stats.totalShares}</p>
                    </div>
                </div>
            </div> : null}
        </div>
    );
}
