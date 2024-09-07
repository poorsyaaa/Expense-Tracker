import { redirect } from "next/navigation";

import { Header } from "./_components/header";

import "../globals.css";

import SessionProvider from "@/context/sessionContext";
import { validateRequest } from "@/lib/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <Header />
      <main className="flex min-h-screen w-full flex-col">{children}</main>
    </SessionProvider>
  );
}
