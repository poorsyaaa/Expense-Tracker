import { useForm, ControllerRenderProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { expenseSchema } from "@/lib/schema/expenses";
import { useGetCategoryGroups } from "@/api/queries/settings/category-group-hook";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ExpenseType, PaymentMethod } from "@prisma/client";
import { z } from "zod";

import { useMemo } from "react";

import DatePicker from "@/app/(main)/_components/date-picker";
import Loading from "../../loading";
import CategorySelector from "../category-selector";

const expenseTypes: { label: string; value: ExpenseType }[] = [
  { label: "One Time", value: "ONE_TIME" },
  { label: "Recurring", value: "RECURRING" },
  { label: "Transfer", value: "TRANSFER" },
];

const paymentMethods: { label: string; value: PaymentMethod }[] = [
  { label: "Credit Card", value: "CREDIT_CARD" },
  { label: "Debit Card", value: "DEBIT_CARD" },
  { label: "Cash", value: "CASH" },
  { label: "Bank Transfer", value: "BANK_TRANSFER" },
  { label: "Digital Bank", value: "DIGITAL_BANK" },
  { label: "Savings", value: "SAVINGS" },
  { label: "Other", value: "OTHER" },
];

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormValues>;
  onSubmit: (data: ExpenseFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const { data: categoryGroups, isPending } = useGetCategoryGroups();

  const allCategories = useMemo(
    () =>
      categoryGroups?.categoryGroups?.flatMap(
        (group) => group.categories || [],
      ) || [],
    [categoryGroups],
  );

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "ONE_TIME",
      paymentMethod: "CASH",
      isPaid: true,
      startDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: "", // Add default dueDate value
      tags: [],
      ...defaultValues,
    },
  });

  const handleTagInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !field.value.includes(value)) {
        const newTags = [...field.value, value];
        field.onChange(newTags);
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const removeTag = (
    tagToRemove: string,
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    const newTags = field.value.filter((tag: string) => tag !== tagToRemove);
    field.onChange(newTags);
  };

  if (isPending) return <Loading />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter expense description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <CategorySelector
              field={field}
              categoryGroups={categoryGroups}
              allCategories={allCategories}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    isModal
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Add the missing dueDate field */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    isModal
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPaid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Paid</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    placeholder="Add tags (press Enter or comma)"
                    onKeyDown={(e) =>
                      handleTagInput(
                        e,
                        field as unknown as ControllerRenderProps<
                          FieldValues,
                          string
                        >,
                      )
                    }
                  />
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() =>
                            removeTag(
                              tag,
                              field as unknown as ControllerRenderProps<
                                FieldValues,
                                string
                              >,
                            )
                          }
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expenseNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a note about this expense"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseForm;
