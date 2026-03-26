"use client";

import React from "react";

interface DataPoint {
    label: string;
    value: number;
}

interface SimpleLineChartProps {
    title: string;
    data: DataPoint[];
    color?: string;
    height?: number;
}

export default function SimpleLineChart({ title, data, color = "#6366f1", height = 200 }: SimpleLineChartProps) {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = max - min || 1;
    const padding = 20;
    const chartWidth = 500;
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * chartWidth;
        const y = padding + (chartHeight - ((d.value - min) / range) * chartHeight);
        return `${x},${y}`;
    }).join(" ");

    const areaPoints = `${points} ${chartWidth},${height} 0,${height}`;

    return (
        <div className="bg-card/40 border border-border/60 rounded-2xl p-6 transition-all hover:bg-card/60">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    {title}
                </h3>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-white tracking-tight">
                        {max.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                        Peak
                    </span>
                </div>
            </div>

            <div className="relative w-full" style={{ height: `${height}px` }}>
                <svg
                    viewBox={`0 0 ${chartWidth} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={padding + p * chartHeight}
                            x2={chartWidth}
                            y2={padding + p * chartHeight}
                            stroke="currentColor"
                            className="text-border/20"
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Area gradient */}
                    <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>

                    <polyline
                        points={areaPoints}
                        fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
                    />

                    {/* The Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                    />

                    {/* Data dots */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * chartWidth;
                        const y = padding + (chartHeight - ((d.value - min) / range) * chartHeight);
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="3"
                                fill={color}
                                className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer ring-4 ring-white/10"
                            />
                        );
                    })}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between mt-4">
                    {data.filter((_, i) => i % (Math.ceil(data.length / 5)) === 0).map((d, i) => (
                        <span key={i} className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                            {d.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
