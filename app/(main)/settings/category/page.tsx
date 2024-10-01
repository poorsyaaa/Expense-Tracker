"use client";

import { useEffect, useRef, useState } from "react";

import { useUpdateCategory } from "@/api/mutations/settings/category-hook";
import { useGetCategoryGroups } from "@/api/queries/settings/category-group-hook";
import { Category, CategoryGroup } from "@/api/types/settings";
import { DropResult } from "@hello-pangea/dnd";
import DndContainer from "../../_components/dnd/dnd-container";
import CategoryGroupContainer from "../../_components/dnd/category-group-container";
import CategoryItem from "../../_components/dnd/category-item";
import { Loader2, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CustomModal,
  CustomModalContent,
  CustomModalHeader,
  CustomModalTitle,
  CustomModalDescription,
  CustomModalBody,
} from "@/components/ui/custom-modal";
import CategoryGroupForm from "../../_components/forms/category-group-form";

export default function Page() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetCategoryGroups();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryGroupId, setEditingCategoryGroupId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (data?.categoryGroups) {
      setCategoryGroups(data.categoryGroups);
    }
  }, [data]);
  const previousStateRef = useRef<CategoryGroup[]>([]);

  const handleEditCategoryGroupClick = (id: string) => {
    setEditingCategoryGroupId(id);
  };

  const handleCategoryGroupFormReset = (
    invalidate: boolean,
    updatedCategoryGroup?: Omit<CategoryGroup, "categories">,
  ) => {
    if (invalidate && updatedCategoryGroup) {
      setCategoryGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === updatedCategoryGroup.id
            ? { ...group, ...updatedCategoryGroup }
            : group,
        ),
      );

      previousStateRef.current = categoryGroups.map((group) => ({
        ...group,
        categories: [...group.categories],
      }));
    }

    setEditingCategoryGroupId(null);
    setIsModalOpen(false);
  };

  const handleAddCategoryGroup = () => {
    setIsModalOpen(true);
  };

  const handleFormReset = (
    invalidate: boolean,
    updatedCategory?: Category, // This will handle both moving and adding categories
    deletedCategoryId?: string,
  ) => {
    if (!invalidate) return;

    setCategoryGroups((prevGroups) => {
      let categoryMoved = false;
      let categoryDeleted = false;
      let categoryAdded = false;

      const newGroups = prevGroups.map((group) => {
        let categories = group.categories;

        // Check if the category is being moved or updated (including adding)
        if (
          updatedCategory &&
          categories.some((cat) => cat.id === updatedCategory.id)
        ) {
          categories = categories.filter(
            (cat) => cat.id !== updatedCategory.id,
          );
          categoryMoved = true; // Indicates that a category was moved
        }

        // Add the updated category to its new group (or add a new category)
        if (updatedCategory && group.id === updatedCategory.categoryGroupId) {
          categories = [...categories, updatedCategory];
          categoryAdded = true; // Indicates that a category was added or updated
        }

        // Handle the category deletion if a deletedCategoryId is provided
        if (
          deletedCategoryId &&
          updatedCategory &&
          categories.some((cat) => cat.id === updatedCategory.id)
        ) {
          categories = categories.filter(
            (cat) => cat.id !== updatedCategory.id,
          );
          categoryDeleted = true; // Indicates that a category was deleted
        }

        return categories === group.categories
          ? group
          : { ...group, categories }; // Return the updated group with new categories
      });

      return categoryMoved || categoryDeleted || categoryAdded
        ? newGroups
        : prevGroups;
    });

    // Invalidate the query for deleted categories
    if (deletedCategoryId) {
      queryClient.invalidateQueries({
        queryKey: ["category", deletedCategoryId],
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    previousStateRef.current = categoryGroups.map((group) => ({
      ...group,
      categories: [...group.categories],
    }));

    const sourceGroupIndex = categoryGroups.findIndex(
      (group) => group.id === source.droppableId,
    );
    const destinationGroupIndex = categoryGroups.findIndex(
      (group) => group.id === destination.droppableId,
    );

    if (sourceGroupIndex === -1 || destinationGroupIndex === -1) return;

    const sourceGroup = categoryGroups[sourceGroupIndex];
    const destinationGroup = categoryGroups[destinationGroupIndex];
    const [draggedItem] = sourceGroup.categories.splice(source.index, 1);

    destinationGroup.categories.splice(destination.index, 0, draggedItem);

    setLoadingCategoryId(draggedItem.id);

    setCategoryGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[sourceGroupIndex] = { ...sourceGroup };
      newGroups[destinationGroupIndex] = { ...destinationGroup };
      return newGroups;
    });

    updateCategory(
      {
        data: {
          categoryGroupId: destinationGroup.id,
          name: draggedItem.name,
          icon: draggedItem.icon,
          color: draggedItem.color,
        },
        pathParams: {
          categoryId: draggedItem.id,
        },
      },
      {
        onSuccess: () => {
          setLoadingCategoryId(null);
        },
        onError: () => {
          setCategoryGroups(previousStateRef.current);
          setLoadingCategoryId(null);
        },
      },
    );
  };

  if (isLoading) return <Loader2 className="mx-auto my-3 animate-spin" />;

  return (
    <>
      <Card className="w-full overflow-auto">
        <div className="flex flex-col p-6 pb-4 md:flex-row md:items-center md:justify-between">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <div className="mt-4 md:mt-0">
            <Button
              variant="default"
              className="w-full md:w-auto"
              onClick={handleAddCategoryGroup}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Category Group
            </Button>
          </div>
        </div>
        <CardContent className="px-6 pb-6">
          <DndContainer onDragEnd={onDragEnd}>
            {categoryGroups.map((categoryGroup) => (
              <CategoryGroupContainer
                droppableId={categoryGroup.id}
                key={categoryGroup.id}
                categoryGroup={categoryGroup}
                categoryGroups={categoryGroups}
                type="CATEGORY_GROUP"
                direction="vertical"
                isEditing={editingCategoryGroupId === categoryGroup.id}
                onEditClick={() =>
                  handleEditCategoryGroupClick(categoryGroup.id)
                }
                onFormReset={handleCategoryGroupFormReset}
                onCategoryFormReset={handleFormReset}
              >
                {categoryGroup.categories.map((category, index) => (
                  <CategoryItem
                    key={category.id}
                    draggableId={category.id}
                    index={index}
                    category={category}
                    categoryGroups={categoryGroups}
                    isLoading={isUpdating && loadingCategoryId === category.id}
                    onFormReset={handleFormReset}
                  />
                ))}
              </CategoryGroupContainer>
            ))}
          </DndContainer>
        </CardContent>
      </Card>

      <CustomModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CustomModalContent>
          <CustomModalHeader>
            <CustomModalTitle>Add Category group</CustomModalTitle>
            <CustomModalDescription>
              Add your category group details below.
            </CustomModalDescription>
          </CustomModalHeader>
          <CustomModalBody className="space-y-4 pb-4 text-sm sm:text-left">
            <CategoryGroupForm
              onFormReset={handleCategoryGroupFormReset}
              btnClassName="justify-end"
            />
          </CustomModalBody>
        </CustomModalContent>
      </CustomModal>
    </>
  );
}
