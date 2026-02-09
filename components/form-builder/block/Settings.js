// components/form-builder/block/Settings

/* eslint-disable react-hooks/rules-of-hooks */

'use client'

import { blockDefinitions } from '@/data/block-definitions';
import { BlockIcon } from '@/components/form-builder/block/ButtonIcons';
import { Plus, X, AlignLeft, AlignCenter, AlignRight, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/utils';
import { useState, useRef, useEffect } from 'react';
import { BlockLineItemsSettings } from '@/components/form-builder/block/LineItemsSettings';
import { availableIcons } from '@/components/form-builder/block/Icon';
import { listIconOptions } from '@/components/form-builder/block/List';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button'
import { SliderControl } from '@/components/form-builder/SliderControl'
import { ColorPicker } from '@/components/form-builder/ColorPicker';

// Slideshow position settings component with proper drag handling
const SlideshowPositionSettings = ({ block, onUpdate }) => {
  const containerRefs = useRef([]);
  const positions = block.slideshowImagePositions || [];

  const handlePositionDragStart = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = containerRefs.current[index];
    if (!container) return;
    
    const updatePosition = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      
      const newPositions = [...positions];
      newPositions[index] = { x, y };
      onUpdate({ slideshowImagePositions: newPositions });
    };
    
    updatePosition(e.clientX, e.clientY);
    
    const onMouseMove = (ev) => {
      ev.preventDefault();
      updatePosition(ev.clientX, ev.clientY);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Налаштувати положення фото</label>
      <p className="text-xs text-muted-foreground mb-2">
        Перетягніть фото, щоб обрати видиму частину
      </p>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {block.slideshowImages?.map((img, i) => {
          if (!img) return null;
          const pos = positions[i] || { x: 50, y: 50 };
          return (
            <div key={i} className="space-y-1">
              <span className="text-xs text-muted-foreground">Photo {i + 1}</span>
              <div
                ref={(el) => { containerRefs.current[i] = el; }}
                className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/50 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={(e) => handlePositionDragStart(i, e)}
              >
                <img
                  src={img}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
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
  );
};

// Image settings component with position adjustment
const ImageSettings = ({ block, onUpdate }) => {
  const containerRefs = useRef([]);

  const images = block.images || [];
  const positions = block.imagePositions || [];
  const fit = block.imageFit || 'cover';
  const align = block.imageAlign || 'center';

  const handlePositionDragStart = (index, e) => {
    if (fit !== 'cover') return;
    e.preventDefault();
    e.stopPropagation();
    
    const container = containerRefs.current[index];
    if (!container) return;
    
    const updatePosition = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      
      const newPositions = [...positions];
      newPositions[index] = { x, y };
      onUpdate({ imagePositions: newPositions });
    };
    
    updatePosition(e.clientX, e.clientY);
    
    const onMouseMove = (ev) => {
      ev.preventDefault();
      updatePosition(ev.clientX, ev.clientY);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="space-y-4">
      {/* Number of images */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Кількість зображень</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((count) => (
            <Button
              key={count}
              onClick={() => onUpdate({ imageCount })}
              size="black-editor"
              variant={(block.imageCount || 1) === count ? 'black-editor' : 'outline'}
            >
              {count}
            </Button>
          ))}
        </div>
        {/* {images.length > (block.imageCount || 1) && (
          <p className="text-xs text-amber-600">
            ⚠️ Reducing count will delete extra images
          </p>
        )} */}
      </div>

      {/* Image fit */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Підлаштування зображення</label>
        <div className="flex gap-2">
          <Button
            onClick={() => onUpdate({ imageFit: 'cover' })}
            size="black-editor"
            variant={fit === 'cover' ? 'black-editor' : 'outline'}
          >
            Заповнити
          </Button>
          <Button
            onClick={() => onUpdate({ imageFit: 'contain' })}
            size="black-editor"
            variant={fit === 'contain' ? 'black-editor' : 'outline'}
          >
            Показати Повністю
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {fit === 'cover'
            ? 'Зображення заповнює область, може обрізатися'
            : 'Зображення показується повністю, можливі порожні поля'
          }
        </p>
      </div>

      {/* Border radius */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Скруглення Кутів</label>
        <div className="flex gap-2">
          {([
            { value: 'none', label: 'Sharp' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'full', label: 'Round' },
          ]).map((option) => (
            <Button
              key={option.value}
              onClick={() => onUpdate({ imageRadius: option.value })}
              size="black-editor"
              variant={(block.imageRadius || 'small') === option.value ? 'black-editor' : 'outline'}
              className={cn(
                option.value === 'none' && 'rounded-none',
                option.value === 'small' && 'rounded-md',
                option.value === 'medium' && 'rounded-xl',
                option.value === 'full' && 'rounded-2xl'
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Alignment (for contain mode) */}
      {fit === 'contain' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Позиція</label>
          <div className="flex gap-2">
            <Button
              onClick={() => onUpdate({ imageAlign: 'left' })}
              size="black-editor"
              variant={align === 'left' ? 'black-editor' : 'outline'}
            >
              <AlignLeft className="w-4 h-4" />
              Left
            </Button>
            <Button
              onClick={() => onUpdate({ imageAlign: 'center' })}
              size="black-editor"
              variant={align === 'center' ? 'black-editor' : 'outline'}
            >
              <AlignCenter className="w-4 h-4" />
              Center
            </Button>
            <Button
              onClick={() => onUpdate({ imageAlign: 'right' })}
              size="black-editor"
              variant={align === 'right' ? 'black-editor' : 'outline'}
            >
              <AlignRight className="w-4 h-4" />
              Right
            </Button>
          </div>
        </div>
      )}

      {/* Position adjustment for cover mode */}
      {fit === 'cover' && images.some(Boolean) && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Змінити Положення</label>
          <p className="text-xs text-muted-foreground mb-2">
            Перетягніть зображення, щоб змінити видиму частину
          </p>
          <div className="space-y-3">
            {images.map((img, i) => {
              if (!img) return null;
              const pos = positions[i] || { x: 50, y: 50 };
              return (
                <div key={i} className="space-y-1">
                  <span className="text-xs text-muted-foreground">Image {i + 1}</span>
                  <div
                    ref={(el) => { containerRefs.current[i] = el; }}
                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/50 cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={(e) => handlePositionDragStart(i, e)}
                  >
                    <img
                      src={img}
                      alt={`Image ${i + 1}`}
                      className="w-full h-full object-cover pointer-events-none select-none"
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

// Icon settings component
const IconSettings = ({ block, onUpdate }) => {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  
  const selectedIcon = block.iconName || 'CheckCircle';
  const Icon = (LucideIcons)[selectedIcon];
  
  const filteredIcons = iconSearch
    ? availableIcons.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()))
    : availableIcons;

  const getBorderRadius = () => {
    const shape = block.iconBgShape || 'circle';
    const customRadius = block.iconBgRadius || 8;
    switch (shape) {
      case 'square': return customRadius;
      case 'rounded': return customRadius;
      case 'circle': return '9999px';
      default: return '9999px';
    }
  };

  return (
    <div className="space-y-4">
      {/* Icon Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Перегляд</label>
        <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
          <div
            className="flex items-center justify-center"
            style={{
              width: (block.iconSize || 32) + (block.iconBgPadding || 16) * 2,
              height: (block.iconSize || 32) + (block.iconBgPadding || 16) * 2,
              borderRadius: getBorderRadius(),
              backgroundColor: block.iconBgColor
            }}
          >
            {Icon && <Icon style={{ width: block.iconSize || 32, height: block.iconSize || 32, color: block.iconColor || '#22c55e' }} />}
          </div>
        </div>
      </div>

      {/* Icon Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Іконка</label>
        <button
          onClick={() => setShowIconPicker(!showIconPicker)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-smooth',
            'border-border hover:border-primary/50 bg-background'
          )}
        >
          {Icon && <Icon className="w-5 h-5" />}
          <span className="flex-1 text-left">{selectedIcon}</span>
          <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', showIconPicker && 'rotate-180')} />
        </button>
        
        {showIconPicker && (
          <div className="border border-border rounded-lg bg-background shadow-lg overflow-hidden">
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Search icons..."
                className={cn(
                  'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                )}
              />
            </div>
            <div className="max-h-48 overflow-y-auto p-2 grid grid-cols-6 gap-1">
              {filteredIcons.map((name) => {
                const IconComp = (LucideIcons)[name];
                if (!IconComp) return null;
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onUpdate({ iconName: name });
                      setShowIconPicker(false);
                      setIconSearch('');
                    }}
                    title={name}
                    className={cn(
                      'p-2 rounded-md hover:bg-accent transition-colors',
                      selectedIcon === name && 'bg-primary/10 ring-1 ring-primary'
                    )}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Icon Size */} 
      <SliderControl
        label="Розмір Іконки"
        value={block.iconSize}
        onChange={(value) => onUpdate({ iconSize: value })}
        defaultValue={32}
        min={16}
        max={80}
        step={1}
        unit="px"
      />

      {/* Icon Color */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Колір іконки</label>
        <ColorPicker
          value={block.iconColor ?? 'rgba(255, 255, 255, 0.85)'}
          defaultValue="rgba(255, 255, 255, 0.85)"
          onChange={(color) => onUpdate({ iconColor: color })}
        />
      </div>

      {/* Background Shape */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Форма фону</label>
        <div className="flex gap-2">
          {([
            { value: 'square', label: 'Квадрат' },
            { value: 'rounded', label: 'Завкруглена' },
            { value: 'circle', label: 'Коло' },
          ]).map((option) => (
            <Button
              key={option.value}
              onClick={() => onUpdate({ iconBgShape: option.value })}
              size="black-editor"
              variant={(block.iconBgShape || 'circle') === option.value ? 'black-editor' : 'outline'}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Corner Radius - only for square/rounded */}
      {(block.iconBgShape === 'square' || block.iconBgShape === 'rounded') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Скруглення кутів</label>
            {block.iconBgRadius !== 8 && (
              <button
                onClick={() => onUpdate({ iconBgRadius: 8 })}
                className="text-xs text-muted-foreground hover:text-primary transition-smooth"
              >
                Скинути
              </button>
            )}
          </div>
          <input
            type="range"
            min={0}
            max={32}
            value={block.iconBgRadius ?? 8}
            onChange={(e) => onUpdate({ iconBgRadius: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0px</span>
            <span className="font-medium text-foreground">{block.iconBgRadius ?? 8}px</span>
            <span>32px</span>
          </div>
        </div>
      )}

      {/* Background Color */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Колір фону</label>
        <ColorPicker
          value={block.iconBgColor ?? 'rgba(0, 0, 0, 0.20)'}
          defaultValue="rgba(0, 0, 0, 0.20)"
          onChange={(color) => onUpdate({ iconBgColor: color })}
        />
      </div>

      {/* Background Padding */}
      <SliderControl
        label="Відступи фону"
        value={block.iconBgPadding}
        onChange={(value) => onUpdate({ iconBgPadding: value })}
        defaultValue={16}
        min={0}
        max={48}
        step={1}
        unit="px"
      />
    </div>
  )
}

// List settings component
const ListSettings = ({ block, onUpdate }) => {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const items = block.listItems || [];
  const style = block.listStyle || 'icon';
  const iconName = block.listIcon || 'Check';
  const iconColor = block.listIconColor || '#22c55e';

  const IconComponent = (LucideIcons)[iconName];

  const addItem = () => {
    onUpdate({ listItems: [...items, `Item ${items.length + 1}`] });
  };

  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate({ listItems: newItems });
  };

  const removeItem = (index) => {
    onUpdate({ listItems: items.filter((_, i) => i !== index) });
  };

  const moveItem = (index, direction) => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    onUpdate({ listItems: newItems });
  };

  return (
    <div className="space-y-4">
      {/* Marker Style */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Стиль маркера</label>
        <div className="flex gap-2">
          {(['bullet', 'dash', 'icon']).map((s) => (
            <Button
              key={s}
              onClick={() => onUpdate({ listStyle: s })}
              size="black-editor"
              variant={style === s ? 'black-editor' : 'outline'}
            >
              {s === 'bullet' ? '● Маркер' : s === 'dash' ? '— Тире' : '✓ Іконка'}
            </Button>
          ))}
        </div>
      </div>

      {/* Icon Picker (only when style is 'icon') */}
      {style === 'icon' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Іконка</label>
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-smooth',
              'border-border hover:border-primary/50 bg-background'
            )}
          >
            {IconComponent && <IconComponent className="w-5 h-5" style={{ color: iconColor }} />}
            <span className="flex-1 text-left">{iconName}</span>
            <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', showIconPicker && 'rotate-180')} />
          </button>

          {showIconPicker && (
            <div className="border border-border rounded-lg bg-background shadow-lg overflow-hidden">
              <div className="max-h-48 overflow-y-auto p-2 grid grid-cols-5 gap-1">
                {listIconOptions.map((name) => {
                  const Icon = (LucideIcons)[name];
                  if (!Icon) return null;
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        onUpdate({ listIcon: name });
                        setShowIconPicker(false);
                      }}
                      title={name}
                      className={cn(
                        'p-2 rounded-md hover:bg-accent transition-colors',
                        iconName === name && 'bg-primary/10 ring-1 ring-primary'
                      )}
                    >
                      <Icon className="w-5 h-5" style={{ color: iconColor }} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Icon/Marker Color */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Колір Позначки</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={iconColor}
            onChange={(e) => onUpdate({ listIconColor: e.target.value })}
            className="w-10 h-10 rounded-md border border-input cursor-pointer"
          />
          <input
            type="text"
            value={iconColor}
            onChange={(e) => onUpdate({ listIconColor: e.target.value })}
            className={cn(
              'flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'transition-smooth'
            )}
          />
        </div>
      </div>

      {/* List Items */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Список Елементів</label>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <div className="flex flex-col">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className={cn(
                  'flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'transition-smooth'
                )}
              />
              <button
                onClick={() => removeItem(index)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-smooth opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-smooth"
        >
          <Plus className="w-4 h-4" />
          Додати елемент
        </button>
      </div>
    </div>
  );
};

// Avatar settings component
const AvatarSettings = ({ block, onUpdate }) => {
  const containerRef = useRef(null);
  const size = block.avatarSize ?? 64;
  const align = block.avatarAlign ?? 'center';
  const radius = block.avatarRadius ?? 'circle';
  const position = block.avatarPosition ?? { x: 50, y: 50 };
  const hasImage = Boolean(block.avatarImage);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate({ avatarImage });
    };
    reader.readAsDataURL(file);
  };

  const handlePositionDrag = (e) => {
    if (!hasImage) return;
    e.preventDefault();
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;
    
    const updatePosition = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      onUpdate({ avatarPosition: { x, y } });
    };
    
    updatePosition(e.clientX, e.clientY);
    
    const onMouseMove = (ev) => {
      ev.preventDefault();
      updatePosition(ev.clientX, ev.clientY);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const radiusClass = {
    none: 'rounded-none',
    small: 'rounded-lg',
    medium: 'rounded-2xl',
    circle: 'rounded-full',
  }[radius];

  return (
    <div className="space-y-4">
      {/* Avatar Preview - Fixed size for position adjustment only */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Змінити положення</label>
        <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
          <div
            ref={containerRef}
            className={cn(
              'relative overflow-hidden flex items-center justify-center bg-muted/50 border border-border',
              radiusClass,
              hasImage && 'cursor-grab active:cursor-grabbing'
            )}
            style={{ width: 96, height: 96 }}
            onMouseDown={handlePositionDrag}
          >
            {hasImage ? (
              <>
                <img
                  src={block.avatarImage}
                  alt="Avatar preview"
                  className="w-full h-full object-cover pointer-events-none select-none"
                  style={{ objectPosition: `${position.x}% ${position.y}%` }}
                  draggable={false}
                />
                {/* Position indicator circle */}
                <div
                  className="absolute w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg pointer-events-none"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Немає зображення</span>
            )}
          </div>
        </div>
        {hasImage && (
          <p className="text-xs text-muted-foreground text-center">
            Перетягуйте у перегляді, щоб змінити положення
          </p>
        )}
      </div>

      {/* Upload Image */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Зображення</label>
        <div className="flex gap-2">
          <label className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed',
            'border-input hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-smooth'
          )}>
            <Plus className="w-4 h-4" />
            <span className="text-sm">Завантажити зображення</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {hasImage && (
            <button
              onClick={() => onUpdate({ avatarImage: undefined })}
              className="p-2 rounded-md border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Розмір</label>
          {size !== 64 && (
            <button
              onClick={() => onUpdate({ avatarSize: 64 })}
              className="text-xs text-muted-foreground hover:text-primary transition-smooth"
            >
              Скинути
            </button>
          )}
        </div>
        <input
          type="range"
          min={16}
          max={256}
          step={8}
          value={size}
          onChange={(e) => onUpdate({ avatarSize: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>16px</span>
          <span className="font-medium text-foreground">{size}px</span>
          <span>256px</span>
        </div>
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Вирівнювання</label>
        <div className="flex gap-2">
          {(['left', 'center', 'right']).map((option) => (
            <Button
              key={option}
              onClick={() => onUpdate({ avatarAlign: option })}
              size="black-editor"
              variant={align === option ? 'black-editor' : 'outline'}
            >
              {option === 'left' && <AlignLeft className="w-4 h-4" />}
              {option === 'center' && <AlignCenter className="w-4 h-4" />}
              {option === 'right' && <AlignRight className="w-4 h-4" />}
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Скруглення кутів</label>
        <div className="flex gap-2">
          {([
            { value: 'none', label: 'Sharp' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'circle', label: 'Circle' },
          ]).map((option) => (
            <Button
              key={option.value}
              onClick={() => onUpdate({ avatarRadius: option.value })}
              size="black-editor"
              variant={radius === option.value ? 'black-editor' : 'outline'}
              className={cn(
                option.value === 'none' && 'rounded-none',
                option.value === 'small' && 'rounded-md',
                option.value === 'medium' && 'rounded-xl',
                option.value === 'circle' && 'rounded-full'
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlockSettings = ({ block, onUpdate }) => {
  if (!block) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <BlockIcon icon="Type" className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Виберіть блок для редагування налаштувань</p>
      </div>
    );
  }

  const definition = blockDefinitions.find((d) => d.type === block.type);
  const hasOptions = ['dropdown', 'checkbox', 'radio'].includes(block.type);
  const isInputBlock = ['short-text', 'long-text', 'email', 'number', 'dropdown', 'checkbox', 'radio', 'date'].includes(block.type);
  const isTextBlock = ['heading', 'paragraph'].includes(block.type);

  const addOption = () => {
    const options = block.options || [];
    onUpdate({ options: [...options, `Опція ${options.length + 1}`] });
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

  // Map search autocomplete (Nominatim)
  const [mapResults, setMapResults] = useState([]);
  const [mapResultsOpen, setMapResultsOpen] = useState(false);
  const mapSearchTimerRef = useRef(null);

  useEffect(() => {
    if (block.type !== 'map') return;

    const q = (block.mapQuery ?? '').trim();

    if (mapSearchTimerRef.current != null) {
      window.clearTimeout(mapSearchTimerRef.current);
      mapSearchTimerRef.current = null;
    }

    if (!q) {
      setMapResults([]);
      setMapResultsOpen(false);
      return;
    }

    mapSearchTimerRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`
        );
        const data = (await res.json());
        setMapResults(Array.isArray(data) ? data : []);
        setMapResultsOpen(true);
      } catch {
        setMapResults([]);
        setMapResultsOpen(false);
      }
    }, 300);

    return () => {
      if (mapSearchTimerRef.current != null) {
        window.clearTimeout(mapSearchTimerRef.current);
        mapSearchTimerRef.current = null;
      }
    };
  }, [block.type, block.mapQuery]);

  const applyMapResult = (hit) => {
    onUpdate({
      mapQuery: hit.display_name,
      mapCenterLat: parseFloat(hit.lat),
      mapCenterLng: parseFloat(hit.lon),
    });
    setMapResultsOpen(false);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Block type indicator - hide for Line items since it has its own header */}
      {block.type !== 'line-items' && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/[0.12]">
          <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center shadow-soft">
            <BlockIcon icon={definition?.icon || 'Type'} className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{definition?.label}</p>
            <p className="text-xs text-muted-foreground">Тип блоку</p>
          </div>
        </div>
      )}

      {/* Block Width - available for all blocks */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Ширина</label>
        <div className="flex gap-2">
          {(['1/1', '1/2', '1/3']).map((width) => (
            <Button
              key={width}
              onClick={() => onUpdate({ blockWidth: width })}
              size="black-editor"
              variant={(block?.blockWidth || '1/1') === width ? 'black-editor' : 'outline'}
            >
              {width}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Блоки з однаковою шириною автоматично стають в один ряд
        </p>
      </div>

      {/* Vertical Alignment - for inline blocks */}
      {(block.blockWidth === '1/2' || block.blockWidth === '1/3') && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Вертикальне вирівнювання</label>
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-1 p-2 rounded-lg border border-border bg-muted/30">
              {(['top', 'center', 'bottom']).map((vertical) => (
                (['start', 'center', 'end']).map((horizontal) => {
                  const isSelected = 
                    (block.blockVerticalAlign || 'top') === vertical && 
                    (block.blockHorizontalAlign || 'start') === horizontal;
                  return (
                    <button
                      key={`${vertical}-${horizontal}`}
                      onClick={() => onUpdate({ 
                        blockVerticalAlign: vertical, 
                        blockHorizontalAlign: horizontal 
                      })}
                      className={cn(
                        'w-5 h-5 rounded-sm flex items-center justify-center transition-smooth',
                        isSelected
                          ? 'bg-primary'
                          : 'bg-muted hover:bg-muted-foreground/20'
                      )}
                    >
                      <span 
                        className={cn(
                          'w-2 h-2 rounded-full transition-smooth',
                          isSelected ? 'bg-primary-foreground' : 'bg-muted-foreground/50'
                        )}
                      />
                    </button>
                  );
                })
              ))}
            </div>
            <p className="text-xs text-muted-foreground flex-1">
              Вирівнювання блоку в межах простору
            </p>
          </div>
        </div>
      )}

      {/* Spacer height */}
      {block.type === 'spacer' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Висота (px)</label>
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
            <label className="text-sm font-medium text-foreground">Колір</label>
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
            <label className="text-sm font-medium text-foreground">Товщина (px)</label>
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
            <label className="text-sm font-medium text-foreground">Ширина (%)</label>
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
            <label className="text-sm font-medium text-foreground">Стиль</label>
            <div className="flex gap-2">
              {(['solid', 'dashed', 'dotted']).map((style) => (
                <Button
                  key={style}
                  onClick={() => onUpdate({ dividerStyle: style })}
                  size="black-editor"
                  variant={(block.dividerStyle || 'solid') === style ? 'black-editor' : 'outline'}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Перегляд</label>
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

      {/* List settings */}
      {block.type === 'list' && (
        <ListSettings block={block} onUpdate={onUpdate} />
      )}

      {/* Image settings */}
      {block.type === 'image' && (
        <ImageSettings block={block} onUpdate={onUpdate} />
      )}

      {/* Slideshow settings */}
      {block.type === 'slideshow' && (
        <div className="space-y-4">
          {/* Height */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Висота фото (px)</label>
            <input
              type="number"
              value={block.slideshowHeight || 200}
              onChange={(e) => onUpdate({ slideshowHeight: Math.max(80, Math.min(600, parseInt(e.target.value) || 200)) })}
              min={80}
              max={600}
              className={cn(
                'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-smooth'
              )}
            />
            <p className="text-xs text-muted-foreground">Усі фото мають однакову висоту незалежно від орієнтації</p>
          </div>

          {/* Gap */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Відстань між фото (px)</label>
            <input
              type="range"
              value={block.slideshowGap ?? 12}
              onChange={(e) => onUpdate({ slideshowGap: parseInt(e.target.value) })}
              min={0}
              max={32}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0px</span>
              <span className="font-medium text-foreground">{block.slideshowGap ?? 12}px</span>
              <span>32px</span>
            </div>
          </div>

          {/* Corners / Rounding */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Скруглення кутів</label>
            <div className="flex gap-2">
              {([
                { value: 'none', label: 'Sharp' },
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]).map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onUpdate({ slideshowRadius: option.value })}
                  size="black-editor"
                  variant={(block.slideshowRadius || 'small') === option.value ? 'black-editor' : 'outline'}
                  className={cn(
                    option.value === 'none' && 'rounded-none',
                    option.value === 'small' && 'rounded-md',
                    option.value === 'medium' && 'rounded-xl',
                    option.value === 'large' && 'rounded-2xl'
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Position adjustment for slideshow images */}
          {(block.slideshowImages?.length || 0) > 0 && (
            <SlideshowPositionSettings 
              block={block} 
              onUpdate={onUpdate} 
            />
          )}

          {/* Image count */}
          <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
            <span className="text-sm text-foreground">Фото додано</span>
            <span className="text-sm font-medium text-foreground">{block.slideshowImages?.length || 0}</span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Натисніть «Додати фото», щоб додати зображення. Гортайте фото горизонтальним перетягуванням.
          </p>
        </div>
      )}

      {/* Line items settings */}
      {block.type === 'line-items' && (
        <BlockLineItemsSettings block={block} onUpdate={onUpdate} />
      )}

      {/* Reviews settings */}
      {block.type === 'reviews' && (
        <div className="space-y-4">
          {/* Layout */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Макет</label>
            <div className="flex gap-2">
              <Button
                onClick={() => onUpdate({ reviewsLayout: 'cards' })}
                size="black-editor"
                variant={(block.reviewsLayout || 'cards') === 'cards' ? 'black-editor' : 'outline'}
              >
                Картки
              </Button>
              <Button
                onClick={() => onUpdate({ reviewsLayout: 'list' })}
                size="black-editor"
                variant={block.reviewsLayout === 'list' ? 'black-editor' : 'outline'}
              >
                Список
              </Button>
            </div>
          </div>

          {/* Show Avatar */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Показати аватар</label>
            <button
              onClick={() => onUpdate({ reviewsShowAvatar: block.reviewsShowAvatar === false ? true : false })}
              className={cn(
                'relative w-11 h-6 rounded-full transition-smooth',
                block.reviewsShowAvatar !== false ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow-soft transition-smooth',
                  block.reviewsShowAvatar !== false && 'translate-x-5'
                )}
              />
            </button>
          </div>

          {/* Review count */}
          <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
            <span className="text-sm text-foreground">Відгуки додано</span>
            <span className="text-sm font-medium text-foreground">{block.reviews?.length || 0}</span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Натисніть «Додати відгук», щоб додати відгуки. Редагування — в налаштуваннях блоку.
          </p>

          {/* Edit individual reviews */}
          {(block.reviews?.length || 0) > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Редагувати відгуки</label>
              {block.reviews?.map((review, i) => (
                <div key={review.id} className="space-y-2 p-3 rounded-lg border border-border bg-muted/30">
                  <span className="text-xs text-muted-foreground">Відгук {i + 1}</span>
                  <textarea
                    value={review.text}
                    onChange={(e) => {
                      const newReviews = [...(block.reviews || [])];
                      newReviews[i] = { ...newReviews[i], text: e.target.value };
                      onUpdate({ reviews: newReviews });
                    }}
                    rows={2}
                    className={cn(
                      'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      'transition-smooth resize-none'
                    )}
                    placeholder="Текст відгуку..."
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={review.authorName}
                      onChange={(e) => {
                        const newReviews = [...(block.reviews || [])];
                        newReviews[i] = { ...newReviews[i], authorName: e.target.value };
                        onUpdate({ reviews: newReviews });
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-md border border-input bg-background text-foreground text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                      )}
                      placeholder="Імʼя"
                    />
                    <input
                      type="text"
                      value={review.authorRole || ''}
                      onChange={(e) => {
                        const newReviews = [...(block.reviews || [])];
                        newReviews[i] = { ...newReviews[i], authorRole: e.target.value };
                        onUpdate({ reviews: newReviews });
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-md border border-input bg-background text-foreground text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                      )}
                      placeholder="Роль"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Рейтинг:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            const newReviews = [...(block.reviews || [])];
                            newReviews[i] = { ...newReviews[i], rating: star };
                            onUpdate({ reviews: newReviews });
                          }}
                          className={cn(
                            'p-0.5 rounded',
                            (review.rating || 5) >= star ? 'text-amber-400' : 'text-muted-foreground/30'
                          )}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAQ settings */}
      {block.type === 'faq' && (
        <div className="space-y-4">
          {/* FAQ count */}
          <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
            <span className="text-sm text-foreground">Елементи FAQ додано</span>
            <span className="text-sm font-medium text-foreground">{block.faqItems?.length || 0}</span>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Натисніть «Додати елемент FAQ», щоб додати запитання. Окремі пункти редагуються нижче.
          </p>

          {/* Edit individual FAQ items */}
          {(block.faqItems?.length || 0) > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Редагувати елемент FAQ</label>
              {block.faqItems?.map((item, i) => (
                <div key={item.id} className="space-y-2 p-3 rounded-lg border border-border bg-muted/30">
                  <span className="text-xs text-muted-foreground">Item {i + 1}</span>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...(block.faqItems || [])];
                      newItems[i] = { ...newItems[i], question: e.target.value };
                      onUpdate({ faqItems: newItems });
                    }}
                    className={cn(
                      'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                    )}
                    placeholder="Question"
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...(block.faqItems || [])];
                      newItems[i] = { ...newItems[i], answer: e.target.value };
                      onUpdate({ faqItems: newItems });
                    }}
                    rows={2}
                    className={cn(
                      'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      'transition-smooth resize-none'
                    )}
                    placeholder="Answer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map settings */}
      {block.type === 'map' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Локація</label>

            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={block.mapQuery || ''}
                  onChange={(e) => onUpdate({ mapQuery: e.target.value })}
                  onFocus={() => {
                    if (mapResults.length > 0) setMapResultsOpen(true);
                  }}
                  placeholder="Search a place…"
                  className={cn(
                    'flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground',
                    'placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                    'transition-smooth'
                  )}
                />

                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const q = (block.mapQuery || '').trim();
                    if (!q) return;

                    // Prefer the already-fetched suggestions (faster, consistent).
                    if (mapResults[0]) {
                      applyMapResult(mapResults[0]);
                      return;
                    }

                    try {
                      const res = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`
                      );
                      const data = (await res.json());
                      const hit = data?.[0];
                      if (!hit) return;
                      applyMapResult(hit);
                    } catch {
                      // ignore
                    }
                  }}
                  className={cn(
                    'px-3 py-2 rounded-md border border-border bg-muted/40 text-sm font-medium text-foreground',
                    'hover:bg-muted/60 transition-smooth'
                  )}
                >
                  Search
                </button>
              </div>

              {mapResultsOpen && mapResults.length > 0 ? (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-panel overflow-hidden">
                  {mapResults.map((hit, idx) => (
                    <button
                      key={`${hit.lat}-${hit.lon}-${idx}`}
                      type="button"
                      onMouseDown={(ev) => {
                        // Prevent input blur before click.
                        ev.preventDefault();
                      }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        applyMapResult(hit);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm leading-snug',
                        'hover:bg-accent/50 transition-smooth'
                      )}
                    >
                      {hit.display_name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground">
              Оберіть підказку й клацніть на карту, щоб додати пін. Масштаб і позиція зберігаються автоматично.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-foreground">Marker</label>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdate({ mapMarkerLat: undefined, mapMarkerLng: undefined, mapMarkerLabel: '' });
                }}
                className={cn(
                  'px-2 py-1 rounded-md border border-border bg-muted/40 text-xs font-medium text-foreground',
                  'hover:bg-muted/60 transition-smooth'
                )}
              >
                Очистити
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.000001"
                value={block.mapMarkerLat ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  onUpdate({ mapMarkerLat: v === '' ? undefined : parseFloat(v) });
                }}
                placeholder="Latitude"
                className={cn(
                  'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'transition-smooth'
                )}
              />
              <input
                type="number"
                step="0.000001"
                value={block.mapMarkerLng ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  onUpdate({ mapMarkerLng: v === '' ? undefined : parseFloat(v) });
                }}
                placeholder="Longitude"
                className={cn(
                  'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'transition-smooth'
                )}
              />
            </div>

            <input
              type="text"
              value={block.mapMarkerLabel ?? ''}
              onChange={(e) => onUpdate({ mapMarkerLabel: e.target.value })}
              placeholder="Marker label (shown above the pin)"
              className={cn(
                'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-smooth'
              )}
            />

            <p className="text-xs text-muted-foreground">Порада: клікніть на карту, щоб поставити пін, і перетягніть його за потреби.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Масштаб</label>
            <input
              type="range"
              min={1}
              max={20}
              value={block.mapZoom ?? 14}
              onChange={(e) => onUpdate({ mapZoom: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span className="font-medium text-foreground">{block.mapZoom ?? 14}</span>
              <span>20</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Висота (px)</label>
            <input
              type="number"
              min={160}
              max={800}
              value={block.mapHeight ?? 320}
              onChange={(e) =>
                onUpdate({ mapHeight: Math.max(160, Math.min(800, parseInt(e.target.value) || 320)) })
              }
              className={cn(
                'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-smooth'
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Стиль карти</label>
            <div className="flex gap-2">
              {([
                { value: 'color', label: 'Color' },
                { value: 'bw', label: 'B&W' },
                { value: 'satellite', label: 'Satellite' },
              ]).map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onUpdate({ mapStyle: option.value })}
                  size="black-editor"
                  variant={(block.mapStyle ?? 'color') === option.value ? 'black-editor' : 'outline'}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Icon settings */}
      {block.type === 'icon' && (
        <IconSettings block={block} onUpdate={onUpdate} />
      )}

      {/* Avatar settings */}
      {block.type === 'avatar' && (
        <AvatarSettings block={block} onUpdate={onUpdate} />
      )}

      {/* Label field */}
      {!['spacer', 'image', 'slideshow', 'line-items', 'divider', 'reviews', 'faq', 'icon', 'avatar', 'messenger-select'].includes(block.type) && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Назва поля</label>
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
          <label className="text-sm font-medium text-foreground">Вирівнювання тексту</label>
          <div className="flex gap-2">
            <Button
              onClick={() => onUpdate({ textAlign: 'left' })}
              size="black-editor"
              variant={(block.textAlign || 'left') === 'left' ? 'black-editor' : 'outline'}
            >
              <AlignLeft className="w-4 h-4" />
              Зліва
            </Button>
            <Button
              onClick={() => onUpdate({ textAlign: 'center' })}
              size="black-editor"
              variant={block.textAlign === 'center' ? 'black-editor' : 'outline'}
            >
              <AlignCenter className="w-4 h-4" />
              Центр
            </Button>
            <Button
              onClick={() => onUpdate({ textAlign: 'right' })}
              size="black-editor"
              variant={block.textAlign === 'right' ? 'black-editor' : 'outline'}
            >
              <AlignRight className="w-4 h-4" />
              Справа
            </Button>
          </div>
        </div>
      )}

      {/* Per-block text color */}
      {!['spacer', 'divider', 'image', 'slideshow', 'icon', 'map', 'reviews', 'faq', 'line-items', 'avatar', 'messenger-select'].includes(block.type) && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Колір тексту</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={block.textColor || '#000000'}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="w-10 h-10 rounded-md border border-input cursor-pointer"
            />
            <input
              type="text"
              value={block.textColor || ''}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              placeholder="Inherit from design"
              className={cn(
                'flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-smooth'
              )}
            />
            {block.textColor && (
              <button
                onClick={() => onUpdate({ textColor: undefined })}
                className="px-2 py-2 rounded-md border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth"
                title="Reset to default"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Залиште порожнім, щоб використати глобальний колір тексту з налаштувань дизайну
          </p>
        </div>
      )}

      {/* Show/Hide Label toggle */}
      {isInputBlock && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Показувати назву</label>
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
          <label className="text-sm font-medium text-foreground">Заповнювач</label>
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
      {!['heading', 'paragraph', 'spacer', 'image', 'icon', 'divider', 'slideshow', 'map', 'reviews', 'faq', 'avatar', 'messenger-select', 'grid'].includes(block.type) && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Обовʼязкове</label>
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

      {/* Choice block layout settings (checkbox/radio) */}
      {(block.type === 'checkbox' || block.type === 'radio') && (
        <>
          {/* Columns per row - always visible */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Колонки</label>
            <div className="flex gap-2">
              {([1, 2, 3, 4]).map((cols) => (
                <button
                  key={cols}
                  onClick={() => onUpdate({ choiceColumns: cols })}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth',
                    (block.choiceColumns || 2) === cols
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground hover:border-primary/50'
                  )}
                >
                  {cols}
                </button>
              ))}
            </div>
          </div>

          {/* Gap between options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Відступ</label>
              <span className="text-xs text-muted-foreground">{block.choiceGap ?? 12}px</span>
            </div>
            <input
              type="range"
              min={2}
              max={64}
              value={block.choiceGap ?? 12}
              onChange={(e) => onUpdate({ choiceGap: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </>
      )}

      {/* Options editor with images for checkbox/radio */}
      {hasOptions && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Опції</label>
          <div className="space-y-3">
            {block.options?.map((option, index) => {
              const optionImage = block.optionImages?.[index] || '';
              const isChoiceBlock = block.type === 'checkbox' || block.type === 'radio';

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
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

                  {/* Image upload for choice blocks - always shown */}
                  {isChoiceBlock && (
                    <div className="ml-0">
                      {optionImage
                        ? <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-border group">
                            <img
                              src={optionImage}
                              alt={option}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => {
                                const newImages = [...(block.optionImages || [])]
                                newImages[index] = ''
                                onUpdate({ optionImages: newImages })
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        : <button
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = (e) => {
                                const file = (e.target).files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = () => {
                                    const newImages = [...(block.optionImages || [])]
                                    newImages[index] = reader.result
                                    onUpdate({ optionImages: newImages, choiceLayout: 'horizontal' })
                                  }
                                  reader.readAsDataURL(file)
                                }
                              };
                              input.click()
                            }}
                            className={cn(
                              'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
                              'border border-dashed border-border hover:border-primary/50',
                              'text-muted-foreground hover:text-foreground transition-smooth'
                            )}
                          >
                            <Plus className="w-3 h-3" />
                            Додати зображення
                          </button>
                      }
                    </div>
                  )}
                </div>
              )
            })}
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
            Додати опцію
          </button>
        </div>
      )}
    </div>
  )
}
