import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, SettingsSchema } from "@/lib/schema/settings";

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
import { useCreateOrUpdateSettings } from "@/api/mutations/settings-hook";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import ShadCN Select

import { Separator } from "@/components/ui/separator";
import {
  currencies,
  localeLanguages,
  timeZones,
  dateFormats,
  paymentMethods,
} from "../../config/constant";

interface GeneralSettingsFormProps {
  defaultBudget?: number;
  defaultIncome?: number;
  currency?: string;
  locale?: string;
  timeZone?: string;
  dateFormat?: string;
  defaultPaymentMethod?: SettingsSchema["defaultPaymentMethod"];
}

const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({
  defaultBudget = 0,
  defaultIncome = 0,
  currency = "PHP",
  locale = "en-US",
  timeZone = "UTC",
  dateFormat = "MM/DD/YYYY",
  defaultPaymentMethod = "CASH",
}) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateOrUpdateSettings();

  // Setting up the form with default values
  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      defaultBudget,
      defaultIncome,
      currency,
      locale,
      timeZone,
      dateFormat,
      defaultPaymentMethod,
    },
  });

  const onSubmit = (data: SettingsSchema) => {
    mutate(
      {
        data,
        endpoint: "/settings/default",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (error) => {
          console.error("Create or Update error:", error);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Default Budget Field */}
        <FormField
          control={form.control}
          name="defaultBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Budget</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? 0}
                  inputMode="numeric"
                  placeholder="Enter default budget"
                  onChange={(e) => {
                    if (e.target.value === "") return field.onChange(undefined);
                    field.onChange(Number(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Default Income Field */}
        <FormField
          control={form.control}
          name="defaultIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Income</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? 0}
                  inputMode="numeric"
                  placeholder="Enter default income"
                  onChange={(e) => {
                    if (e.target.value === "") return field.onChange(undefined);
                    field.onChange(Number(e.target.value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Currency Select */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value ?? "PHP"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {currencies.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Locale Select */}
        <FormField
          control={form.control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locale (will be supported soon)</FormLabel>
              <Select
                disabled
                onValueChange={(value) => field.onChange(value)}
                value={field.value ?? "en-US"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {localeLanguages.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Zone Select */}
        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Zone</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value ?? "UTC"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeZones.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Format Select */}
        <FormField
          control={form.control}
          name="dateFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Format</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value ?? "MM/DD/YYYY"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dateFormats.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Default Payment Method using ShadCN Select */}
        <FormField
          control={form.control}
          name="defaultPaymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Payment Method</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value ?? "CASH"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              "Save Settings"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralSettingsForm;
