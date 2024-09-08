"use client";

import { PiggyBank } from "lucide-react";
import Link from "next/link";

import { navLinks } from "../config/constant";

import { UserMenu } from "./user-menu";
import { UserMobileMenu } from "./user-mobile-menu";
import { useRouter } from "next/navigation";

interface HeaderProps {
  companyName?: string;
  companyIcon?: React.ReactNode;
}
export const Header: React.FC<HeaderProps> = ({
  companyName = "Expense Tracker App",
  companyIcon,
}) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          {companyIcon || <PiggyBank className="h-6 w-6" />}
          <span className="sr-only">{companyName}</span>
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => handleNavigation(link.href)}
            passHref
            className="text-muted-foreground hover:text-foreground"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu */}
      <UserMobileMenu />

      {/* User Menu for profile actions (shown on both desktop and mobile) */}
      <div className="ml-auto">
        <UserMenu />
      </div>
    </header>
  );
};
