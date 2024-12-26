import { useSession } from "@/provider/session-provider";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { signout } from "@/service/auth";
import {
    Command,
    LucideLogOut,
    LucideUserCircle,
    Plus,
    Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

interface DashNavbarProps {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const DashNavbar: FC<DashNavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const [search, setSearch] = useState<string>("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data: userData, isLoading } = useGetMeQuery(undefined);
    const { setIsLoading } = useSession();
    const router = useRouter()
    const handleLogout = async () => {
        try {
            setIsLoading(true);
            localStorage.removeItem("accessToken")
            await signout();
            setIsLoading(false);
            router.replace('/auth/signin')
            toast.success("Logout Successfully");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 py-3 bg-white border-b dark:bg-gray-900">
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-500 focus:outline-none lg:hidden"
                >
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M4 6H20M4 12H20M4 18H11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                        <Search className="shrink-0 size-4 text-gray-400 dark:text-white/60" />
                    </div>
                    <Input
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        className="py-2 ps-10 pe-16 block w-full rounded-lg text-sm focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                        placeholder="Search"
                    />
                    {search ? (
                        <div className="absolute inset-y-0 end-0 flex items-center z-20 pe-1">
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                                aria-label="Close"
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="shrink-0 size-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx={12} cy={12} r={10} />
                                    <path d="m15 9-6 6" />
                                    <path d="m9 9 6 6" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-gray-400">
                            <Command className="shrink-0 size-3 text-gray-400 dark:text-white/60" />
                            <span className="mx-1">
                                <Plus className="shrink-0 size-3 text-gray-400 dark:text-white/60" />
                            </span>
                            <span className="text-xs">/</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-3.5 items-center">
                <div className="flex items-center">
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="relative block w-10 h-10 overflow-hidden rounded-full shadow focus:outline-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="size-10 rounded-full" />
                                </div>
                            ) : (
                                <Avatar>
                                    <AvatarImage
                                        src={userData?.avatar as string}
                                        alt={userData?.name}
                                    />
                                    <AvatarFallback>
                                        {userData?.name.split("")[0]}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </button>

                        <div
                            onClick={() => setDropdownOpen(false)}
                            className={`fixed inset-0 z-10 w-full h-full ${
                                dropdownOpen ? "" : "hidden"
                            }`}
                        ></div>

                        <div
                            className={`absolute right-0 z-10 w-48 mt-2 overflow-hidden bg-white dark:bg-muted rounded-md shadow-xl ${
                                dropdownOpen ? "" : "hidden"
                            }`}
                        >
                            <Link
                                href="/dashboard/personal-information"
                                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#0C1427] dark:hover:bg-slate-600 hover:text-white"
                            >
                                <LucideUserCircle size={18} />
                                <span>Profile</span>
                            </Link>
                            <div
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 cursor-pointer py-2 text-sm hover:bg-[#0C1427] dark:hover:bg-slate-600 hover:text-white"
                            >
                                <LucideLogOut size={18} />
                                Logout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashNavbar;
