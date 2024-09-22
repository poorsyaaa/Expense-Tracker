"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  Updater,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-label";
import { FilePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyDisplay?: React.ReactNode;
  className?: string;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sortingState: SortingState) => void;
  state: {
    totalCount: number;
    pagination: PaginationState;
    sortBy?: SortingState;
  };
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  isLoading,
  emptyDisplay,
  className,
  state,
  onSortingChange,
  onPaginationChange,
}: Readonly<DataTableProps<TData, TValue>>) => {
  const onSortingChangeHandler = (updater: Updater<SortingState>) => {
    const newState =
      typeof updater === "function" ? updater(state.sortBy ?? []) : updater;
    if (onSortingChange) {
      onSortingChange(newState);
    }
  };

  const onPaginationChangeHandler = (updater: Updater<PaginationState>) => {
    const newState =
      typeof updater === "function" ? updater(state.pagination) : updater;
    if (onPaginationChange) {
      onPaginationChange(newState);
    }
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(state.totalCount / state.pagination.pageSize),
    state: {
      pagination: state.pagination,
      sorting: state.sortBy,
    },
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: onSortingChangeHandler,
    onPaginationChange: onPaginationChangeHandler,
  });

  const defaultEmptyDisplay = (
    <div className="flex flex-col items-center py-10">
      <FilePlus className="mb-4 h-12 w-12" />
      <Label>No data found.</Label>
      <Label>Click on the plus button to add new data.</Label>
    </div>
  );

  return (
    <div className={cn("w-full space-y-2.5 overflow-auto", className)}>
      {isLoading ? (
        <DataTableSkeleton
          columnCount={columns.length}
          rowCount={10}
          searchableColumnCount={0}
          filterableColumnCount={0}
          showViewOptions={false}
          cellWidths={["auto"]}
          shrinkZero={true}
        />
      ) : (
        <>
          <div className="rounded-md border">
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
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoading) {
                    return (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span>Loading...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (table.getRowModel().rows?.length) {
                    return table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ));
                  }

                  return (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {emptyDisplay ?? defaultEmptyDisplay}
                      </TableCell>
                    </TableRow>
                  );
                })()}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-2.5">
            <DataTablePagination table={table} pageSizeOptions={[10, 20, 50]} />
          </div>
        </>
      )}
    </div>
  );
};
