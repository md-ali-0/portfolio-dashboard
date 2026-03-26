"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface MetricRowProps {
    label: string;
    value: string | number;
    subValue?: string;
    color?: "indigo" | "blue" | "emerald" | "yellow" | "rose";
}

const colorTextMap = {
    indigo: "text-indigo-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    yellow: "text-yellow-400",
    rose: "text-rose-400",
};

const MetricRow = ({ label, value, subValue, color }: MetricRowProps) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            {label}
        </span>
        <div className="flex items-baseline gap-2">
            <span className={cn("text-xl font-bold tracking-tight", color ? colorTextMap[color] : "text-white")}>
                {value}
            </span>
            {subValue && (
                <span className="text-[10px] font-medium text-muted-foreground/40">
                    {subValue}
                </span>
            )}
        </div>
    </div>
);

interface MetricCardProps {
    title: string;
    metrics: MetricRowProps[];
    progress: number;
    progressColor?: "indigo" | "blue" | "emerald" | "yellow" | "rose";
}

const colorBgMap = {
    indigo: "bg-indigo-500",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    yellow: "bg-yellow-500",
    rose: "bg-rose-500",
};

const colorGlowMap = {
    indigo: "bg-indigo-500/50",
    blue: "bg-blue-500/50",
    emerald: "bg-emerald-500/50",
    yellow: "bg-yellow-500/50",
    rose: "bg-rose-500/50",
};

export default function MetricCard({ title, metrics, progress, progressColor = "indigo" }: MetricCardProps) {
    return (
        <div className="bg-card/40 border border-border/60 rounded-2xl p-6 relative overflow-hidden group transition-all hover:bg-card/60">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-8 flex items-center gap-2">
                <span className={cn("w-1.5 h-1.5 rounded-full", colorBgMap[progressColor])} />
                {title}
            </h3>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8">
                {metrics.map((metric, i) => (
                    <MetricRow key={i} {...metric} />
                ))}
            </div>

            {/* Progress Bar Container */}
            <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full transition-all duration-1000 ease-out rounded-full", colorBgMap[progressColor])}
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            {/* Subtle bottom glow */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-[1px] opacity-20 blur-[1px]",
                colorGlowMap[progressColor]
            )} />
        </div>
    );
}
