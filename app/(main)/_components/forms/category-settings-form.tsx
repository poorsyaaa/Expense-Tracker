import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/api/mutations/settings-hook";
import { categorySchema, CategorySchema } from "@/lib/schema/settings";
import { GradientPicker } from "@/components/ui/color-picker";
import { IconPicker } from "@/components/ui/icon-picker";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/api/types/settings";

interface CategorySettingsFormProps {
  selectedCategory?: Category | null;
  onFormReset: (invalidate: boolean) => void;
}

const CategorySettingsForm: React.FC<CategorySettingsFormProps> = ({
  selectedCategory,
  onFormReset,
}) => {
  const submitButtonText = selectedCategory
    ? "Update Category"
    : "Save Category";

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    form.reset({
      name: selectedCategory?.name ?? "",
      icon: selectedCategory?.icon ?? "DollarSign",
      color: selectedCategory?.color ?? "#09203f",
    });
  }, [selectedCategory, form]);

  const onSubmit = (data: CategorySchema) => {
    if (selectedCategory) {
      updateCategory(
        { data, endpoint: `/settings/category/${selectedCategory.id}` },
        {
          onSuccess: () => {
            onFormReset(true);
          },
          onError: (error) => {
            console.error("Update error:", error);
          },
        },
      );
    } else {
      createCategory(
        { data, endpoint: "/settings/category" },
        {
          onSuccess: () => {
            onFormReset(true);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter category name"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Icon</FormLabel>
              <FormControl>
                <IconPicker
                  icon={field.value}
                  setIcon={(icon) => field.onChange(icon)}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Color</FormLabel>
              <FormControl>
                <GradientPicker
                  background={field.value ?? "#09203f"}
                  setBackground={(color) => field.onChange(color)}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-4" />
        <div className="mt-4">
          <Button
            type="submit"
            className="w-full"
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

export default CategorySettingsForm;
