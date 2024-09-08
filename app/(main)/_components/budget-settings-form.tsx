// BudgetSettingsForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  budgetSchema,
  incomeSchema,
  BudgetSchema,
  IncomeSchema,
} from "@/lib/schema/settings";

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
  useCreateOrUpdateMonthlyBudget,
  useCreateOrUpdateMonthlyIncome,
} from "@/api/mutations/settings-hook";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { months, years } from "../config/constant";

interface BudgetSettingsFormProps {
  defaultBudget?: number;
  defaultIncome?: number;
}

const BudgetSettingsForm: React.FC<BudgetSettingsFormProps> = ({
  defaultBudget = 0,
  defaultIncome = 0,
}) => {
  const { mutate: mutateBudget, isPending: isPendingBudget } =
    useCreateOrUpdateMonthlyBudget();
  const { mutate: mutateIncome, isPending: isPendingIncome } =
    useCreateOrUpdateMonthlyIncome();

  const budgetForm = useForm<BudgetSchema>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { amount: defaultBudget, month: 1, year: 2024 },
  });

  const incomeForm = useForm<IncomeSchema>({
    resolver: zodResolver(incomeSchema),
    defaultValues: { amount: defaultIncome, month: 1, year: 2024 },
  });

  const onSubmitBudget = (data: BudgetSchema) => {
    mutateBudget({
      data,
      endpoint: "/settings/budget",
    });
  };

  const onSubmitIncome = (data: IncomeSchema) => {
    mutateIncome({
      data,
      endpoint: "/settings/income",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Budget Settings</CardTitle>
          <CardDescription>Manage your monthly budget</CardDescription>
        </CardHeader>
        <Form {...budgetForm}>
          <form onSubmit={budgetForm.handleSubmit(onSubmitBudget)}>
            <CardContent>
              <FormField
                control={budgetForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? 0}
                        inputMode="numeric"
                        placeholder="Enter monthly budget"
                        onChange={(e) => {
                          if (e.target.value === "")
                            return field.onChange(undefined);
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={budgetForm.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "") return field.onChange(undefined);
                        field.onChange(Number(value));
                      }}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                control={budgetForm.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "") return field.onChange(undefined);
                        field.onChange(Number(value));
                      }}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
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
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isPendingBudget}>
                {isPendingBudget ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Budget...
                  </>
                ) : (
                  "Save Budget"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Income Settings</CardTitle>
          <CardDescription>Manage your monthly income</CardDescription>
        </CardHeader>
        <Form {...incomeForm}>
          <form onSubmit={incomeForm.handleSubmit(onSubmitIncome)}>
            <CardContent>
              <FormField
                control={incomeForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Income</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? 0}
                        inputMode="numeric"
                        placeholder="Enter monthly income"
                        onChange={(e) => {
                          if (e.target.value === "")
                            return field.onChange(undefined);
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={incomeForm.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "") return field.onChange(undefined);
                        field.onChange(Number(value));
                      }}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                control={incomeForm.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "") return field.onChange(undefined);
                        field.onChange(Number(value));
                      }}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
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
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isPendingIncome}>
                {isPendingIncome ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Income...
                  </>
                ) : (
                  "Save Income"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default BudgetSettingsForm;
