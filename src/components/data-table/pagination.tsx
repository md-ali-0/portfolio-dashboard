import { Table } from "@tanstack/react-table";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    LucideChevronsLeft,
    LucideChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TMeta } from "@/types";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    meta: TMeta;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
    table,
    meta,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps<TData>) {

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-between px-2 gap-2 md:gap-0">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center md:space-x-8 gap-2">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                            onPageSizeChange(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={
                                    table.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {meta?.page} of {meta?.totalPage}
                </div>
                <div className="flex items-center space-x-2">
                <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(1)}
                        disabled={meta?.page === 1}
                    >
                        <LucideChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(meta?.page - 1)} 
                        disabled={meta?.page === 1}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(meta?.page + 1)}
                        disabled={meta?.page === meta?.totalPage}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(meta?.totalPage)}
                        disabled={meta?.page === meta?.totalPage}
                    >
                        <LucideChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
