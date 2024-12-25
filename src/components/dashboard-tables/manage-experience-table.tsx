/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ErrorResponse, Experience, TMeta } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

import { useGetAllExperiencesQuery } from "@/redux/features/experience/experienceApi";
import { useDeletePostMutation } from "@/redux/features/post/postApi";
import { DataTable } from "../data-table/data-table";
import DeleteDialog from "../shared/delete-dialog";

const ManageExperienceTable: FC = () => {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [experienceToEdit, setExperienceToEdit] = useState<Experience | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Experience | null>(null);

    const { data, isError, isLoading, isSuccess, error } =
        useGetAllExperiencesQuery([
            {
                name: "limit",
                value: limit,
            },
            {
                name: "page",
                value: page,
            },
            {
                name: "searchTerm",
                value: search,
            },
        ]);

    useEffect(() => {
        if (isError) {
            toast.error("Something Went Wrong");
        }
    }, [isError, isSuccess, error]);

    const handleEditClick = (experience: Experience) => {
        setExperienceToEdit(experience);
        setEditDialogOpen(true);
    };

    const handleDeleteClick = (experience: Experience) => {
        setPostToDelete(experience);
        setDeleteDialogOpen(true);
    };

    const columns: ColumnDef<Experience>[] = [
        {
            accessorKey: "companyName",
            header: "Company Name",
        },
        {
            accessorKey: "position",
            header: "Position",
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ row }) => {
                return (
                    <div className="">
                        {new Date(
                            String(row.original.startDate)
                        ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                );
            },
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            cell: ({ row }) => {
                return (
                    <div className="">
                        {row.original.endDate ? new Date(
                            String(row.original.endDate)
                        ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) : "Present"}
                    </div>
                );
            },
        },
        {
            accessorKey: "Last Updated",
            header: "Last Updated",
            cell: ({ row }) => {
                return (
                    <div className="">
                        {new Date(
                            String(row.original.updatedAt)
                        ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                );
            },
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical size={20} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleEditClick(row.original)}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteClick(row.original)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const [
        deleteBrand,
        {
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            error: deleteError,
        },
    ] = useDeletePostMutation();

    useEffect(() => {
        if (isDeleteError) {
            const errorResponse = deleteError as
                | ErrorResponse
                | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isDeleteSuccess) {
            toast.success("Brand Deleted successfully");
        }
    }, [isDeleteError, isDeleteSuccess, deleteError]);

    const handleDelete = async (id: string) => {
        await deleteBrand(id);
    };

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
                id={postToDelete?.id as string}
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default ManageExperienceTable;
