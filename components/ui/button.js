// components/ui/button

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-glow active:scale-[0.98]",
        black: "bg-[#2F3032] text-[#FAFAFA] text-base font-medium hover:bg-[#2F3032]/90 shadow-soft hover:shadow-glow active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background hover:bg-muted text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[hsl(210_20%_92%)]",
        ghost: "hover:bg-primary/[0.2] text-black/[0.8] hover:text-black/[0.8]",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-primary/10 text-primary hover:bg-primary/15",
        order: "w-full flex items-center justify-between gap-2 font-medium bg-foreground text-background hover:bg-foreground/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-smooth",
        "black-editor": "bg-[#2F3032] text-[#FAFAFA] text-base font-medium hover:bg-[#2F3032]/90 shadow-soft hover:shadow-glow active:scale-[0.98] border border-transparent!",
      },
      size: {
        default: "h-10 px-5 py-2",
        black: "px-6 py-[9px]",
        "black-sm": "px-[14px] py-[8px] text-sm",
        "black-editor": "px-4 h-9 text-sm flex-1 font-medium",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-6 py-3",
        xl: "h-14 rounded-xl px-8 py-4 text-base",
        icon: "h-10 w-10",
        order: "px-4 mx-auto max-w-[396px] min-h-12 h-full max-h-12 rounded-xl"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // When using asChild, we can't add the loading spinner as a sibling
    // So we just disable the button when loading
    if (asChild) {
      return (
        <Comp 
          className={cn(buttonVariants({ variant, size, className }))} 
          ref={ref} 
          disabled={disabled || loading}
          {...props}
        >
          {children}
        </Comp>
      );
    }
    
    // When NOT using asChild, we can add the loading spinner
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }))} 
        ref={ref} 
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
