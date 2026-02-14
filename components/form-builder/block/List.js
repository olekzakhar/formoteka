'use client'

import { cn } from '@/utils'
import * as LucideIcons from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export const BlockList = ({ block, isPreview, isEditable, onUpdateBlock, onRequestSelect }) => {
  const items = block.listItems || [];
  const style = block.listStyle || 'icon';
  const iconName = block.listIcon || 'Check';
  const iconColor = block.listIconColor || '#22c55e';

  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  const IconComponent = (LucideIcons)[iconName];

  useEffect(() => {
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [editingIndex]);

  const handleStartEdit = (index, e) => {
    if (!isEditable || !onUpdateBlock) return;
    
    // Викликаємо onRequestSelect ПЕРЕД початком редагування
    if (onRequestSelect && editingIndex === null) {
      onRequestSelect();
    }
    
    setEditingIndex(index);
    setEditValue(items[index] || '');
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !onUpdateBlock) return;
    const newItems = [...items];
    newItems[editingIndex] = editValue.trim() || items[editingIndex];
    onUpdateBlock({ listItems: newItems });
    setEditingIndex(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const renderMarker = () => {
    if (style === 'bullet') {
      return <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: iconColor }} />;
    }
    if (style === 'dash') {
      return <span className="w-3 h-0.5 rounded-full shrink-0" style={{ backgroundColor: iconColor }} />;
    }
    // icon style
    if (IconComponent) {
      return <IconComponent className="w-5 h-5 shrink-0" style={{ color: iconColor }} />;
    }
    return <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: iconColor }} />;
  };

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground text-sm py-2">
        No list items. Add items in settings.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-3">
          <span className="flex items-center justify-center">
            {renderMarker()}
          </span>
          {isEditable && editingIndex === index ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none"
            />
          ) : (
            <span 
              className={cn("flex-1", isEditable && "cursor-text")}
              onClick={(e) => {
                if (isEditable) {
                  // НЕ викликаємо stopPropagation, щоб подія дійшла до BlocksEditor
                  handleStartEdit(index, e)
                }
              }}
            >
              {item}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

// Available icons for list items
export const listIconOptions = [
  'Check',
  'CheckCircle',
  'CheckSquare',
  'ChevronRight',
  'ArrowRight',
  'Star',
  'Heart',
  'Zap',
  'Target',
  'Award',
  'ThumbsUp',
  'Sparkles',
  'Rocket',
  'Flag',
  'Bookmark',
]
