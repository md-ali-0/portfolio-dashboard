import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TMeta } from "@/types";
import { useState } from "react";
import DataTablePaginationSkeleton from "../skeleton/data-table-pagination-skeleton";
import DataTableSkeleton from "../skeleton/data-table-skeleton";
import { DataTableViewOptions } from "./columns-toggle";
import { DataTablePagination } from "./pagination";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    meta: TMeta;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onSearchValueChange: (searchValue: string) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    meta,
    isLoading,
    onPageChange,
    onPageSizeChange,
    onSearchValueChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    return (
        <div>
            <div className="flex items-center pb-2 mb-1.5">
                <Input
                    placeholder="Search Here..."
                    onChange={(event) =>
                        onSearchValueChange(event.target.value)
                    }
                    className="max-w-64"
                    type="search"
                />
                <DataTableViewOptions table={table} />
            </div>
            <div className="rounded-md border">
                {isLoading ? (
                    <DataTableSkeleton />
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-100 dark:bg-slate-800">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className="py-4">
                {isLoading ? (
                    <DataTablePaginationSkeleton />
                ) : (
                    <DataTablePagination
                        table={table}
                        meta={meta}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                    />
                )}
            </div>
        </div>
    );
}
