'use client'

import { cn } from '@/utils';
import { Send, MessageCircle, ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const messengerIcons = {
  telegram: Send,
  viber: MessageCircle,
  // instagram: Instagram
}

const messengerNames = {
  telegram: 'Telegram',
  viber: 'Viber',
  // instagram: 'Instagram'
}

export const BlockMessengerSelect = ({
  block,
  isPreview = false,
  selectedMessenger,
  onSelectMessenger,
  style,
}) => {
  const options = block.messengerOptions || [];
  const [localSelected, setLocalSelected] = useState(options[0]?.type || '');

  // Use external state if provided, otherwise use local state
  const currentValue = selectedMessenger ?? localSelected;
  const handleChange = (value) => {
    setLocalSelected(value);
    onSelectMessenger?.(value);
  };

  if (options.length === 0) {
    return (
      <div className="p-4 border border-dashed border-border rounded-lg text-center text-muted-foreground text-sm">
        Месенджери не налаштовані
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={block.id} className={!isPreview ? 'cursor-text' : ''}>
        {block.label || 'Оберіть спосіб отримання відповіді'}
      </Label>
      <div className="relative w-full max-w-[300px]">
        <select
          {...(isPreview && { id: block.id })}
          className={cn(
            'flex h-[42px] w-full items-center justify-between rounded-md border border-input bg-input pl-9 pr-3 py-2 text-base',
            'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'appearance-none cursor-pointer',
            'xs:text-sm'
          )}
          style={style}
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
        >
          {options.map((option, idx) => {
            const name = messengerNames[option.type] || option.type;
            const handle = option.handle ? ` (${option.handle})` : '';
            return (
              <option key={idx} value={option.type}>
                {name}{handle}
              </option>
            );
          })}
        </select>
        {/* Icon overlay */}
        {currentValue && messengerIcons[currentValue] && (
          <div 
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: style?.color }}
          >
            {(() => {
              const Icon = messengerIcons[currentValue];
              return <Icon className="w-4 h-4" />;
            })()}
          </div>
        )}
        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="h-4 w-4 opacity-80" />
        </div>
      </div>
    </div>
  )
}

// Get the first/selected messenger icon for the submit button
export const getMessengerIcon = (type) => {
  return messengerIcons[type]
}
