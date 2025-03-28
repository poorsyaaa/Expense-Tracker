"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";

import { loginAction } from "../action";

import { PasswordInput } from "../../../components/ui/password-input";

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
import { LoginSchema, loginSchema } from "@/lib/schema/auth-validation";
import HoneypotField from "./honeypot-field";
import { Label } from "@/components/ui/label";

export const LoginForm = () => {
  const [formError, setFormError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      extraInfo: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    setFormError(undefined);
    startTransition(async () => {
      const { error } = await loginAction(values);
      if (error) setFormError(error);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link href="#" className="text-sm underline">
                  Forgot your password? (Soon)
                </Link>
              </div>
              <FormControl>
                <PasswordInput placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <HoneypotField />
        {formError && (
          <Label className="text-sm text-red-600">{formError}</Label>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
};
