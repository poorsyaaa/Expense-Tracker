import { CategoryGroup } from "@/api/types/settings";
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

interface CategoryGroupContainerProps {
  droppableId: string;
  direction: Direction;
  type: TypeId;
  key: string;
  categoryGroup: Omit<CategoryGroup, "categories">;
  isEditing?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  onEditClick?: () => void;
  onFormReset: (
    invalidate: boolean,
    updatedCategoryGroup?: Omit<CategoryGroup, "categories">,
  ) => void;
}

const CategoryGroupContainer: React.FC<CategoryGroupContainerProps> = ({
  droppableId,
  direction,
  type,
  key,
  isEditing,
  categoryGroup,
  children,
  onEditClick,
  onFormReset,
}) => {
  return (
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
                <div className="flex items-center">
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
            >
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </CardContent>
        </Card>
      )}
    </Droppable>
  );
};

export default CategoryGroupContainer;
