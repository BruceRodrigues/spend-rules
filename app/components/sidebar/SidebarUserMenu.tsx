"use client";

import { logout } from "@/app/actions/auth";
import { ArrowRightStartOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  async function handleAction(key: React.Key) {
    if (key === "settings") {
      router.push("/dashboard/settings");
    } else if (key === "logout") {
      await logout();
    }
  }

  return (
    <Dropdown placement="top-start">
      <DropdownTrigger>
        <div className="flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-white/10 transition-colors">
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
            <p className="truncate text-sm font-medium text-white">{name ?? "User"}</p>
            <p className="truncate text-xs text-white/50">{email ?? ""}</p>
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu" onAction={handleAction}>
        <DropdownItem key="settings" startContent={<Cog6ToothIcon className="h-4 w-4" />}>
          Settings
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          startContent={<ArrowRightStartOnRectangleIcon className="h-4 w-4" />}
        >
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
