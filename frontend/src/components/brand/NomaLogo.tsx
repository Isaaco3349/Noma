type NomaLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Defaults to "Noma" for screen readers when the mark stands alone. */
  label?: string;
  /** Light mark on dark bars vs dark mark on light UI. */
  tone?: "light" | "dark";
};

const sizes = {
  sm: "size-8 text-sm",
  md: "size-10 text-base",
  lg: "size-12 text-lg",
} as const;

/** Circular “N” mark — dark fill uses `--text`, letter uses `--surface`. */
const tones = {
  dark: "bg-text text-surface",
  light: "bg-surface text-text",
} as const;

export function NomaLogo({
  size = "md",
  className = "",
  label = "Noma",
  tone = "dark",
}: NomaLogoProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold leading-none ${tones[tone]} ${sizes[size]} ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="-mt-px">N</span>
    </div>
  );
}
