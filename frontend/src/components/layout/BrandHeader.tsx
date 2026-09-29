import type { ReactNode } from "react";
import { BrandTitleBlock } from "./BrandTitleBlock";

type BrandHeaderProps = {
  trailing?: ReactNode;
};

export function BrandHeader({ trailing }: BrandHeaderProps) {
  return (
    <div className="bg-surface px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-4xl items-start justify-between gap-6">
        <BrandTitleBlock size="lg" />
        {trailing ? (
          <div className="flex shrink-0 items-center gap-3">{trailing}</div>
        ) : null}
      </div>
    </div>
  );
}
