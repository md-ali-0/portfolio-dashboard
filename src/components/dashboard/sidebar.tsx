// import logo from "@/assets/images/logo.png";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";
import SideBarMenuItem from "./sidebar-menu-item";
import SidebarSubMenu from "./sidebar-submenu";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <aside>
            <div
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
                    sidebarOpen ? "block" : "hidden"
                }`}
            ></div>
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-gray-900 border-r border-gray-800 min-h-screen transition duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen
                        ? "translate-x-0 ease-out"
                        : "-translate-x-full ease-in"
                }`}
            >
                <div className="flex items-center justify-center border-b border-gray-800 py-3 h-16">
                    <Link href="/" className="text-white">
                        Ali
                    </Link>
                </div>
                <div className="overflow-y-auto custom-scroll">
                    <nav className="mt-5 px-3">
                        <ul>
                            <h4 className="text-gray-400 font-semibold text-xs mb-1">
                                Main
                            </h4>
                            <SideBarMenuItem
                                menu={{
                                    name: "Dashboard",
                                    icon: "LayoutDashboard",
                                    path: "/dashboard",
                                }}
                                setSidebarOpen={setSidebarOpen}
                            />
                            <SideBarMenuItem
                                menu={{
                                    name: "Categories",
                                    icon: "ChartBarStacked",
                                    path: "/dashboard/categories",
                                }}
                                setSidebarOpen={setSidebarOpen}
                            />
                            <SidebarSubMenu
                                menu={{
                                    name: "Blogs",
                                    icon: "Rss",
                                }}
                                subMenu={[
                                    {
                                        name: "Create Post",
                                        path: "/dashboard/create-post",
                                    },
                                    {
                                        name: "Manage Posts",
                                        path: "/dashboard/posts",
                                    },
                                ]}
                                setSidebarOpen={setSidebarOpen}
                            ></SidebarSubMenu>
                            <SidebarSubMenu
                                menu={{
                                    name: "Projects",
                                    icon: "SquareChartGantt",
                                }}
                                subMenu={[
                                    {
                                        name: "Create Project",
                                        path: "/dashboard/create-project",
                                    },
                                    {
                                        name: "Manage Projects",
                                        path: "/dashboard/projects",
                                    },
                                ]}
                                setSidebarOpen={setSidebarOpen}
                            ></SidebarSubMenu>
                            <SideBarMenuItem
                                menu={{
                                    name: "Experience",
                                    icon: "BookUser",
                                    path: "/dashboard/experience",
                                }}
                                setSidebarOpen={setSidebarOpen}
                            />
                            <SideBarMenuItem
                                menu={{
                                    name: "Languages",
                                    icon: "Languages",
                                    path: "/dashboard/languages",
                                }}
                                setSidebarOpen={setSidebarOpen}
                            />
                            <SideBarMenuItem
                                menu={{
                                    name: "Skills",
                                    icon: "Brain",
                                    path: "/dashboard/skills",
                                }}
                                setSidebarOpen={setSidebarOpen}
                            />
                            <SideBarMenuItem
                                menu={{
                                    name: "Technologies",
                                    icon: "Cpu",
                                    path: "/dashboard/technologies",
                                }}
                                setSidebarOpen={setSidebarOpen}
                            />
                            <h4 className="text-gray-400 font-semibold text-xs mt-2">
                                Settings
                            </h4>
                            <SideBarMenuItem
                                menu={{
                                    name: "Settings",
                                    icon: "Settings",
                                    path: "/dashboard/settings",
                                }}
                                setSidebarOpen={setSidebarOpen}
                            />
                        </ul>
                    </nav>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
