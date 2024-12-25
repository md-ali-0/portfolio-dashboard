import ManageTechnologyTable from "@/components/dashboard-tables/manage-technology-table";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-sm border bg-white dark:bg-gray-900 mt-5">
                <div className="flex justify-between items-center border-b px-7 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                        Manage Technologies
                    </h3>
                    <Button asChild variant={"default"} size={"sm"}>
                        <Link href={"/dashboard/create-technology"}>Create Technology</Link>
                    </Button>
                </div>
                <div className="p-5">
                    <ManageTechnologyTable />
                </div>
            </div>
        </div>
    );
}
