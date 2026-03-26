import ManageCategoryTable from "@/components/dashboard-tables/manage-category-table";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CategoryPage() {
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-xl border border-border bg-card mt-5 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center border-b border-border px-7 py-4">
                    <h3 className="font-semibold text-foreground">
                        Manage Category
                    </h3>
                    <Button asChild variant={"default"} size={"sm"}>
                        <Link href={"/dashboard/create-category"}>
                            Create Category
                        </Link>
                    </Button>
                </div>
                <div className="p-5">
                    <ManageCategoryTable />
                </div>
            </div>
        </div>
    );
}

