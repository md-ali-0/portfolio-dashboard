import ManageCommentTable from "@/components/dashboard-tables/manage-comment-table";
import Breadcrumb from "@/components/shared/breadcrumb";

export default function CommentsPage() {
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-xl border border-border bg-card mt-5 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center border-b border-border px-7 py-4">
                    <h3 className="font-semibold text-foreground">
                        Manage Comments
                    </h3>
                </div>
                <div className="p-5">
                    <ManageCommentTable />
                </div>
            </div>
        </div>
    );
}
