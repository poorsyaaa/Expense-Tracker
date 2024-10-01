import { useState } from "react";
import { Category, CategoryGroup } from "@/api/types/settings";
import { Button } from "@/components/ui/button";
import {
  CustomModal,
  CustomModalContent,
  CustomModalHeader,
  CustomModalTitle,
  CustomModalDescription,
  CustomModalBody,
} from "@/components/ui/custom-modal";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { Edit3, Trash } from "lucide-react";
import CategorySettingsForm from "../forms/category-settings-form";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useDeleteCategory } from "@/api/mutations/settings/category-hook";
import DeleteCategoryForm from "../forms/delete-category-form";
import { DeleteCategorySchema } from "@/lib/schema/settings";

interface CategoryItemProps {
  draggableId: string;
  index: number;
  key: string;
  category: Category;
  categoryGroups: Omit<CategoryGroup, "categories">[] | CategoryGroup[];
  isLoading?: boolean;
  onFormReset: (
    invalidate: boolean,
    updatedCategory?: Category,
    deletedCategoryId?: string,
  ) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  draggableId,
  index,
  key,
  category,
  categoryGroups,
  isLoading = false,
  onFormReset,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const onHandleDeleteSubmit = (data?: DeleteCategorySchema) => {
    deleteCategory(
      {
        data,
        pathParams: {
          categoryId: category.id,
        },
      },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          onFormReset(true, category, data?.categoryId);
        },
        onError: (error) => {
          console.error("Delete error:", error);
        },
      },
    );
  };

  const handleModalClose = (
    invalidate: boolean,
    updatedCategory?: Category,
  ) => {
    setIsModalOpen(false);
    onFormReset(invalidate, updatedCategory);
  };

  return (
    <>
      <Draggable draggableId={draggableId} index={index} key={key}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cn(
              "mb-2 flex items-stretch justify-between rounded border bg-[#ffffff] p-2 transition-colors duration-200 dark:bg-[#1c1917]",
              {
                "bg-secondary": isLoading,
                "border-primary": snapshot.isDragging,
              },
            )}
          >
            <div className="flex flex-grow items-center">
              <span
                className="mr-2 h-[60%] w-1 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <Label className="mr-3">{category.icon}</Label>
              <Label>{category.name}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={"ghost"}
                onClick={handleEditClick}
                disabled={isLoading}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant={"ghost"}
                onClick={handleDeleteClick}
                disabled={isLoading}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Draggable>

      {/* Edit Modal */}
      <CustomModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CustomModalContent>
          <CustomModalHeader>
            <CustomModalTitle>Edit Category</CustomModalTitle>
            <CustomModalDescription>
              Update your category details below.
            </CustomModalDescription>
          </CustomModalHeader>
          <CustomModalBody className="space-y-4 pb-4 text-sm sm:text-left">
            <CategorySettingsForm
              categoryGroups={categoryGroups}
              selectedCategory={category}
              onFormReset={handleModalClose}
            />
          </CustomModalBody>
        </CustomModalContent>
      </CustomModal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <DeleteCategoryForm
            categoryId={category.id}
            categoryGroups={categoryGroups as CategoryGroup[]}
            onSubmit={onHandleDeleteSubmit}
            isDeleting={isDeleting}
            onCancel={handleDeleteCancel}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CategoryItem;
