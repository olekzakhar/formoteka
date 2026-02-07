'use client'

import { cn } from '@/utils';
// import { Instagram } from 'lucide-react';
import { Send, MessageCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const messengerIcons = {
  telegram: Send,
  viber: MessageCircle,
  // instagram: Instagram,
};

const messengerNames = {
  telegram: 'Telegram',
  viber: 'Viber',
  // instagram: 'Instagram',
};

export const BlockMessengerSelect = ({
  block,
  isPreview = false,
  selectedMessenger,
  onSelectMessenger,
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
        No messengers configured
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-foreground">{block.label || 'Choose how to receive response'}</Label>
      <div className="relative w-full max-w-[300px]">
        <select
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-ring',
            'cursor-pointer'
          )}
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {(() => {
              const Icon = messengerIcons[currentValue];
              return <Icon className="w-4 h-4 text-muted-foreground" />;
            })()}
          </div>
        )}
        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// Get the first/selected messenger icon for the submit button
export const getMessengerIcon = (type) => {
  return messengerIcons[type]
}
