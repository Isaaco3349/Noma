type BrandTitleBlockProps = {
  size?: "sm" | "lg";
};

/** Solid rectangle behind the Noma title and corridor line only. */
export function BrandTitleBlock({ size = "lg" }: BrandTitleBlockProps) {
  const titleSize = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className="inline-block rounded-md bg-header-bg px-4 py-3 text-header-fg">
      <p className={`font-display font-semibold tracking-tight ${titleSize}`}>
        Noma
      </p>
      <p className="mt-0.5 text-xs tracking-wide text-header-muted">
        Diaspora → Nigeria · Monad testnet
      </p>
    </div>
  );
}
