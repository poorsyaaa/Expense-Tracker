import { Category, CategoryGroup } from "@/api/types/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Direction,
  Droppable,
  DroppableProvided,
  TypeId,
} from "@hello-pangea/dnd";
import CategoryGroupForm from "../forms/category-group-form";
import { Button } from "@/components/ui/button";
import { Edit3, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  CustomModal,
  CustomModalContent,
  CustomModalHeader,
  CustomModalTitle,
  CustomModalDescription,
  CustomModalBody,
} from "@/components/ui/custom-modal";
import CategorySettingsForm from "../forms/category-settings-form";

interface CategoryGroupContainerProps {
  droppableId: string;
  direction: Direction;
  type: TypeId;
  key: string;
  categoryGroup: Omit<CategoryGroup, "categories">;
  categoryGroups: CategoryGroup[];
  isEditing?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  onEditClick?: () => void;
  onFormReset: (
    invalidate: boolean,
    updatedCategoryGroup?: Omit<CategoryGroup, "categories">,
  ) => void;
  onCategoryFormReset: (
    invalidate: boolean,
    updatedCategory?: Category,
    deletedCategoryId?: string,
  ) => void;
}

const CategoryGroupContainer: React.FC<CategoryGroupContainerProps> = ({
  droppableId,
  direction,
  type,
  key,
  isEditing,
  categoryGroup,
  categoryGroups,
  children,
  onEditClick,
  onFormReset,
  onCategoryFormReset,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategoryClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (
    invalidate: boolean,
    updatedCategory?: Category,
  ) => {
    onCategoryFormReset(invalidate, updatedCategory);
    setIsModalOpen(false);
  };

  return (
    <>
      <Droppable
        droppableId={droppableId}
        key={key}
        direction={direction ?? "vertical"}
        type={type ?? "DEFAULT"}
      >
        {(provided: DroppableProvided) => (
          <Card
            className="mb-4 rounded-none bg-muted"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <CardHeader>
              <CardTitle>
                {isEditing ? (
                  <CategoryGroupForm
                    selectedCategoryGroup={categoryGroup}
                    onFormReset={onFormReset}
                    className="w-full"
                    btnClassName="justify-end"
                  />
                ) : (
                  <div className="flex justify-between">
                    <CardTitle>{categoryGroup.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-3"
                      onClick={onEditClick}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      <Label>Edit</Label>
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent>
              {children}
              {provided.placeholder}
              <Button
                variant="ghost"
                className="mt-2 w-full hover:bg-[#ffffff] hover:dark:bg-[#1c1917] sm:w-auto"
                onClick={handleAddCategoryClick}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </CardContent>
          </Card>
        )}
      </Droppable>

      <CustomModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CustomModalContent>
          <CustomModalHeader>
            <CustomModalTitle>Add Category</CustomModalTitle>
            <CustomModalDescription>
              Add your category details below.
            </CustomModalDescription>
          </CustomModalHeader>
          <CustomModalBody className="space-y-4 pb-4 text-sm sm:text-left">
            <CategorySettingsForm
              selectedCategoryGroup={categoryGroup}
              categoryGroups={categoryGroups}
              onFormReset={handleModalClose}
            />
          </CustomModalBody>
        </CustomModalContent>
      </CustomModal>
    </>
  );
};

export default CategoryGroupContainer;
