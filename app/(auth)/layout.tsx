import { redirect } from "next/navigation";

import "../../styles/globals.css";

import { validateRequest } from "@/lib/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl p-6">{children}</div>
    </main>
  );
}
