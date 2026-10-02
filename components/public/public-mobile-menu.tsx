"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { publicNavigation } from "@/components/public/public-navigation";

export function PublicMobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 px-4" aria-label="Mobile navigation">
          {publicNavigation.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            href="/login"
          >
            Sign in
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}