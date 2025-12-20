'use client'

import { blockDefinitions } from '@/data/block-definitions';
import { GripVertical, Copy, Trash2, Image, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

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
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isEditingPlaceholder, setIsEditingPlaceholder] = useState(false);
  const [editLabelValue, setEditLabelValue] = useState(block.label ?? '');
  const [editPlaceholderValue, setEditPlaceholderValue] = useState(block.placeholder ?? '');
  const labelInputRef = useRef(null);
  const placeholderInputRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const showLabel = block.showLabel !== false;

//   useEffect(() => {
//   setEditLabelValue(block.label ?? '');
//   setEditPlaceholderValue(block.placeholder ?? '');
// }, [block.label, block.placeholder]);

  // Auto-resize textarea for paragraph
  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    // Use `auto` to shrink first, then grow to exact scrollHeight (no extra empty space)
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (isEditingLabel) {
      if (block.type === 'paragraph' && textareaRef.current) {
        textareaRef.current.focus();
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len);
        autoResizeTextarea();
      } else if (labelInputRef.current) {
        labelInputRef.current.focus();
        const len = labelInputRef.current.value.length;
        labelInputRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditingLabel, block.type]);

  useEffect(() => {
    if (isEditingPlaceholder && placeholderInputRef.current) {
      placeholderInputRef.current.focus();
      const len = placeholderInputRef.current.value.length;
      placeholderInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditingPlaceholder]);

  const handleSaveLabel = () => {
    if (editLabelValue.trim() !== block.label) {
      onUpdateBlock({ label: editLabelValue.trim() || block.label });
    }
    setIsEditingLabel(false);
  };

  const handleSavePlaceholder = () => {
    if (editPlaceholderValue !== block.placeholder) {
      onUpdateBlock({ placeholder: editPlaceholderValue });
    }
    setIsEditingPlaceholder(false);
  };

  const handleLabelKeyDown = (e) => {
    if (e.key === 'Enter' && block.type !== 'paragraph') {
      e.preventDefault();
      handleSaveLabel();
    }
    if (e.key === 'Escape') {
      setEditLabelValue(block.label);
      setIsEditingLabel(false);
    }
  };

  const handlePlaceholderKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSavePlaceholder();
    }
    if (e.key === 'Escape') {
      setEditPlaceholderValue(block.placeholder || '');
      setIsEditingPlaceholder(false);
    }
  };

  const handleImageUpload = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const images = [...(block.images || [])];
          images[index] = reader.result;
          onUpdateBlock({ images });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const renderImageGrid = () => {
    const count = block.imageCount || 1;
    const images = block.images || [];
    const positions = block.imagePositions || [];
    const fit = block.imageFit || 'cover';
    const align = block.imageAlign || 'center';
    const radius = block.imageRadius || 'small';
    
    const gridClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-2',
      5: 'grid-cols-3',
    }[count];

    const alignClass = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    }[align];

    const radiusClass = {
      none: 'rounded-none',
      small: 'rounded-lg',
      medium: 'rounded-2xl',
      full: 'rounded-[2rem]',
    }[radius];

    return (
      <div className={cn('grid gap-3', gridClass)}>
        {Array.from({ length: count }).map((_, i) => {
          const hasImage = Boolean(images[i]);
          const pos = positions[i] || { x: 50, y: 50 };

          return (
            <div
              key={i}
              className={cn(
                'aspect-video overflow-hidden relative group',
                radiusClass,
                hasImage
                  ? ''
                  : 'border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2',
                'transition-smooth'
              )}
            >
              {hasImage ? (
                <>
                  <div className={cn('w-full h-full flex', alignClass)}>
                    <img
                      src={images[i]}
                      alt={`Uploaded form image ${i + 1}`}
                      className={cn(
                        fit === 'cover' ? 'w-full h-full object-cover' : 'h-full object-contain',
                        fit === 'contain' && radiusClass
                      )}
                      style={fit === 'cover' ? { objectPosition: `${pos.x}% ${pos.y}%` } : undefined}
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageUpload(i);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 hover:bg-background text-foreground opacity-0 group-hover:opacity-100 transition-smooth shadow-sm"
                    title="Change image"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageUpload(i);
                  }}
                  className="flex flex-col items-center justify-center gap-2 w-full h-full hover:border-primary/50 hover:bg-muted/50 transition-smooth"
                >
                  <Image className="w-8 h-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Click to upload</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'divider':
        return (
          <div 
            className="w-full flex justify-center py-2"
          >
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
        );
      case 'spacer':
        return (
          <div 
            className="w-full bg-muted/30 border border-dashed border-border rounded flex items-center justify-center text-xs text-muted-foreground"
            style={{ height: `${block.height || 32}px` }}
          >
            Spacer ({block.height || 32}px)
          </div>
        );
      case 'image':
        return renderImageGrid();
      case 'heading':
        const headingAlignClass = block.textAlign === 'center' ? 'text-center' : block.textAlign === 'right' ? 'text-right' : 'text-left';
        return isEditingLabel ? (
          <input
            ref={labelInputRef}
            type="text"
            value={editLabelValue}
            onChange={(e) => setEditLabelValue(e.target.value)}
            onBlur={handleSaveLabel}
            onKeyDown={handleLabelKeyDown}
            className={cn("text-xl font-semibold text-foreground bg-transparent outline-none w-full", headingAlignClass)}
          />
        ) : (
          <h3
            className={cn("text-xl font-semibold text-foreground cursor-text", headingAlignClass)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
              setIsEditingLabel(true);
            }}
          >
            {block.label}
          </h3>
        );
      case 'paragraph':
        const paragraphAlignClass =
          block.textAlign === 'center'
            ? 'text-center'
            : block.textAlign === 'right'
              ? 'text-right'
              : 'text-left';
        return isEditingLabel ? (
          <textarea
            ref={textareaRef}
            rows={1}
            value={editLabelValue}
            onChange={(e) => {
              setEditLabelValue(e.target.value);
              autoResizeTextarea();
            }}
            onFocus={autoResizeTextarea}
            onBlur={handleSaveLabel}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setEditLabelValue(block.label);
                setIsEditingLabel(false);
              }
            }}
            className={cn(
              'text-muted-foreground bg-transparent outline-none w-full resize-none overflow-hidden block',
              'leading-normal p-0 m-0 whitespace-pre-wrap break-words',
              paragraphAlignClass
            )}
            style={{ lineHeight: '1.5' }}
          />
        ) : (
          <p
            className={cn('text-muted-foreground cursor-text whitespace-pre-wrap break-words', paragraphAlignClass)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
              setIsEditingLabel(true);
            }}
          >
            {block.label}
          </p>
        );
      case 'short-text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel ? (
                <input
                  ref={labelInputRef}
                  type="text"
                  value={editLabelValue}
                  onChange={(e) => setEditLabelValue(e.target.value)}
                  onBlur={handleSaveLabel}
                  onKeyDown={handleLabelKeyDown}
                  className="text-sm font-medium text-foreground bg-transparent outline-none w-full p-0 border-0 block leading-5"
                />
              ) : (
                <label
                  className="text-sm font-medium text-foreground cursor-text block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingLabel(true);
                  }}
                >
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )
            )}
            {isEditingPlaceholder ? (
              <input
                ref={placeholderInputRef}
                type="text"
                value={editPlaceholderValue}
                onChange={(e) => setEditPlaceholderValue(e.target.value)}
                onBlur={handleSavePlaceholder}
                onKeyDown={handlePlaceholderKeyDown}
                className="w-full max-w-[300px] px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none"
              />
            ) : (
              <input
                type="text"
                value=""
                placeholder={block.placeholder}
                className="w-full max-w-[300px] px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none cursor-text"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                  setIsEditingPlaceholder(true);
                }}
                readOnly
              />
            )}
          </div>
        );
      case 'long-text':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel ? (
                <input
                  ref={labelInputRef}
                  type="text"
                  value={editLabelValue}
                  onChange={(e) => setEditLabelValue(e.target.value)}
                  onBlur={handleSaveLabel}
                  onKeyDown={handleLabelKeyDown}
                  className="text-sm font-medium text-foreground bg-transparent outline-none w-full p-0 border-0 block leading-5"
                />
              ) : (
                <label
                  className="text-sm font-medium text-foreground cursor-text block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingLabel(true);
                  }}
                >
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )
            )}
            {isEditingPlaceholder ? (
              <input
                ref={placeholderInputRef}
                type="text"
                value={editPlaceholderValue}
                onChange={(e) => setEditPlaceholderValue(e.target.value)}
                onBlur={handleSavePlaceholder}
                onKeyDown={handlePlaceholderKeyDown}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground outline-none"
              />
            ) : (
              <textarea
                placeholder={block.placeholder}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none resize-none cursor-text"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                  setIsEditingPlaceholder(true);
                }}
                readOnly
              />
            )}
          </div>
        );
      case 'dropdown':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel ? (
                <input
                  ref={labelInputRef}
                  type="text"
                  value={editLabelValue}
                  onChange={(e) => setEditLabelValue(e.target.value)}
                  onBlur={handleSaveLabel}
                  onKeyDown={handleLabelKeyDown}
                  className="text-sm font-medium text-foreground bg-transparent outline-none w-full p-0 border-0 block leading-5"
                />
              ) : (
                <label
                  className="text-sm font-medium text-foreground cursor-text block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingLabel(true);
                  }}
                >
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )
            )}
            <select
              className="w-full max-w-[300px] px-3 py-2 rounded-md border border-input bg-background text-muted-foreground"
              disabled
            >
              <option>Select an option...</option>
              {block.options?.map((opt, i) => (
                <option key={i}>{opt}</option>
              ))}
            </select>
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel ? (
                <input
                  ref={labelInputRef}
                  type="text"
                  value={editLabelValue}
                  onChange={(e) => setEditLabelValue(e.target.value)}
                  onBlur={handleSaveLabel}
                  onKeyDown={handleLabelKeyDown}
                  className="text-sm font-medium text-foreground bg-transparent outline-none w-full p-0 border-0 block leading-5"
                />
              ) : (
                <label
                  className="text-sm font-medium text-foreground cursor-text block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingLabel(true);
                  }}
                >
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )
            )}
            <div className="space-y-1.5">
              {block.options?.map((opt, i) => (
                <label key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" className="rounded border-input" disabled />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel ? (
                <input
                  ref={labelInputRef}
                  type="text"
                  value={editLabelValue}
                  onChange={(e) => setEditLabelValue(e.target.value)}
                  onBlur={handleSaveLabel}
                  onKeyDown={handleLabelKeyDown}
                  className="text-sm font-medium text-foreground bg-transparent outline-none w-full p-0 border-0 block leading-5"
                />
              ) : (
                <label
                  className="text-sm font-medium text-foreground cursor-text block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingLabel(true);
                  }}
                >
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )
            )}
            <div className="space-y-1.5">
              {block.options?.map((opt, i) => (
                <label key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <input type="radio" name={block.id} className="border-input" disabled />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );
      case 'products':
        const products = block.products || [];
        const layout = block.productsLayout || 'grid-2';

        if (products.length === 0) {
          return (
            <div className="space-y-2">
              {showLabel && (
                <label className="text-sm font-medium text-foreground block">
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )}
              <div className="p-4 border-2 border-dashed border-border rounded-lg bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground">
                  Продукти не додано. Керуйте ними в параметрах блоку.
                </p>
              </div>
            </div>
          );
        }

        // Render actual products
        if (layout === 'list') {
          return (
            <div className="space-y-2">
              {showLabel && (
                <label className="text-sm font-medium text-foreground block">
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )}
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex rounded-lg border border-border bg-background overflow-hidden"
                  >
                    {/* Full height image, left aligned, no margin */}
                    <div className="w-20 h-20 bg-muted flex-shrink-0 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 p-3 flex flex-col justify-start">
                      <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Grid view
        const gridCols = layout === 'grid-2' ? 'grid-cols-2' : 'grid-cols-3';
        return (
          <div className="space-y-2">
            {showLabel && (
              <label className="text-sm font-medium text-foreground block">
                {block.label}
                {block.required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}
            <div className={cn('grid gap-4', gridCols)}>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-border overflow-hidden bg-background"
                >
                  <div className="aspect-square bg-muted relative">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-foreground truncate text-sm">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'date':
        return (
          <div className="space-y-2">
            {showLabel && (
              isEditingLabel ? (
                <input
                  ref={labelInputRef}
                  type="text"
                  value={editLabelValue}
                  onChange={(e) => setEditLabelValue(e.target.value)}
                  onBlur={handleSaveLabel}
                  onKeyDown={handleLabelKeyDown}
                  className="text-sm font-medium text-foreground bg-transparent outline-none w-full p-0 border-0 block leading-5"
                />
              ) : (
                <label
                  className="text-sm font-medium text-foreground cursor-text block"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                    setIsEditingLabel(true);
                  }}
                >
                  {block.label}
                  {block.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )
            )}
            <input
              type="date"
              className="w-full max-w-[300px] px-3 py-2 rounded-md border border-input bg-background text-muted-foreground"
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
      data-block-root
      className={cn(
        'group relative transition-smooth py-2',
        // border overlay that extends beyond block without affecting layout
        "after:content-[''] after:absolute after:-inset-x-2 after:-inset-y-0 after:rounded-lg after:pointer-events-none after:transition-smooth",
        isActive
          ? 'after:border-2 after:border-primary'
          : 'after:border after:border-transparent hover:after:border-border'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Left action bar - vertical, close to block */}
      {/* gap-0.5 */}
      <div
        className={cn(
          'absolute -left-9 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-[1px]',
          'opacity-0 transition-smooth group-hover:opacity-100'
        )}
      >
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-smooth',
            'cursor-grab active:cursor-grabbing'
          )}
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 pointer-events-none" />
        </div>
        {/* Duplicate */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-smooth"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Block content */}
      <div className="w-full">{renderBlockContent()}</div>
    </div>
  );
};
