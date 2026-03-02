import type { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export default function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 text-xs font-semibold uppercase tracking-wider text-white/35">
        {title}
      </span>
      {children}
    </div>
  );
}
