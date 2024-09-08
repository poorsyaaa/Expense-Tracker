"use client";

import { Menu, PiggyBank } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter
import Link from "next/link"; // Import Link for prefetching

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
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

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
          <Link href="/" onClick={() => handleNavigation("/")} passHref>
            {companyIcon || <PiggyBank className="h-6 w-6" />}
            <span className="sr-only">{companyName}</span>
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => handleNavigation(link.href)}
              passHref
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
