import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import * as Popover from "@radix-ui/react-popover"
import { cn, getColor } from "@/utils"
import { Calendar } from "@/components/ui/calendar"

const MONTHS = [
  "січня", "лютого", "березня", "квітня", "травня", "червня",
  "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
]

const formatDate = (date) => {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()} р.`
}

export const DatePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      placeholder = "Виберіть дату",
      disabled,
      className,
      inputColor,
      inputBgColor,
      inputTextColor,
      accentColor,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-[42px] w-full items-center justify-between rounded-md border px-3 py-2 text-base text-left",
              "focus-visible:outline-none focus-visible:ring-3",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "xs:text-sm transition-colors",
              className
            )}
            style={{
              borderColor: inputColor || 'hsl(var(--input))',
              backgroundColor: inputBgColor || 'hsl(var(--input))',
              color: inputTextColor,
              '--tw-ring-color': getColor(accentColor, 0.7) || 'hsl(var(--ring))',
            }}
          >
            <span>{value ? formatDate(value) : placeholder}</span>
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-90" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-[100] w-auto outline-none"
            align="start"
            sideOffset={4}
          >
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange?.(date);
                setOpen(false);
              }}
              disabled={disabled}
              accentColor={accentColor}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  }
)

DatePicker.displayName = "DatePicker"
