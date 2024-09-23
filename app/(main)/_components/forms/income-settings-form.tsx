import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema, IncomeSchema } from "@/lib/schema/settings";

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
  useCreateMonthlyIncome,
  useUpdateMonthlyIncome,
} from "@/api/mutations/settings-hook";
import {
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { months, years } from "../../config/constant";
import { MonthlyIncome } from "@/api/types/settings";
import { Separator } from "@/components/ui/separator";

interface IncomeSettingsFormProps {
  selectedIncome?: MonthlyIncome | null;
  defaultIncome?: number;
  onFormReset: (invalidate: boolean, queryKey?: string) => void;
}

const IncomeSettingsForm: React.FC<IncomeSettingsFormProps> = ({
  selectedIncome,
  onFormReset,
  defaultIncome = 0,
}) => {
  const submitButtonText = selectedIncome ? "Update Income" : "Save Income";

  const { mutate: createIncome, isPending: isCreating } =
    useCreateMonthlyIncome();
  const { mutate: updateIncome, isPending: isUpdating } =
    useUpdateMonthlyIncome();

  const form = useForm<IncomeSchema>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: selectedIncome?.amount ?? defaultIncome,
      month: selectedIncome?.month ?? 1,
      year: selectedIncome?.year ?? 2024,
    },
  });

  const onSubmit = (data: IncomeSchema) => {
    if (selectedIncome) {
      updateIncome(
        {
          data,
          endpoint: `/settings/income/${selectedIncome.id}`,
        },
        {
          onSuccess: () => {
            onFormReset(true, "monthly-incomes");
          },
          onError: (error) => {
            console.error("Update error:", error);
          },
        },
      );
    } else {
      createIncome(
        {
          data,
          endpoint: "/settings/income",
        },
        {
          onSuccess: () => {
            onFormReset(true, "monthly-incomes");
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
              <FormLabel>Monthly Income</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? 0}
                  inputMode="numeric"
                  placeholder="Enter monthly income"
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
                value={field.value.toString()}
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

export default IncomeSettingsForm;
