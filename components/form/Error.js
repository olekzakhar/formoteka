// components/form/Error

import { cn } from '@/utils'

export default function FormError({ field, className }) {
  return (
    <>
      {field &&
        <div
          className={cn(
            "-mt-1.5 inline-block text-xs px-2 pt-1 text-red-700",
            className
          )}
        >
          <p>{field?.message || 'Error'}</p>
        </div>
      }
    </>
  )
}
