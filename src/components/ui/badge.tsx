import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-lime-500/30 bg-lime-500/10 text-lime-400 font-bold",
        secondary:
          "border-zinc-700 bg-zinc-800 text-zinc-300",
        outline:
          "border-zinc-700 text-zinc-400",
        cyan:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold",
        gold:
          "border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold",
        destructive:
          "border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
