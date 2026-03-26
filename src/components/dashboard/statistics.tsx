"use client";

import { useGetAnalyticsOverviewQuery } from "@/redux/features/analytics/analyticsApi";
import { 
    Brain, ChartBarStacked, Rss, SquareChartGantt, 
    Zap
} from "lucide-react";
import React from "react";
import DashboardHeader from "./dashboard-header";

const StatisticsCard = ({
    title,
    count,
    icon: Icon,
    subLabel,
    isLoading,
    color,
}: {
    title: string;
    count: number | string;
    icon: React.ElementType;
    subLabel?: string;
    isLoading: boolean;
    color?: string;
}) => {
    return (
        <div className="group bg-[#1c1c1e] border border-white/[0.08] rounded-2xl p-6 transition-all hover:bg-[#242426] hover:border-white/10 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <Icon className={`w-4 h-4 ${color || "text-yellow-500/80"}`} />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
            </div>
            
            <div className="space-y-1">
                {isLoading ? (
                    <div className="h-10 w-24 bg-white/5 rounded animate-pulse" />
                ) : (
                    <h3 className="text-4xl font-bold text-white tracking-tighter">
                        {count ?? 0}
                    </h3>
                )}
                <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8e8e93]">
                        {title}
                    </span>
                    {subLabel && (
                        <span className="text-[10px] font-medium text-[#636366] mt-0.5">
                            {subLabel}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Statistics() {
    const { data: analyticsData, isLoading } = useGetAnalyticsOverviewQuery(undefined);
    const stats = analyticsData?.data;

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
            <DashboardHeader />

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatisticsCard
                    title="Total Projects"
                    count={stats?.projects ?? 0}
                    icon={SquareChartGantt}
                    subLabel={`${stats?.projects || 0} active builds`}
                    isLoading={isLoading}
                    color="text-indigo-400"
                />
                <StatisticsCard
                    title="Total Posts"
                    count={stats?.posts ?? 0}
                    icon={Rss}
                    subLabel={`${stats?.posts || 0} published`}
                    isLoading={isLoading}
                    color="text-blue-400"
                />
                <StatisticsCard
                    title="Total Skills"
                    count={stats?.skills ?? 0}
                    icon={Brain}
                    subLabel="High proficiency"
                    isLoading={isLoading}
                    color="text-emerald-400"
                />
                <StatisticsCard
                    title="Categories"
                    count={stats?.categories ?? 0}
                    icon={ChartBarStacked}
                    subLabel="Content taxonomy"
                    isLoading={isLoading}
                    color="text-rose-400"
                />
                <StatisticsCard
                    title="Total Views"
                    count={stats?.totalViews || "0"}
                    icon={Zap}
                    subLabel="Across all posts"
                    isLoading={isLoading}
                    color="text-yellow-400"
                />
            </div>
        </div>
    );
}
