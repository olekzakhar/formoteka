import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utils";

const Select = React.forwardRef(
  ({ className, placeholder = "Оберіть варіант...", options = [], style, value, onValueChange, defaultValue, ...props }, ref) => {
    return (
      <SelectPrimitive.Root 
        value={value} 
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        {...props}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          style={style}
          className={cn(
            "flex h-[42px] w-full items-center justify-between rounded-md border border-input bg-input px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 xs:text-sm",
            className,
          )}
        >
          <SelectPrimitive.Value 
            placeholder={placeholder}
            className="text-[var(--placeholder-color)] data-[placeholder]:text-[var(--placeholder-color)]"
          />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="overflow-hidden rounded-md border bg-popover shadow-lg z-[100]"
            position="popper"
            sideOffset={3}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options?.map((option, index) => (
                <SelectPrimitive.Item
                  key={index}
                  value={option}
                  className="relative flex cursor-pointer items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent focus:bg-accent data-[highlighted]:bg-accent"
                >
                  <SelectPrimitive.ItemText>{option}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);
Select.displayName = "Select";

export { Select };
