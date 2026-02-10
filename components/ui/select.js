import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils"

const Select = React.forwardRef(
  ({ className, placeholder = "Оберіть варіант", options = [], style, accentColor, value, onValueChange, defaultValue, ...props }, ref) => {
    const handleChange = (e) => {
      if (onValueChange) {
        onValueChange(e.target.value)
      }
    }

    return (
      <div className={cn("relative w-full", className)}>
        <select
          ref={ref}
          value={value}
          onChange={handleChange}
          defaultValue={defaultValue}
          className={cn(
            "h-[42px] w-full rounded-md border",
            "px-3 py-2 pr-10 text-base focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus-ring-color)]",
            "disabled:cursor-not-allowed disabled:opacity-50 xs:text-sm appearance-none cursor-pointer",
          )}
          style={style}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none opacity-80"
          style={{ color: accentColor }}
        />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
