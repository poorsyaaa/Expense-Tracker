import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
} from "@/api/mutations/settings/category-hook";
import { categorySchema, CategorySchema } from "@/lib/schema/settings";
import { GradientPicker } from "@/components/ui/color-picker";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { Separator } from "@/components/ui/separator";
import { Category, CategoryGroup } from "@/api/types/settings";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  Select,
} from "@/components/ui/select";

interface CategorySettingsFormProps {
  selectedCategory?: Category | null;
  categoryGroups?: Omit<CategoryGroup, "categories">[];
  onFormReset: (invalidate: boolean, updatedCategory?: Category) => void;
}

const CategorySettingsForm: React.FC<CategorySettingsFormProps> = ({
  selectedCategory,
  categoryGroups,
  onFormReset,
}) => {
  const submitButtonText = selectedCategory
    ? "Update Category"
    : "Save Category";

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { theme } = useTheme();

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: selectedCategory?.name ?? "",
      icon: selectedCategory?.icon ?? "💰",
      color: selectedCategory?.color ?? "#09203f",
      categoryGroupId: selectedCategory?.categoryGroupId ?? "",
    },
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    form.setValue("icon", emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const onSubmit = (data: CategorySchema) => {
    if (selectedCategory) {
      updateCategory(
        { data, endpoint: `/settings/category/${selectedCategory.id}` },
        {
          onSuccess: (response) => {
            onFormReset(true, response.category);
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
          onSuccess: (response) => {
            onFormReset(true, response.category);
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
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      readOnly
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      placeholder="Select emoji"
                      className="w-[47px] cursor-pointer"
                    />
                    {showEmojiPicker && (
                      <div
                        className={cn("absolute z-10 my-2", {
                          "bottom-full": !isDesktop,
                          "top-full": isDesktop,
                        })}
                      >
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
                          emojiStyle={EmojiStyle.APPLE}
                          height={350}
                          width={300}
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel>Name</FormLabel>
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
        </div>
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
        <FormField
          control={form.control}
          name="categoryGroupId"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Category Group</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value ? field.value.toString() : ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryGroups?.map((categoryGroup) => (
                    <SelectItem
                      key={categoryGroup.id}
                      value={categoryGroup.id.toString()}
                    >
                      {categoryGroup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
