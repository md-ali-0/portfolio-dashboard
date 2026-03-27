"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Comment, ErrorResponse, TMeta } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, CheckCircle, XCircle } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

import {
    useGetAllCommentsQuery,
    useApproveCommentMutation,
    useRejectCommentMutation,
    useDeleteCommentMutation,
} from "@/redux/features/comment/commentApi";
import { DataTable } from "../data-table/data-table";
import DeleteDialog from "../shared/delete-dialog";

const ManageCommentTable: FC = () => {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

    const { data, isError, isLoading } = useGetAllCommentsQuery([
        { name: "limit", value: limit },
        { name: "page", value: page },
        { name: "searchTerm", value: search },
    ]);

    useEffect(() => {
        if (isError) {
            toast.error("Failed to load comments");
        }
    }, [isError]);

    const [approveComment, { isSuccess: isApproveSuccess, isError: isApproveError, error: approveError }] =
        useApproveCommentMutation();
    const [rejectComment, { isSuccess: isRejectSuccess, isError: isRejectError, error: rejectError }] =
        useRejectCommentMutation();
    const [deleteComment, { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError }] =
        useDeleteCommentMutation();

    useEffect(() => {
        if (isApproveSuccess) toast.success("Comment approved successfully");
        if (isApproveError) {
            const msg = ((approveError as ErrorResponse)?.data?.message) || "Failed to approve comment";
            toast.error(msg);
        }
    }, [isApproveSuccess, isApproveError, approveError]);

    useEffect(() => {
        if (isRejectSuccess) toast.success("Comment rejected");
        if (isRejectError) {
            const msg = ((rejectError as ErrorResponse)?.data?.message) || "Failed to reject comment";
            toast.error(msg);
        }
    }, [isRejectSuccess, isRejectError, rejectError]);

    useEffect(() => {
        if (isDeleteSuccess) toast.success("Comment deleted successfully");
        if (isDeleteError) {
            const msg = ((deleteError as ErrorResponse)?.data?.message) || "Failed to delete comment";
            toast.error(msg);
        }
    }, [isDeleteSuccess, isDeleteError, deleteError]);

    const handleDeleteClick = (comment: Comment) => {
        setCommentToDelete(comment);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        await deleteComment(id);
    };

    const columns: ColumnDef<Comment>[] = [
        {
            accessorKey: "name",
            header: "Author",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.original.name}</p>
                    <p className="text-xs text-muted-foreground">{row.original.email}</p>
                </div>
            ),
        },
        {
            accessorKey: "content",
            header: "Comment",
            cell: ({ row }) => (
                <p className="max-w-xs truncate text-sm text-muted-foreground">
                    {row.original.content}
                </p>
            ),
        },
        {
            accessorKey: "isApproved",
            header: "Status",
            cell: ({ row }) => (
                row.original.isApproved ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
                        <CheckCircle size={12} className="mr-1" /> Approved
                    </Badge>
                ) : (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
                        <XCircle size={12} className="mr-1" /> Pending
                    </Badge>
                )
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(String(row.original.createdAt)).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            ),
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical size={20} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {!row.original.isApproved && (
                            <DropdownMenuItem onClick={() => approveComment(row.original.id)}>
                                Approve
                            </DropdownMenuItem>
                        )}
                        {row.original.isApproved && (
                            <DropdownMenuItem onClick={() => rejectComment(row.original.id)}>
                                Reject
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={() => handleDeleteClick(row.original)}
                            className="text-destructive focus:text-destructive"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
                onSearchValueChange={setSearch}
                onPageChange={setPage}
                onPageSizeChange={setLimit}
                meta={data?.meta as TMeta}
            />
            <DeleteDialog
                id={commentToDelete?.id as string}
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default ManageCommentTable;
