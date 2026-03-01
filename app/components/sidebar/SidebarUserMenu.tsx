"use client";

import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface SidebarUserMenuProps {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

export default function SidebarUserMenu({ name, email, image }: SidebarUserMenuProps) {
  const initials = getInitials(name, email);

  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2">
      <div className="shrink-0">
        {image ? (
          <img
            src={image}
            alt={name ?? "User avatar"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{name ?? "User"}</p>
        <p className="truncate text-xs text-default-400">{email ?? ""}</p>
      </div>
      <Link
        href="/dashboard/settings"
        className="shrink-0 text-default-400 hover:text-foreground transition-colors"
        title="Settings"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </Link>
    </div>
  );
}
