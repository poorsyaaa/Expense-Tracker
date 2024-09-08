"use client";

import { useSettings } from "@/context/settingsContext";
import { useState } from "react";
import CategorySettingsForm from "../../_components/category-settings-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/api/types/settings";
import { Pencil, Trash, Plus, FolderPlus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Page() {
  const { categories, isLoading } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [openDialog, setOpenDialog] = useState(false);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleAddNewCategory = () => {
    setSelectedCategory(null);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>Category Settings</CardTitle>
            <CardDescription>Add or update your categories</CardDescription>
          </CardHeader>
          <div className="flex flex-col space-y-1.5 p-6">
            <Button onClick={handleAddNewCategory}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
        </div>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                if (isLoading) {
                  return (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="flex justify-center py-4">
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          <span>Loading categories...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                if (!categories || categories.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="flex flex-col items-center py-10">
                          <FolderPlus className="mb-4 h-12 w-12" />
                          <Label>No categories found.</Label>
                          <Label>
                            Click on the plus button to add a new category.
                          </Label>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                return categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <i className={`icon-${category.icon} mr-2`} />
                        {category.icon}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleCategorySelect(category)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center"
                        disabled
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for Category Form */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Update your category details below."
                : "Add a new category to your list."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <CategorySettingsForm
              selectedCategory={selectedCategory}
              onFormReset={handleDialogClose}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
