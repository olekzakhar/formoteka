// components/form-builder/block/LineItemsSettings

import { useState } from 'react';
import { Button } from '@/components/ui/button-2';
import { Label } from '@/components/ui/label';
import { ManageLineItemsPopup } from '@/components/form-builder/ManageLineItemsPopup';
import { cn } from '@/utils';
import { List, LayoutGrid, Package } from 'lucide-react';

const layoutOptions = [
  {
    value: 'list',
    label: 'Список',
    icon: <List className="w-4 h-4" />,
    description: 'Мале фото зліва, назва та ціна',
  },
  {
    value: 'grid-2',
    label: '2 картки в ряд',
    icon: <LayoutGrid className="w-4 h-4" />,
    description: 'Фото зверху, назва та ціна знизу',
  },
  {
    value: 'grid-3',
    label: '3 картки в ряд',
    icon: <LayoutGrid className="w-4 h-4" />,
    description: 'Фото зверху, назва та ціна знизу',
  }
]

export const BlockLineItemsSettings = ({ block, onUpdate }) => {
  const [showManageLineItems, setShowManageLineItems] = useState(false)

  const lineItems = block.lineItems || []
  const layout = block.lineItemsLayout || 'grid-2'

  const handleLayoutChange = (newLayout) => {
    onUpdate({ lineItemsLayout: newLayout })
  }

  const handleUpdateLineItems = (newLineItems) => {
    onUpdate({ lineItems: newLineItems })
  }

  return (
    <div className="space-y-6">
      {/* Manage Line Items Button */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50">
          <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center shadow-soft">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Позиції</p>
            <p className="text-xs text-muted-foreground">{lineItems.length} позицій</p>
          </div>
        </div>

        <Button
          onClick={() => setShowManageLineItems(true)}
          className="w-full"
        >
          Керування позиціями
        </Button>
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        {/* <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground">Оформлення</h4>
        </div> */}

        {/* Layout Options */}
        <div className="space-y-2">
          <Label>Обрати макет</Label>
          <div className="space-y-2">
            {layoutOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleLayoutChange(option.value)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-colors duration-200 ease-in-out text-left',
                  layout === option.value
                    ? 'border-primary! bg-primary/5'
                    : 'border-border hover:border-muted-foreground/35!'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0',
                    layout === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  {option.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Manage LineItems Popup */}
      {showManageLineItems && (
        <ManageLineItemsPopup
          lineItems={lineItems}
          onUpdateLineItems={handleUpdateLineItems}
          onClose={() => setShowManageLineItems(false)}
        />
      )}
    </div>
  )
}
