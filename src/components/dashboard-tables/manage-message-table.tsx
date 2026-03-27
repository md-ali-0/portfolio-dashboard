"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ErrorResponse, TMeta } from "@/types";
import { ContactMessage } from "@/types/Message";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Mail, MailOpen, Trash2, Eye } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    useGetAllMessagesQuery,
    useUpdateMessageStatusMutation,
    useDeleteMessageMutation,
} from "@/redux/features/message/messageApi";
import { DataTable } from "../data-table/data-table";
import DeleteDialog from "../shared/delete-dialog";

const ManageMessageTable: FC = () => {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    const { data, isError, isLoading } = useGetAllMessagesQuery([
        { name: "limit", value: limit },
        { name: "page", value: page },
        { name: "searchTerm", value: search },
    ]);

    const [updateStatus] = useUpdateMessageStatusMutation();
    const [deleteMessage, { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError }] = useDeleteMessageMutation();

    useEffect(() => {
        if (isError) {
            toast.error("Failed to load messages");
        }
    }, [isError]);

    useEffect(() => {
        if (isDeleteSuccess) toast.success("Message deleted successfully");
        if (isDeleteError) {
            const msg = ((deleteError as ErrorResponse)?.data?.message) || "Failed to delete message";
            toast.error(msg);
        }
    }, [isDeleteSuccess, isDeleteError, deleteError]);

    const handleDeleteClick = (message: ContactMessage) => {
        setMessageToDelete(message);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        await deleteMessage(id);
    };

    const handleViewMessage = async (message: ContactMessage) => {
        setSelectedMessage(message);
        setViewDialogOpen(true);
        if (!message.isRead) {
            await updateStatus({ id: message.id, body: { isRead: true } });
        }
    };

    const toggleReadStatus = async (message: ContactMessage) => {
        await updateStatus({ id: message.id, body: { isRead: !message.isRead } });
        toast.success(`Message marked as ${!message.isRead ? 'read' : 'unread'}`);
    };

    const columns: ColumnDef<ContactMessage>[] = [
        {
            accessorKey: "name",
            header: "Sender",
            cell: ({ row }) => (
                <div className={!row.original.isRead ? "font-bold" : ""}>
                    <p className="font-medium text-foreground">{row.original.name}</p>
                    <p className="text-xs text-muted-foreground">{row.original.email}</p>
                </div>
            ),
        },
        {
            accessorKey: "subject",
            header: "Subject",
            cell: ({ row }) => (
                <p className={`max-w-xs truncate text-sm ${!row.original.isRead ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {row.original.subject}
                </p>
            ),
        },
        {
            accessorKey: "isRead",
            header: "Status",
            cell: ({ row }) => (
                row.original.isRead ? (
                    <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                        Read
                    </Badge>
                ) : (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
                        New
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
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleViewMessage(row.original)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleReadStatus(row.original)}>
                            {row.original.isRead ? (
                                <><Mail className="mr-2 h-4 w-4" /> Mark Unread</>
                            ) : (
                                <><MailOpen className="mr-2 h-4 w-4" /> Mark Read</>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDeleteClick(row.original)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
            
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                             <Mail className="h-5 w-5 text-emerald-400" />
                             Message Details
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Received on {selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">From</p>
                                    <p className="font-medium">{selectedMessage.name}</p>
                                    <p className="text-sm text-zinc-400">{selectedMessage.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Subject</p>
                                    <p className="font-medium">{selectedMessage.subject}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Message</p>
                                <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 text-zinc-300 whitespace-pre-wrap min-h-[150px]">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <DeleteDialog
                id={messageToDelete?.id as string}
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default ManageMessageTable;
