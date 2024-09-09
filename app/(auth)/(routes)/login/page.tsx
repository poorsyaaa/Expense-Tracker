import { Metadata } from "next";

import { LoginForm } from "../../_components/login-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GoogleIcon from "../../_components/google-icon";

export const metadata: Metadata = {
  title: "Login",
  description: "Login",
  keywords: "login",
};

export default function Page() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <Button
          type="button"
          variant="outline"
          className="mt-3 w-full bg-white text-black hover:bg-gray-100 hover:text-black"
        >
          <a
            href="/login/google"
            className="flex w-full items-center justify-center gap-2"
          >
            <GoogleIcon />
            Login with Google
          </a>
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
