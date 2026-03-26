"use client";

import { useGetAnalyticsOverviewQuery } from "@/redux/features/analytics/analyticsApi";
import { 
    Brain, ChartBarStacked, Rss, SquareChartGantt, 
    Zap
} from "lucide-react";
import React from "react";
import DashboardHeader from "./dashboard-header";
import MetricCard from "./metric-card";
import SimpleLineChart from "./simple-line-chart";

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
        <div className="group bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 transition-all hover:bg-[#242426] hover:border-white/10">
            <div className="mb-6">
                <Icon className={`w-3.5 h-3.5 ${color || "text-yellow-500/80"}`} />
            </div>
            
            <div className="space-y-1">
                {isLoading ? (
                    <div className="h-10 w-24 bg-white/5 rounded animate-pulse" />
                ) : (
                    <h3 className="text-4xl font-black text-white tracking-tighter">
                        {count ?? 0}
                    </h3>
                )}
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        {title}
                    </span>
                    {subLabel && (
                        <span className="text-[10px] font-medium text-muted-foreground/30 mt-0.5">
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

    // Simulated trend data
    const growthData = [
        { label: "Feb 20", value: 1200000 },
        { label: "Feb 24", value: 2100000 },
        { label: "Feb 28", value: 3800000 },
        { label: "Mar 04", value: 4500000 },
        { label: "Mar 08", value: 5200000 },
        { label: "Mar 12", value: 6800000 },
        { label: "Mar 16", value: 7300000 },
    ];

    const engagementData = [
        { label: "Feb 20", value: 65 },
        { label: "Feb 24", value: 78 },
        { label: "Feb 28", value: 82 },
        { label: "Mar 04", value: 74 },
        { label: "Mar 08", value: 86 },
        { label: "Mar 12", value: 81 },
        { label: "Mar 16", value: 83 },
    ];

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

            {/* Middle Detailed Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard 
                    title="CONTENT METRICS"
                    progress={86}
                    progressColor="indigo"
                    metrics={[
                        { label: "TOTAL CALLS", value: "4,827", subValue: "8 MCP • 14 Hook" },
                        { label: "SAVINGS RATE", value: "86%", color: "indigo" },
                        { label: "TOKENS SAVED", value: "4.3M" },
                        { label: "COST SAVED", value: "$64.54", color: "yellow" }
                    ]}
                />
                <MetricCard 
                    title="USER ENGAGEMENT"
                    progress={72}
                    progressColor="blue"
                    metrics={[
                        { label: "AVG SESSIONS", value: "1,288", subValue: "Daily active users" },
                        { label: "RETENTION", value: "72%", color: "blue" },
                        { label: "SHARES", value: stats?.totalShares || 0 },
                        { label: "COMMENTS", value: stats?.comments || 0, color: "emerald" }
                    ]}
                />
            </div>

            {/* Bottom Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <SimpleLineChart 
                        title="CUMULATIVE VIEW GROWTH"
                        data={growthData}
                        color="#10b981"
                        height={240}
                    />
                </div>
                <div>
                    <SimpleLineChart 
                        title="DAILY ENGAGEMENT RATE"
                        data={engagementData}
                        color="#6366f1"
                        height={240}
                    />
                </div>
            </div>
        </div>
    );
}
