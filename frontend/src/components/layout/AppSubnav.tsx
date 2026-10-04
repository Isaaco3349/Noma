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
      className="flex shrink-0 gap-1 border-b border-border bg-surface px-4 sm:px-6 lg:w-56 lg:flex-col lg:gap-0.5 lg:border-b-0 lg:border-r lg:px-4 lg:py-5"
      aria-label="App sections"
    >
      {LINKS.map(({ href, label }) => {
        const active =
          href === "/app" ? pathname === "/app" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`border-b-2 px-3 py-2 text-xs font-medium sm:text-sm lg:rounded-lg lg:border-b-0 lg:border-l-2 ${
              active
                ? "border-text text-text lg:bg-bg lg:font-semibold"
                : "border-transparent text-text-muted hover:bg-bg hover:text-text"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
