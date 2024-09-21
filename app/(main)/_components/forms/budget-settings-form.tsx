import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, BudgetSchema } from "@/lib/schema/settings";

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
  useCreateMonthlyBudget,
  useUpdateMonthlyBudget,
} from "@/api/mutations/settings-hook";
import {
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { months, years } from "../../config/constant";
import { MonthlyBudget } from "@/api/types/settings";
import { Separator } from "@/components/ui/separator";

interface BudgetSettingsFormProps {
  selectedBudget?: MonthlyBudget | null;
  defaultBudget?: number;
  onFormReset: (invalidate: boolean) => void;
}

const BudgetSettingsForm: React.FC<BudgetSettingsFormProps> = ({
  selectedBudget,
  onFormReset,
  defaultBudget = 0,
}) => {
  const submitButtonText = selectedBudget ? "Update Budget" : "Save Budget";

  const { mutate: createBudget, isPending: isCreating } =
    useCreateMonthlyBudget();
  const { mutate: updateBudget, isPending: isUpdating } =
    useUpdateMonthlyBudget();

  const form = useForm<BudgetSchema>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: selectedBudget?.amount ?? defaultBudget,
      month: selectedBudget?.month ?? 1,
      year: selectedBudget?.year ?? 2024,
    },
  });

  const onSubmit = (data: BudgetSchema) => {
    if (selectedBudget) {
      updateBudget(
        {
          data,
          endpoint: `/settings/budget/${selectedBudget.id}`,
        },
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
      createBudget(
        {
          data,
          endpoint: "/settings/budget",
        },
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
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Monthly Budget</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? 0}
                  inputMode="numeric"
                  placeholder="Enter monthly budget"
                  onChange={(e) => {
                    if (e.target.value === "") return field.onChange(undefined);
                    field.onChange(Number(e.target.value));
                  }}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Month</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === "") return field.onChange(undefined);
                  field.onChange(Number(value));
                }}
                value={field.value ? field.value.toString() : ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {months.map(({ label, value }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
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
          name="year"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Year</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === "") return field.onChange(undefined);
                  field.onChange(Number(value));
                }}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-4" />
        <div className="flex justify-end">
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

export default BudgetSettingsForm;
