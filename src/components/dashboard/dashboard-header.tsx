"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function DashboardHeader() {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("en-GB", { hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-border/40 gap-4">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tighter text-white">
                    Lean<span className="text-indigo-500">Portfolio</span>
                </h1>
                <span className="px-2 py-0.5 rounded bg-secondary text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                    v1.0.1
                </span>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Last Updated
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">
                        {currentTime}
                    </span>
                </div>
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-border/60 hover:bg-secondary/80 hover:text-white transition-all bg-transparent group"
                >
                    <RefreshCw className="mr-2 h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}
