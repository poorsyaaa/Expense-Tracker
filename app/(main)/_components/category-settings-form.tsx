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
import { useCreateOrUpdateCategory } from "@/api/mutations/settings-hook";
import { categorySchema, CategorySchema } from "@/lib/schema/settings";
import { GradientPicker } from "@/components/ui/color-picker";
import { IconPicker } from "@/components/ui/icon-picker";
import { Separator } from "@/components/ui/separator";

interface CategorySettingsFormProps {
  selectedCategory?: CategorySchema | null;
  onFormReset: () => void;
}

const CategorySettingsForm: React.FC<CategorySettingsFormProps> = ({
  selectedCategory,
  onFormReset,
}) => {
  console.log(selectedCategory);
  const submitButtonText = selectedCategory
    ? "Update Category"
    : "Save Category";

  const { mutate, isPending } = useCreateOrUpdateCategory();

  // Initialize form with default values
  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", icon: "DollarSign", color: "#09203f" },
  });

  // Update form with selected category data when editing
  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        name: selectedCategory.name,
        icon: selectedCategory.icon,
        color: selectedCategory.color,
      });
    } else {
      form.reset({ name: "", icon: "DollarSign", color: "#09203f" });
    }
  }, [selectedCategory, form]);

  const onSubmit = (data: CategorySchema) => {
    mutate({
      data,
      endpoint: "/settings/category",
    });
    onFormReset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Category Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter category name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Icon Field */}
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Color Field */}
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-4" />
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
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
