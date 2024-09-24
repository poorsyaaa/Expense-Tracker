import { redirect } from "next/navigation";

import { Header } from "./_components/header";

import "../../styles/globals.css";

import SessionProvider from "@/context/sessionContext";
import { validateRequest } from "@/lib/auth";
import SettingsProvider from "@/context/settingsContext";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <SettingsProvider>
        <Header />
        <main className="flex min-h-screen w-full flex-col">{children}</main>
      </SettingsProvider>
    </SessionProvider>
  );
}
