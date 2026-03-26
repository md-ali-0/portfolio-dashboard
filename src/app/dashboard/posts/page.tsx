import ManagePostTable from "@/components/dashboard-tables/manage-post-table";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostPage() {
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-xl border border-border bg-card mt-5 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center border-b border-border px-7 py-4">
                    <h3 className="font-semibold text-foreground">
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

