'use client'

import { blockDefinitions } from '@/data/block-definitions';
import { BlockIcon } from './BlockIcon';
import { Plus, X, AlignLeft, AlignCenter, AlignRight, Move } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { ProductsBlockSettings } from './ProductsBlockSettings';

// Image settings component with position adjustment
const ImageSettings = ({ block, onUpdate }) => {
  const [adjustingIndex, setAdjustingIndex] = useState(null);
  const containerRef = useRef(null);

  const images = block.images || [];
  const positions = block.imagePositions || [];
  const fit = block.imageFit || 'cover';
  const align = block.imageAlign || 'center';

  const handlePositionDrag = (index, e) => {
    if (fit !== 'cover') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    const newPositions = [...positions];
    newPositions[index] = { x, y };
    onUpdate({ imagePositions: newPositions });
  };

  const handleMouseMove = (index) => (e) => {
    if (adjustingIndex !== index) return;
    handlePositionDrag(index, e);
  };

  return (
    <div className="space-y-4">
      {/* Number of images */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Number of Images</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((count) => (
            <button
              key={count}
              onClick={() => onUpdate({ imageCount: count })}
              className={cn(
                'w-10 h-10 rounded-lg border text-sm font-medium transition-smooth',
                block.imageCount === count
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Image fit */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Image Fit</label>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ imageFit: 'cover' })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
              fit === 'cover'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-foreground hover:border-primary/50'
            )}
          >
            Cover
          </button>
          <button
            onClick={() => onUpdate({ imageFit: 'contain' })}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
              fit === 'contain'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-foreground hover:border-primary/50'
            )}
          >
            Fit Entire
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {fit === 'cover' ? 'Image fills the area, may crop' : 'Shows entire image, may have empty space'}
        </p>
      </div>

      {/* Border radius */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Corners</label>
        <div className="flex gap-2">
          {([
            { value: 'none', label: 'Sharp' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'full', label: 'Round' },
          ]).map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ imageRadius: option.value })}
              className={cn(
                'flex-1 px-2 py-2 border text-xs font-medium transition-smooth',
                option.value === 'none' && 'rounded-none',
                option.value === 'small' && 'rounded-md',
                option.value === 'medium' && 'rounded-xl',
                option.value === 'full' && 'rounded-2xl',
                (block.imageRadius || 'small') === option.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alignment (for contain mode) */}
      {fit === 'contain' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Position</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ imageAlign: 'left' })}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
                align === 'left'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              <AlignLeft className="w-4 h-4" />
              Left
            </button>
            <button
              onClick={() => onUpdate({ imageAlign: 'center' })}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
                align === 'center'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              <AlignCenter className="w-4 h-4" />
              Center
            </button>
            <button
              onClick={() => onUpdate({ imageAlign: 'right' })}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
                align === 'right'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              <AlignRight className="w-4 h-4" />
              Right
            </button>
          </div>
        </div>
      )}

      {/* Position adjustment for cover mode */}
      {fit === 'cover' && images.some(Boolean) && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Adjust Position</label>
          <p className="text-xs text-muted-foreground mb-2">
            Click and drag on an image to adjust which part is visible
          </p>
          <div className="space-y-3">
            {images.map((img, i) => {
              if (!img) return null;
              const pos = positions[i] || { x: 50, y: 50 };
              return (
                <div key={i} className="space-y-1">
                  <span className="text-xs text-muted-foreground">Image {i + 1}</span>
                  <div
                    ref={containerRef}
                    className={cn(
                      'relative aspect-video rounded-lg overflow-hidden border-2',
                      adjustingIndex === i ? 'border-primary cursor-grabbing' : 'border-transparent hover:border-primary/50 cursor-grab'
                    )}
                    onMouseDown={() => setAdjustingIndex(i)}
                    onMouseUp={() => setAdjustingIndex(null)}
                    onMouseLeave={() => setAdjustingIndex(null)}
                    onMouseMove={handleMouseMove(i)}
                    onClick={(e) => handlePositionDrag(i, e)}
                  >
                    <img
                      src={img}
                      alt={`Image ${i + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
                      draggable={false}
                    />
                    <div
                      className="absolute w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg pointer-events-none"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const BlockSettingsTab = ({ block, onUpdate }) => {
  if (!block) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <BlockIcon icon="Type" className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Select a block to edit its settings</p>
      </div>
    );
  }

  const definition = blockDefinitions.find((d) => d.type === block.type);
  const hasOptions = ['dropdown', 'checkbox', 'radio'].includes(block.type);
  const isInputBlock = ['short-text', 'long-text', 'email', 'number', 'dropdown', 'checkbox', 'radio', 'date'].includes(block.type);
  const isTextBlock = ['heading', 'paragraph'].includes(block.type);

  const addOption = () => {
    const options = block.options || [];
    onUpdate({ options: [...options, `Option ${options.length + 1}`] });
  };

  const updateOption = (index, value) => {
    const options = [...(block.options || [])];
    options[index] = value;
    onUpdate({ options });
  };

  const removeOption = (index) => {
    const options = (block.options || []).filter((_, i) => i !== index);
    onUpdate({ options });
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Block type indicator - hide for products since it has its own header */}
      {block.type !== 'products' && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
          <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-soft">
            <BlockIcon icon={definition?.icon || 'Type'} className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{definition?.label}</p>
            <p className="text-xs text-muted-foreground">Block type</p>
          </div>
        </div>
      )}

      {/* Spacer height */}
      {block.type === 'spacer' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Height (px)</label>
          <input
            type="number"
            value={block.height || 32}
            onChange={(e) => onUpdate({ height: Math.max(8, parseInt(e.target.value) || 32) })}
            min={8}
            max={200}
            className={cn(
              'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'transition-smooth'
            )}
          />
        </div>
      )}

      {/* Divider settings */}
      {block.type === 'divider' && (
        <div className="space-y-4">
          {/* Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.dividerColor || '#e5e7eb'}
                onChange={(e) => onUpdate({ dividerColor: e.target.value })}
                className="w-10 h-10 rounded-md border border-input cursor-pointer"
              />
              <input
                type="text"
                value={block.dividerColor || '#e5e7eb'}
                onChange={(e) => onUpdate({ dividerColor: e.target.value })}
                className={cn(
                  'flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'transition-smooth'
                )}
              />
            </div>
          </div>

          {/* Thickness */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Thickness (px)</label>
            <input
              type="number"
              value={block.dividerThickness || 1}
              onChange={(e) => onUpdate({ dividerThickness: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
              min={1}
              max={10}
              className={cn(
                'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-smooth'
              )}
            />
          </div>

          {/* Width */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Width (%)</label>
            <input
              type="range"
              value={block.dividerWidth || 100}
              onChange={(e) => onUpdate({ dividerWidth: parseInt(e.target.value) })}
              min={10}
              max={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10%</span>
              <span className="font-medium text-foreground">{block.dividerWidth || 100}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Style</label>
            <div className="flex gap-2">
              {(['solid', 'dashed', 'dotted']).map((style) => (
                <button
                  key={style}
                  onClick={() => onUpdate({ dividerStyle: style })}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-smooth',
                    (block.dividerStyle || 'solid') === style
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground hover:border-primary/50'
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Preview</label>
            <div className="p-4 rounded-lg border border-border bg-muted/30 flex justify-center">
              <hr
                className="border-0"
                style={{
                  width: `${block.dividerWidth || 100}%`,
                  height: `${block.dividerThickness || 1}px`,
                  backgroundColor: block.dividerStyle === 'solid' ? (block.dividerColor || '#e5e7eb') : 'transparent',
                  backgroundImage: block.dividerStyle === 'dashed' 
                    ? `repeating-linear-gradient(to right, ${block.dividerColor || '#e5e7eb'} 0, ${block.dividerColor || '#e5e7eb'} 8px, transparent 8px, transparent 14px)`
                    : block.dividerStyle === 'dotted'
                      ? `repeating-linear-gradient(to right, ${block.dividerColor || '#e5e7eb'} 0, ${block.dividerColor || '#e5e7eb'} ${(block.dividerThickness || 1) * 2}px, transparent ${(block.dividerThickness || 1) * 2}px, transparent ${(block.dividerThickness || 1) * 4}px)`
                      : 'none',
                  borderRadius: block.dividerStyle === 'dotted' ? `${(block.dividerThickness || 1) / 2}px` : '0',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image settings */}
      {block.type === 'image' && (
        <ImageSettings block={block} onUpdate={onUpdate} />
      )}

      {/* Products settings */}
      {block.type === 'products' && (
        <ProductsBlockSettings block={block} onUpdate={onUpdate} />
      )}

      {/* Label field */}
      {!['spacer', 'image', 'products', 'divider'].includes(block.type) && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Label</label>
          <input
            type="text"
            value={block.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className={cn(
              'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'transition-smooth'
            )}
          />
        </div>
      )}

      {/* Text Alignment for heading/paragraph */}
      {isTextBlock && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Text Alignment</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ textAlign: 'left' })}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
                (block.textAlign || 'left') === 'left'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              <AlignLeft className="w-4 h-4" />
              Left
            </button>
            <button
              onClick={() => onUpdate({ textAlign: 'center' })}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
                block.textAlign === 'center'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              <AlignCenter className="w-4 h-4" />
              Center
            </button>
            <button
              onClick={() => onUpdate({ textAlign: 'right' })}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
                block.textAlign === 'right'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              <AlignRight className="w-4 h-4" />
              Right
            </button>
          </div>
        </div>
      )}

      {/* Show/Hide Label toggle */}
      {isInputBlock && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Show Label</label>
          <button
            onClick={() => onUpdate({ showLabel: block.showLabel === false ? true : false })}
            className={cn(
              'relative w-11 h-6 rounded-full transition-smooth',
              block.showLabel !== false ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow-soft transition-smooth',
                block.showLabel !== false && 'translate-x-5'
              )}
            />
          </button>
        </div>
      )}

      {/* Placeholder field */}
      {block.placeholder !== undefined && !['spacer', 'image'].includes(block.type) && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Placeholder</label>
          <input
            type="text"
            value={block.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className={cn(
              'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'transition-smooth'
            )}
          />
        </div>
      )}

      {/* Required toggle */}
      {!['heading', 'paragraph', 'spacer', 'image'].includes(block.type) && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Required</label>
          <button
            onClick={() => onUpdate({ required: !block.required })}
            className={cn(
              'relative w-11 h-6 rounded-full transition-smooth',
              block.required ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow-soft transition-smooth',
                block.required && 'translate-x-5'
              )}
            />
          </button>
        </div>
      )}

      {/* Options editor */}
      {hasOptions && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Options</label>
          <div className="space-y-2">
            {block.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                    'transition-smooth text-sm'
                  )}
                />
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addOption}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md w-full justify-center',
              'border border-dashed border-input hover:border-primary/50 hover:bg-accent/50',
              'text-sm text-muted-foreground hover:text-foreground',
              'transition-smooth'
            )}
          >
            <Plus className="w-4 h-4" />
            Add option
          </button>
        </div>
      )}
    </div>
  );
};
