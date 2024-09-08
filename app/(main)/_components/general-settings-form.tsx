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
import { useCreateOrUpdateSettings } from "@/api/mutations/settingsHook";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GeneralSettingsForm = () => {
  const { mutate, isPending } = useCreateOrUpdateSettings();
  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { defaultBudget: 0, defaultIncome: 0 },
  });

  const onSubmit = (data: SettingsSchema) => {
    mutate({
      data,
      endpoint: "/settings/default",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Income and Budget</CardTitle>
        <CardDescription>Change your default income and budget</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
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
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Savings...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default GeneralSettingsForm;
