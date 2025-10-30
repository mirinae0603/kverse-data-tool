import { getUploads } from "@/api/dashboard.api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useEffect, useState } from "react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export type Upload = {
    upload_id: string
    status: string
}

export const uploadColumns: ColumnDef<Upload>[] = [
    {
        accessorKey: "upload_id",
        header: "Upload ID",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("upload_id")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const navigate = useNavigate();
            const uploadId = row.original.upload_id;
            const status = row.original.status;
            const disabled = status === 'Completed';
            return (
                <Button
                    variant="outline"
                    disabled={disabled}
                    onClick={() => navigate(`/uploads/${uploadId}`)
                }
                >
                    View
                </Button>
            );
        },
    },
];


export function DataTable({ data }: { data: Array<any> }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const table = useReactTable({
        data,
        columns: uploadColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
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
                                    colSpan={uploadColumns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
            </div>
        </div>
    )
}

const ViewUploads = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [uploads, setUploads] = useState<Array<Upload>>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUploads = async () => {
            try {
                const response = await getUploads();
                if (response.status === "success") {
                    const data = response.uploads;
                    setUploads(data);
                    return;
                }
                setError("Failed to fetch upload data");
            } catch (error) {
                console.error(error);
                setError("Failed to fetch upload data");
            } finally {
                setLoading(false);
            }
        }
        fetchUploads();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Spinner />
            </div>
        );
    }

    if(error) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <p>{error}</p>
            </div>
        )
    }

    return <>
        <div className="flex flex-col flex-1 p-4">
            <DataTable data={uploads} />
        </div>
    </>
}

export default ViewUploads;