"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/app", label: "Chat" },
  { href: "/app/recipients", label: "Recipients" },
  { href: "/app/history", label: "History" },
] as const;

export function AppSubnav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 border-b border-border bg-surface px-4 sm:px-6"
      aria-label="App sections"
    >
      {LINKS.map(({ href, label }) => {
        const active =
          href === "/app" ? pathname === "/app" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`border-b-2 px-3 py-2 text-xs font-medium sm:text-sm ${
              active
                ? "border-text text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
