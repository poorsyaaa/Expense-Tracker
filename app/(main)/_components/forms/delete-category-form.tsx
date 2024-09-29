import { CategoryGroup } from "@/api/types/settings";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteCategorySchema,
  DeleteCategorySchema,
} from "@/lib/schema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useGetCategory } from "@/api/queries/settings/category-hook";

interface DeleteCategoryFormProps {
  categoryId: string;
  categoryGroups: CategoryGroup[];
  onSubmit: (data?: DeleteCategorySchema) => void;
  isDeleting: boolean;
  onCancel: () => void;
}

const DeleteCategoryForm: React.FC<DeleteCategoryFormProps> = ({
  categoryId,
  categoryGroups,
  isDeleting,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<DeleteCategorySchema>({
    resolver: zodResolver(deleteCategorySchema),
    defaultValues: {
      categoryId: "",
    },
  });
  const { data, isLoading: isLoadingCategory } = useGetCategory(categoryId);

  const hasExpenses = data?.expenseCount !== undefined && data.expenseCount > 0;

  if (isLoadingCategory) {
    return (
      <div className="mx-auto">
        <Loader2 className="mx-auto my-3 animate-spin" />
        Checking if category has expenses...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasExpenses ? "Move Expenses Before Deleting" : "Delete Category"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasExpenses ? (
              <>
                This category has associated{" "}
                <span className="font-semibold underline">
                  {data.expenseCount} expenses
                </span>
                . Please select a new category to move them to before deleting.
              </>
            ) : (
              "This action cannot be undone. This will permanently delete the category."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {hasExpenses && (
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value ? field.value.toString() : ""}
                  disabled={isLoadingCategory || isDeleting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select new category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryGroups.map((categoryGroup) =>
                      categoryGroup.categories
                        .filter((category) => category.id !== categoryId)
                        .map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        )),
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction type="submit" disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export default DeleteCategoryForm;
