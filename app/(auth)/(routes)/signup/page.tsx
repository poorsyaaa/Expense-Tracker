import { Metadata } from "next";

import { SignUpForm } from "../../_components/signup-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleIcon from "../../_components/google-icon";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign Up",
  keywords: "signup",
};

export default function Page() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
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
            Sign up with Google
          </a>
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
