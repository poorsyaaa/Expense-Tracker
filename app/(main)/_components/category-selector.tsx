import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, CategoryGroupResponse } from "@/api/types/settings";

interface CategorySelectorProps {
  field: any;
  categoryGroups?: CategoryGroupResponse;
  allCategories: Category[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  field,
  categoryGroups,
  allCategories,
}) => {
  const selectedCategory = allCategories.find(
    (category) => category.id === field.value,
  );

  return (
    <FormItem>
      <FormLabel>Category</FormLabel>
      <Select onValueChange={field.onChange} value={field.value || ""}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select category">
              {selectedCategory && (
                <div className="flex items-center gap-2">
                  <span>{selectedCategory.icon}</span>
                  <span>{selectedCategory.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {categoryGroups?.categoryGroups?.map((group) => (
            <div key={group.id} className="px-2 py-1.5">
              <div className="text-sm font-semibold">{group.name}</div>
              <div className="mt-1 space-y-1">
                {(group.categories || []).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </div>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default CategorySelector;
