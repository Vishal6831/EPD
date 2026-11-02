import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-blue-600 text-white hover:bg-blue-700": variant === "default",
          "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-700": variant === "secondary",
          "border-transparent bg-rose-600 text-white hover:bg-rose-700": variant === "destructive",
          "border-transparent bg-emerald-600 text-white hover:bg-emerald-700": variant === "success",
          "border-transparent bg-amber-500 text-white hover:bg-amber-600": variant === "warning",
          "text-slate-100 border-slate-700": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
