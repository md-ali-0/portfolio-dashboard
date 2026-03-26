import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function DataTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">
                        <Skeleton className="h-4 w-[100px]" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableHead>
                    <TableHead className="text-right">
                        <Skeleton className="h-4 w-[100px]" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}
