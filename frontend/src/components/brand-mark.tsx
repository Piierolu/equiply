import { Truck } from "lucide-react";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-[#b8e845] text-[#171a24] ${className}`}
    >
      <Truck className="relative z-10 size-[19px]" strokeWidth={2.3} />
      <span className="absolute -right-2 -bottom-3 size-6 rounded-full bg-[#ff7657]" />
    </span>
  );
}
