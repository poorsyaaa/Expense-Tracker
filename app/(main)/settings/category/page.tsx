"use client";

import { useState } from "react";
import CategorySettingsForm from "../../_components/forms/category-settings-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  CustomModal,
  CustomModalBody,
  CustomModalContent,
  CustomModalDescription,
  CustomModalHeader,
  CustomModalTitle,
} from "@/components/ui/custom-modal";
import { Category } from "@/api/types/settings";
import { FilePlus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useDeleteCategory } from "@/api/mutations/settings-hook";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./column";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useGetCategories } from "@/api/queries/settings-hook";

export default function Page() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState | undefined>(undefined);

  console.log(sorting);

  const { data, isLoading } = useGetCategories({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: sorting?.[0]?.id ?? "createdAt",
    order: sorting?.[0]?.desc ? "desc" : "asc",
  });

  const { mutate: deleteCategory } = useDeleteCategory();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleAddNewCategory = () => {
    setSelectedCategory(null);
    setOpenDialog(true);
  };

  const handleDialogClose = (invalidate: boolean = false) => {
    if (invalidate)
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    setOpenDialog(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    deleteCategory(
      { endpoint: `/settings/category/${categoryId}` },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["default-settings"] });
          setDeletingCategoryId(null); // Reset deleting state
        },
        onError: () => {
          setDeletingCategoryId(null); // Reset deleting state in case of error
        },
      },
    );
  };

  return (
    <>
      <Card className="w-full overflow-auto">
        <div className="flex flex-col p-6 pb-4 md:flex-row md:items-center md:justify-between">
          <CardHeader className="p-0">
            <CardTitle>Category Settings</CardTitle>
            <CardDescription>Add or update your categories</CardDescription>
          </CardHeader>
          <div className="mt-4 md:mt-0">
            <Button onClick={handleAddNewCategory} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        </div>
        <CardContent className="px-6 pb-6">
          <DataTable
            columns={columns(
              handleCategorySelect,
              handleDeleteCategory,
              deletingCategoryId,
            )}
            data={data?.categories ?? []}
            isLoading={isLoading}
            emptyDisplay={
              <div className="flex flex-col items-center py-10">
                <FilePlus className="mb-4 h-12 w-12" />
                <Label>No categories found.</Label>
                <Label>Click on the plus button to add a new category.</Label>
              </div>
            }
            state={{
              totalCount: data?.totalItems ?? 0,
              pagination,
              sortBy: sorting,
            }}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
          />
        </CardContent>
      </Card>

      {/* Dialog for Category Form */}
      <CustomModal open={openDialog} onOpenChange={setOpenDialog}>
        <CustomModalContent>
          <CustomModalHeader>
            <CustomModalTitle>
              {selectedCategory ? "Edit Category" : "Create New Category"}
            </CustomModalTitle>
            <CustomModalDescription>
              {selectedCategory
                ? "Update your category details below."
                : "Add a new category to your list."}
            </CustomModalDescription>
          </CustomModalHeader>
          <CustomModalBody className="space-y-4 pb-4 text-sm sm:pb-0 sm:text-left">
            <CategorySettingsForm
              selectedCategory={selectedCategory}
              onFormReset={handleDialogClose}
            />
          </CustomModalBody>
        </CustomModalContent>
      </CustomModal>
    </>
  );
}
