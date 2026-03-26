"use client";

import DashNavbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";
import React, { useCallback, useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={toggleSidebar} />
            <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-background">
                <DashNavbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={toggleSidebar}
                />
                <main>
                    <div className="container px-5 py-5 mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
