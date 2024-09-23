import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/api/types/settings";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Loader2 } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const columns: (
  handleCategorySelect: (category: Category) => void,
  handleDeleteCategory: (categoryId: string) => void,
  deletingCategoryId: string | null,
) => ColumnDef<Category>[] = (
  handleCategorySelect,
  handleDeleteCategory,
  deletingCategoryId,
) => [
  {
    accessorKey: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "icon",
    accessorFn: (row) => row.icon,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Icon" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <i className={`icon-${row.original.icon} mr-2`} />
        {row.original.icon}
      </div>
    ),
  },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  { id: "color", accessorFn: (row) => row.color },
  {
    accessorKey: "color",
    accessorFn: (row) => row.color,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Color" />
    ),
    cell: ({ row }) => (
      <div
        className="h-6 w-6 rounded-full"
        style={{ backgroundColor: row.original.color }}
      />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCategorySelect(row.original)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteCategory(row.original.id)}
        >
          {deletingCategoryId === row.original.id ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </div>
    ),
  },
];
