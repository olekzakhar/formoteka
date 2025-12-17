'use client'

import { blockDefinitions } from '@/data/block-definitions';
import { BlockIcon } from './BlockIcon';
import { Plus, Settings, Copy, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState } from 'react';

export const BlockItem = ({
  block,
  isActive,
  onSelect,
  onDelete,
  onDuplicate,
  onOpenSettings,
  onAddBlock,
  onUpdateBlock,
  draggableProps,
  dragHandleProps,
}) => {
  const definition = blockDefinitions.find((d) => d.type === block.type);

  const labelInputRef = useRef(null);
  const placeholderInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Локальний стейт тільки для контролю "редагування" (для виділення при першому фокусі)
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingPlaceholder, setIsEditingPlaceholder] = useState(false);
  const didFocusLabel = useRef(false);
  const didFocusPlaceholder = useRef(false);

  // Фокусування та виділення тільки один раз при початку редагування
  useEffect(() => {
    if (isEditingLabel && !didFocusLabel.current) {
      if (block.type === 'paragraph' && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      } else if (labelInputRef.current) {
        labelInputRef.current.focus();
        labelInputRef.current.select();
      }
      didFocusLabel.current = true;
    }
  }, [isEditingLabel, block.type]);

  useEffect(() => {
    if (isEditingPlaceholder && !didFocusPlaceholder.current) {
      if (placeholderInputRef.current) {
        placeholderInputRef.current.focus();
        placeholderInputRef.current.select();
      }
      didFocusPlaceholder.current = true;
    }
  }, [isEditingPlaceholder]);

  // Кнопки Enter/Escape для завершення редагування
  const handleLabelKeyDown = (e) => {
    if (e.key === 'Enter' && block.type !== 'paragraph') {
      e.preventDefault();
      setIsEditingLabel(false);
      didFocusLabel.current = false;
    }
    if (e.key === 'Escape') {
      setIsEditingLabel(false);
      didFocusLabel.current = false;
    }
  };

  const handlePlaceholderKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditingPlaceholder(false);
      didFocusPlaceholder.current = false;
    }
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'heading':
        return (
          <input
            ref={labelInputRef}
            type="text"
            value={block.label ?? ''}
            onChange={(e) => onUpdateBlock({ label: e.target.value })}
            placeholder="Heading"
            onClick={(e) => { e.stopPropagation(); onSelect(); setIsEditingLabel(true); }}
            onKeyDown={handleLabelKeyDown}
            className="text-xl font-semibold text-foreground bg-transparent outline-none w-full cursor-text"
          />
        );

      case 'paragraph':
        return (
          <textarea
            ref={textareaRef}
            value={block.label ?? ''}
            onChange={(e) => onUpdateBlock({ label: e.target.value })}
            placeholder="Paragraph text"
            onClick={(e) => { e.stopPropagation(); onSelect(); setIsEditingLabel(true); }}
            onKeyDown={handleLabelKeyDown}
            className="text-muted-foreground bg-transparent outline-none w-full resize-none cursor-text"
            rows={2}
          />
        );

      case 'short-text':
      case 'email':
      case 'number':
      case 'long-text':
        return (
          <div className="space-y-2">
            <input
              ref={labelInputRef}
              type="text"
              value={block.label ?? ''}
              onChange={(e) => onUpdateBlock({ label: e.target.value })}
              placeholder="Label"
              onClick={(e) => { e.stopPropagation(); onSelect(); setIsEditingLabel(true); }}
              onKeyDown={handleLabelKeyDown}
              className="text-sm font-medium text-foreground bg-transparent outline-none w-full cursor-text"
            />
            <input
              ref={placeholderInputRef}
              type="text"
              value={block.placeholder ?? ''}
              onChange={(e) => onUpdateBlock({ placeholder: e.target.value })}
              placeholder="Placeholder"
              onClick={(e) => { e.stopPropagation(); onSelect(); setIsEditingPlaceholder(true); }}
              onKeyDown={handlePlaceholderKeyDown}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-2">
            <input
              ref={labelInputRef}
              type="text"
              value={block.label ?? ''}
              onChange={(e) => onUpdateBlock({ label: e.target.value })}
              placeholder="Label"
              onClick={(e) => { e.stopPropagation(); onSelect(); setIsEditingLabel(true); }}
              onKeyDown={handleLabelKeyDown}
              className="text-sm font-medium text-foreground bg-transparent outline-none w-full cursor-text"
            />
            <select
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-muted-foreground"
              disabled
              value=""
            >
              <option>Select an option...</option>
              {block.options?.map((opt, i) => <option key={i}>{opt}</option>)}
            </select>
          </div>
        );

      case 'checkbox':
      case 'radio':
        return (
          <div className="space-y-2">
            <input
              ref={labelInputRef}
              type="text"
              value={block.label ?? ''}
              onChange={(e) => onUpdateBlock({ label: e.target.value })}
              placeholder="Label"
              onClick={(e) => { e.stopPropagation(); onSelect(); setIsEditingLabel(true); }}
              onKeyDown={handleLabelKeyDown}
              className="text-sm font-medium text-foreground bg-transparent outline-none w-full cursor-text"
            />
            <div className="space-y-1.5">
              {block.options?.map((opt, i) => (
                <label key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type={block.type}
                    name={block.type === 'radio' ? block.id : undefined}
                    className="rounded border-input"
                    disabled
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <input
              ref={labelInputRef}
              type="text"
              value={block.label ?? ''}
              onChange={(e) => onUpdateBlock({ label: e.target.value })}
              placeholder="Label"
              onClick={(e) => { e.stopPropagation(); onSelect(); setIsEditingLabel(true); }}
              onKeyDown={handleLabelKeyDown}
              className="text-sm font-medium text-foreground bg-transparent outline-none w-full cursor-text"
            />
            <input
              type="date"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-muted-foreground"
              disabled
            />
          </div>
        );

      default:
        return <div className="text-muted-foreground">Unknown block type</div>;
    }
  };

  return (
    <div
      {...draggableProps}
      className={cn(
        'group relative bg-card rounded-lg transition-smooth',
        isActive
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-canvas shadow-medium'
          : 'hover:ring-1 hover:ring-block-hover shadow-soft'
      )}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <div
        className={cn(
          'absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 transition-smooth',
          'group-hover:opacity-100'
        )}
      >
        <div
          {...dragHandleProps}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-smooth cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAddBlock(); }}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-smooth"
          title="Add block"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onOpenSettings(); }}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-smooth"
          title="Block settings"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-smooth"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <BlockIcon icon={definition?.icon || 'Type'} className="w-4 h-4 text-accent-foreground" />
          </div>
          <div className="flex-1 min-w-0">{renderBlockContent()}</div>
        </div>
      </div>
    </div>
  );
};
