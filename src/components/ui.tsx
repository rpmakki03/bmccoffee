"use client";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl border border-neutral-800 bg-neutral-900 p-6", className)} {...props} />
);

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-400 outline-none ring-1 ring-neutral-700 focus:ring-neutral-400",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50",
      className
    )}
    {...props}
  />
);



