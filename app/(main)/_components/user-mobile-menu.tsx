"use client";

import { Menu, PiggyBank } from "lucide-react";
import Link from "next/link";

import { navLinks } from "../config/constant";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileMenuProps {
  companyName?: string;
  companyIcon?: React.ReactNode;
}

export const UserMobileMenu: React.FC<MobileMenuProps> = ({
  companyName = "Expense Tracker App",
  companyIcon,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            {companyIcon || <PiggyBank className="h-6 w-6" />}
            <span className="sr-only">{companyName}</span>
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
