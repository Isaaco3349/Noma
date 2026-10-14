"use client";

const linkClass =
  "rounded-md px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-bg hover:text-text";

export function LandingPageNav() {
  return (
    <nav
      className="flex flex-wrap items-center gap-1 sm:gap-2"
      aria-label="Landing page sections"
    >
      <a href="#walkthrough" className={linkClass}>
        How to use
      </a>
      <a href="#faq" className={linkClass}>
        FAQ
      </a>
    </nav>
  );
}
