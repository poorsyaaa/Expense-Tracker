import {
  useCreateCategoryGroup,
  useUpdateCategoryGroup,
} from "@/api/mutations/settings/category-group-hook";
import { CategoryGroup } from "@/api/types/settings";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  categoryGroupSchema,
  CategoryGroupSchema,
} from "@/lib/schema/settings";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";

interface CategoryGroupFormProps {
  selectedCategoryGroup?: Omit<CategoryGroup, "categories"> | null;
  onFormReset: (
    invalidate: boolean,
    updatedCategoryGroup?: Omit<CategoryGroup, "categories">,
  ) => void;
  className?: string;
  btnClassName?: string;
}

const CategoryGroupForm: React.FC<CategoryGroupFormProps> = ({
  selectedCategoryGroup,
  onFormReset,
  className,
  btnClassName,
}) => {
  const submitButtonText = selectedCategoryGroup
    ? "Update Category Group"
    : "Save Category Group";

  const { mutate: createCategoryGroup, isPending: isCreating } =
    useCreateCategoryGroup();
  const { mutate: updateCategoryGroup, isPending: isUpdating } =
    useUpdateCategoryGroup();

  const form = useForm<CategoryGroupSchema>({
    resolver: zodResolver(categoryGroupSchema),
    defaultValues: {
      name: selectedCategoryGroup?.name ?? "",
    },
  });

  const onSubmit = (data: CategoryGroupSchema) => {
    if (selectedCategoryGroup) {
      updateCategoryGroup(
        {
          data,
          endpoint: `/settings/category-group/${selectedCategoryGroup.id}`,
        },
        {
          onSuccess: (response) => {
            onFormReset(true, response.categoryGroup);
          },
          onError: (error) => {
            console.error("Update error:", error);
          },
        },
      );
    } else {
      createCategoryGroup(
        { data, endpoint: "/settings/category-group" },
        {
          onSuccess: (response) => {
            onFormReset(true, response.categoryGroup);
          },
          onError: (error) => {
            console.error("Create error:", error);
          },
        },
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter category group name"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-4" />
        <div className={cn("flex justify-end", btnClassName)}>
          {selectedCategoryGroup && (
            <Button
              onClick={() => onFormReset(false)}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryGroupForm;
