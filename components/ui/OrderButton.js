// components/ui/OrderButton

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const OrderButton = ({ 
  hasProducts,
  quantityProducts=0,
  totalAmount,
  submitButtonText,
  onClick,
  disabled = false
}) => {
  return (
    (hasProducts && quantityProducts) &&
      <Button
        variant="order"
        size="order"
        onClick={onClick}
        disabled={disabled}
      >
        {hasProducts ? (
          <>
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted-foreground/30 text-sm">
              {quantityProducts}
            </span>
            <span className="flex-1 text-center">Order</span>
            {/* <span className="text-sm font-medium">$0.00</span> */}
            <span className="text-sm font-medium">{totalAmount} ₴</span>
          </>
        ) : (
          <>
            <span className="flex-1 text-center">{submitButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
  )
}
