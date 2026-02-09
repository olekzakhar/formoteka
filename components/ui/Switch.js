// components/ui/Switch

import { cn } from '@/utils'

export function Switch({ checked, onCheckedChange, big = false, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative rounded-full transition-smooth',
        big ? 'w-11 h-6' : 'w-[30px] h-[18px]',
        checked ? 'bg-[#2F3032]' : 'bg-muted',
        className
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 rounded-full bg-background shadow-soft transition-smooth',
          big ? 'w-5 h-5' : 'w-[14px] h-[14px]',
          checked && (big ? 'translate-x-5' : 'translate-x-3')
        )}
      />
    </button>
  )
}
