import ManagePostTable from "@/components/dashboard-tables/manage-post-table";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostPage() {
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-sm border bg-white dark:bg-gray-900 mt-5">
                <div className="flex justify-between items-center border-b px-7 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                        Manage Posts
                    </h3>
                    <Button asChild variant={"default"} size={"sm"}>
                        <Link href={"/dashboard/create-post"}>Create Post</Link>
                    </Button>
                </div>
                <div className="p-5">
                    <ManagePostTable />
                </div>
            </div>
        </div>
    );
}
