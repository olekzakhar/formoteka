// components/form-builder/SliderControl

'use client'

import { Slider } from '@/components/ui/slider'
import { cn } from '@/utils'

export const SliderControl = ({
  label,
  value,
  onChange,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  unit = 'px',
  className,
}) => {
  const currentValue = value ?? defaultValue
  const isModified = defaultValue !== undefined && value !== defaultValue

  const handleReset = () => {
    if (defaultValue !== undefined) {
      onChange(defaultValue)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {isModified && (
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-primary transition-smooth"
          >
            Скинути
          </button>
        )}
      </div>
      <Slider
        className="cursor-pointer"
        value={[currentValue]}
        onValueChange={(values) => onChange(values[0])}
        max={max}
        min={min}
        step={step}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span className="font-medium text-foreground">{currentValue}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
