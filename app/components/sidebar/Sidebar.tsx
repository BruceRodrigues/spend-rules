"use client";

import { Button } from "@heroui/react";
import {
  AdjustmentsHorizontalIcon,
  ArrowUpTrayIcon,
  BanknotesIcon,
  Bars3Icon,
  CreditCardIcon,
  HomeIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import SidebarNavItem from "./SidebarNavItem";
import SidebarSection from "./SidebarSection";
import SidebarUserMenu from "./SidebarUserMenu";

interface SidebarProps {
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
  };
}

const navSections = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", Icon: HomeIcon }],
  },
  {
    title: "Finance",
    items: [
      { label: "Transactions", href: "/dashboard/transactions", Icon: BanknotesIcon },
      { label: "Credit Cards", href: "/dashboard/credit-cards", Icon: CreditCardIcon },
      { label: "Import", href: "/dashboard/import", Icon: ArrowUpTrayIcon },
    ],
  },
  {
    title: "Rules",
    items: [
      { label: "Categories", href: "/dashboard/categories", Icon: TagIcon },
      { label: "Rules", href: "/dashboard/rules", Icon: AdjustmentsHorizontalIcon },
    ],
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="text-lg font-semibold text-foreground">Spend Rules</span>
      </div>
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-2">
        {navSections.map((section) => (
          <SidebarSection key={section.title} title={section.title}>
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.href}
                label={item.label}
                href={item.href}
                Icon={item.Icon}
              />
            ))}
          </SidebarSection>
        ))}
      </nav>
      <div className="border-t border-divider px-1 py-3">
        <SidebarUserMenu name={user.name} email={user.email} image={user.image} />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <Button
        isIconOnly
        variant="light"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onPress={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-content1 shadow-lg transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Button
          isIconOnly
          variant="light"
          className="absolute right-3 top-4"
          onPress={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-5 w-5" />
        </Button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-divider bg-content1 lg:flex lg:flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
