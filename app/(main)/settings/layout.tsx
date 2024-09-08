"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { settingsNavLinks } from "../config/constant";
import { cn } from "@/lib/utils";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-1 text-sm text-muted-foreground">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            {settingsNavLinks.map(({ name, href }) => (
              <Link
                className={cn(
                  "font-semibold",
                  pathname === href && "text-primary",
                )}
                key={name}
                href={href}
                onClick={() => handleNavigation(href)}
                passHref
              >
                {name}
              </Link>
            ))}
          </nav>
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </main>
  );
}
