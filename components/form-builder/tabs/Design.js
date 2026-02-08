// components/form-builder/tabs/Design

'use client'

import { useState } from 'react';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/form-builder/ColorPicker'

// Background colors with associated text colors
const backgroundColors = [
  { label: 'Білий', value: 'bg-white', preview: 'bg-white', textColor: 'text-foreground' },
  { label: 'Молочний', value: 'bg-[#F9F8F7]', preview: 'bg-[#F9F8F7]', textColor: 'text-slate-900' },
  { label: 'Піщаний', value: 'bg-[#DAD6D3]', preview: 'bg-[#DAD6D3]', textColor: 'text-slate-900' },
  { label: 'Попелястий', value: 'bg-[#BDC2C2]', preview: 'bg-[#BDC2C2]', textColor: 'text-slate-900' },
  { label: 'Пудровий', value: 'bg-[#E7CBCB]', preview: 'bg-[#E7CBCB]', textColor: 'text-foreground' },
  { label: 'Оливковий', value: 'bg-[#4B4913]', preview: 'bg-[#4B4913]', textColor: 'text-slate-900' },
  // Dark backgrounds
  // { value: 'bg-slate-800', preview: 'bg-slate-800', textColor: 'text-slate-100' },
  // { value: 'bg-slate-900', preview: 'bg-slate-900', textColor: 'text-slate-100' },
  // { value: 'bg-black', preview: 'bg-black', textColor: 'text-white' },
]

const headingColors = [
  { label: 'Default', value: 'text-foreground', preview: 'bg-foreground' },
  { label: 'Dark', value: 'text-slate-900', preview: 'bg-slate-900' },
  { label: 'Medium', value: 'text-primary', preview: 'bg-primary' },
  { label: 'Primary', value: 'text-slate-600', preview: 'bg-slate-600' },
]

const textColors = [
  { label: 'Default', value: 'text-foreground', preview: 'bg-foreground' },
  { label: 'Dark', value: 'text-slate-900', preview: 'bg-slate-900' },
  { label: 'Medium', value: 'text-[#666666]', preview: 'bg-[#666666]' },
  { label: 'Primary', value: 'text-primary', preview: 'bg-primary' },
]

const headingSizes = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
  { value: 'xlarge', label: 'XL' },
]

const fontSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

// Predefined accent colors
const accentColors = [
  { label: 'Чорний', value: '#000000', preview: 'bg-black' },
  { label: 'Білий', value: '#ffffff', preview: 'bg-white' },
  { label: 'Синій', value: '#3b82f6', preview: 'bg-blue-500' },
  { label: 'Зелений', value: '#22c55e', preview: 'bg-green-500' },
  { label: 'Жовтий', value: '#eab308', preview: 'bg-yellow-500' },
  { label: 'Червоний', value: '#ef4444', preview: 'bg-red-500' },
]

// Predefined input background colors
const inputBgColors = [
  { label: 'Прозорий', value: 'transparent', preview: 'bg-transparent' },
  { label: 'Білий', value: '#ffffff', preview: 'bg-white' },
  { label: 'Світло-сірий', value: '#f9fafb', preview: 'bg-gray-50' },
  { label: 'Сірий', value: '#f3f4f6', preview: 'bg-gray-100' },
  { label: 'Темно-сірий', value: '#1f2937', preview: 'bg-gray-800' },
  { label: 'Чорний', value: '#000000', preview: 'bg-black' },
]

// Predefined input colors
const inputColors = [
  { label: 'Світло-сірий', value: '#e5e7eb', preview: 'bg-gray-200' },
  { label: 'Сірий', value: '#d1d5db', preview: 'bg-gray-300' },
  { label: 'Темно-сірий', value: '#9ca3af', preview: 'bg-gray-400' },
  { label: 'Чорний', value: '#000000', preview: 'bg-black' },
  { label: 'Білий', value: '#ffffff', preview: 'bg-white' },
  { label: 'Синій', value: '#3b82f6', preview: 'bg-blue-500' },
]

// Predefined input text colors
const inputTextColors = [
  { label: 'Чорний', value: '#000000', preview: 'bg-black' },
  { label: 'Темно-сірий', value: '#1f2937', preview: 'bg-gray-800' },
  { label: 'Сірий', value: '#374151', preview: 'bg-gray-700' },
  { label: 'Білий', value: '#ffffff', preview: 'bg-white' },
  { label: 'Світло-сірий', value: '#f9fafb', preview: 'bg-gray-50' },
]


export const TabsDesign = ({ design, onUpdateDesign }) => {
  const [showCustomBgColor, setShowCustomBgColor] = useState(false);
  const [customBgColor, setCustomBgColor] = useState('#ffffff');
  const [showCustomHeadingColor, setShowCustomHeadingColor] = useState(false);
  const [customHeadingColor, setCustomHeadingColor] = useState('#000000');
  const [showCustomTextColor, setShowCustomTextColor] = useState(false);
  const [customTextColor, setCustomTextColor] = useState('#000000');
  const [showCustomAccentColor, setShowCustomAccentColor] = useState(false);
  const [customAccentColor, setCustomAccentColor] = useState(design.accentColor || '#000000');
  const [showCustomInputColor, setShowCustomInputColor] = useState(false);
  const [customInputColor, setCustomInputColor] = useState(design.inputColor || '#e5e7eb');
  const [showCustomInputBgColor, setShowCustomInputBgColor] = useState(false);
  const [customInputBgColor, setCustomInputBgColor] = useState(design.inputBgColor || 'transparent');
  const [showCustomInputTextColor, setShowCustomInputTextColor] = useState(false);
  const [customInputTextColor, setCustomInputTextColor] = useState(design.inputTextColor || '#000000');

  // Check if current colors are custom (hex or rgba)
  const isCustomBg = design.backgroundColor.startsWith('bg-[#') || design.backgroundColor.startsWith('bg-[rgba');
  const isCustomText = design.textColor.startsWith('text-[#') || design.textColor.startsWith('text-[rgba');
  const isCustomHeading = design.headingColor?.startsWith('text-[#') || design.headingColor?.startsWith('text-[rgba');

  // Extract current custom colors from design
  const getCurrentColor = (color) => {
    const match = color?.match(/(?:bg-|text-)\[((?:#[0-9A-Fa-f]+|rgba?\([^)]+\)))\]/)?.[1]
    return match || 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
  }

  // Helper to determine if a color is light or dark (for custom colors)
  const isLightColor = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma > 128;
  };

  const handleCustomBgColorChange = (color) => {
    setCustomBgColor(color);
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      // Auto-set text color based on background brightness
      const textColorValue = isLightColor(color) ? 'text-slate-900' : 'text-slate-100';
      // Preserve custom colors if they exist, otherwise use auto text color
      const updatedHeadingColor = isCustomHeading ? design.headingColor : textColorValue;
      const updatedTextColor = isCustomText ? design.textColor : textColorValue;
      onUpdateDesign({
        backgroundColor: `bg-[${color}]`,
        textColor: updatedTextColor,
        headingColor: updatedHeadingColor
      });
    }
  };

  const handleCustomTextColorChange = (color) => {
    setCustomTextColor(color);
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      onUpdateDesign({ textColor: `text-[${color}]` });
    }
  };

  const handleCustomHeadingColorChange = (color) => {
    setCustomHeadingColor(color);
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      onUpdateDesign({ headingColor: `text-[${color}]` });
    }
  };

  const handleAccentColorChange = (color) => {
    setCustomAccentColor(color)
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      onUpdateDesign({ accentColor: color })
    }
  }

  const handleInputColorChange = (color) => {
    setCustomInputColor(color)
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      onUpdateDesign({ inputColor: color })
    }
  }

  const handleInputBgColorChange = (color) => {
    setCustomInputBgColor(color)
    if (/^#[0-9A-Fa-f]{6}$/.test(color) || color === 'transparent') {
      onUpdateDesign({ inputBgColor: color })
    }
  }

  const handleInputTextColorChange = (color) => {
    setCustomInputTextColor(color)
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      onUpdateDesign({ inputTextColor: color })
    }
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Background Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Колір фону</label>
        <div className="grid grid-cols-3 gap-2">
          {backgroundColors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                setShowCustomBgColor(false);
                // Preserve custom colors if they exist
                const updatedHeadingColor = isCustomHeading ? design.headingColor : color.textColor;
                const updatedTextColor = isCustomText ? design.textColor : color.textColor;
                // Auto-update text color when background changes
                onUpdateDesign({ 
                  backgroundColor: color.value, 
                  textColor: updatedTextColor,
                  headingColor: updatedHeadingColor
                });
              }}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg border transition-smooth',
                design.backgroundColor === color.value && !isCustomBg
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn('w-8 h-8 rounded-md border border-border', color.preview)} />
              <span className="text-xs text-muted-foreground">{color.label}</span>
            </button>
          ))}
          {/* Custom color button */}
          <button
            onClick={() => {
              // Підставляємо поточний колір при відкритті
              if (!showCustomBgColor && isCustomBg) {
                const match = getCurrentColor(design.backgroundColor)
                if (match) setCustomBgColor(match)
              }
              setShowCustomBgColor(!showCustomBgColor)
            }}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-lg border transition-smooth',
              (showCustomBgColor || isCustomBg)
                ? 'border-primary bg-accent/50'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div 
              className="w-8 h-8 rounded-md border border-border"
              style={{ background: getCurrentColor(design.backgroundColor) }}
            />
            <span className="text-xs text-muted-foreground">Власний</span>
          </button>
        </div>
        
        {/* Custom background color picker */}
        {showCustomBgColor && (
          <ColorPicker
            key={`bg-${customBgColor}`}
            value={customBgColor}
            onChange={(color) => {
              setCustomBgColor(color);
              if (color.startsWith('rgba')) {
                onUpdateDesign({ backgroundColor: `bg-[${color.replace(/\s/g, '')}]` });
              } else if (/^#[0-9A-Fa-f]{6}$/i.test(color)) {
                const textColorValue = isLightColor(color) ? 'text-slate-900' : 'text-slate-100';
                onUpdateDesign({ backgroundColor: `bg-[${color}]`, textColor: textColorValue, headingColor: textColorValue });
              }
            }}
            className="mt-2"
          />
        )}
      </div>

      {/* Heading Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Колір заголовків</label>
        <div className="grid grid-cols-2 gap-2">
          {headingColors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                setShowCustomHeadingColor(false);
                onUpdateDesign({ headingColor: color.value });
              }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-smooth',
                // color.preview,
                (design.headingColor || 'text-foreground') === color.value && !isCustomHeading
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn('w-6 h-6 rounded-full', color.preview)} />
              <span className="text-sm text-foreground">{color.label}</span>
            </button>
          ))}
          {/* Custom heading color button */}
          <button
            onClick={() => {
              if (!showCustomHeadingColor && isCustomHeading) {
                const match = getCurrentColor(design.headingColor)
                if (match) setCustomHeadingColor(match)
              }
              setShowCustomHeadingColor(!showCustomHeadingColor)
            }}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-smooth',
              (showCustomHeadingColor || isCustomHeading)
                ? 'border-primary bg-accent/50'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div 
              className="w-6 h-6 rounded-full border border-border"
              style={{ background: getCurrentColor(design.headingColor) }}
            />
            <span className="text-sm text-foreground">Власний</span>
          </button>
        </div>

        {/* Custom heading color picker */}
        {showCustomHeadingColor && (
          <ColorPicker
            key={`heading-${customHeadingColor}`}
            value={customHeadingColor}
            onChange={(color) => {
              setCustomHeadingColor(color);
              if (color.startsWith('rgba')) {
                onUpdateDesign({ headingColor: `text-[${color.replace(/\s/g, '')}]` });
              } else if (/^#[0-9A-Fa-f]{6}$/i.test(color)) {
                onUpdateDesign({ headingColor: `text-[${color}]` });
              }
            }}
            className="mt-2"
          />
        )}
      </div>

      {/* Text Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Колір тексту</label>
        <div className="grid grid-cols-2 gap-2">
          {textColors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                setShowCustomTextColor(false);
                onUpdateDesign({ textColor: color.value });
              }}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-smooth',
                // color.preview,
                design.textColor === color.value && !isCustomText
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn('w-6 h-6 rounded-full', color.preview)} />
              <span className="text-sm text-foreground">{color.label}</span>
            </button>
          ))}
          {/* Custom text color button */}
          <button
            onClick={() => {
              if (!showCustomTextColor && isCustomText) {
                const match = getCurrentColor(design.textColor)
                if (match) setCustomTextColor(match)
              }
              setShowCustomTextColor(!showCustomTextColor)
            }}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-smooth',
              (showCustomTextColor || isCustomText)
                ? 'border-primary bg-accent/50'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div 
              className="w-6 h-6 rounded-full border border-border"
              style={{ background: getCurrentColor(design.textColor) }}
            />
            <span className="text-sm text-foreground">Власний</span>
          </button>
        </div>

        {/* Custom text color picker */}
        {showCustomTextColor && (
          <ColorPicker
            key={`text-${customTextColor}`}
            value={customTextColor}
            onChange={(color) => {
              setCustomTextColor(color);
              if (color.startsWith('rgba')) {
                onUpdateDesign({ textColor: `text-[${color.replace(/\s/g, '')}]` });
              } else if (/^#[0-9A-Fa-f]{6}$/i.test(color)) {
                onUpdateDesign({ textColor: `text-[${color}]` });
              }
            }}
            className="mt-2"
          />
        )}
      </div>

      {/* Heading Size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Розмір заголовків</label>
        <div className="flex gap-2">
          {headingSizes.map((size) => (
            <Button
              key={size.value}
              onClick={() => onUpdateDesign({ headingSize: size.value })}
              size="black-editor"
              variant={(design.headingSize || 'medium') === size.value ? 'black-editor' : 'outline'}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Розмір тексту</label>
        <div className="flex gap-2">
          {fontSizes.map((size) => (
            <Button
              key={size.value}
              onClick={() => onUpdateDesign({ fontSize: size.value })}
              size="black-editor"
              variant={design.fontSize === size.value ? 'black-editor' : 'outline'}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Accent Color (for product selection) */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Акцентний колір</label>
        <p className="text-xs text-muted-foreground -mt-1">Використовується для індикатора вибору позиції та керування кількістю, а також для інших елементів</p>
        <div className="flex gap-2 flex-wrap">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                setShowCustomAccentColor(false);
                onUpdateDesign({ accentColor: color.value });
              }}
              className={cn(
                'w-9 h-9 rounded-full border-2 transition-smooth',
                color.preview,
                design.accentColor === color.value
                  ? 'border-transparent! ring-3 ring-primary'
                  : 'border-border! hover:border-primary/70!'
              )}
              title={color.label}
            />
          ))}
          {/* Custom accent color button */}
          <button
            onClick={() => setShowCustomAccentColor(!showCustomAccentColor)}
            className={cn(
              'w-9 h-9 rounded-full border-2 transition-smooth overflow-hidden',
              (showCustomAccentColor || (design.accentColor && !accentColors.some(c => c.value === design.accentColor)))
                ? 'border-transparent! border-0! ring-3 ring-primary'
                : 'border-border! hover:border-primary/70!'
            )}
            title="Власний колір"
          >
            <div 
              className="w-full h-full rounded-full"
              style={{ 
                background: design.accentColor && !accentColors.some(c => c.value === design.accentColor)
                  ? design.accentColor
                  : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
              }}
            />
          </button>
        </div>

        {/* Custom accent color picker */}
        {showCustomAccentColor && (
          <ColorPicker
            key={`accent-${customAccentColor}`}
            value={customAccentColor}
            onChange={(color) => {
              setCustomAccentColor(color);
              if (color.startsWith('rgba') || /^#[0-9A-Fa-f]{6}$/i.test(color)) {
                onUpdateDesign({ accentColor: color });
              }
            }}
            className="mt-2"
          />
        )}
      </div>

      {/* Input Fields Settings - Grouped */}
      <div className="space-y-2 p-4 rounded-lg border border-border bg-muted/20">
        <h3 className="text-sm font-semibold text-foreground">Поля введення</h3>
        
        {/* Input Text Color */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Колір тексту</label>
          <div className="flex gap-2 flex-wrap">
            {inputTextColors.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setShowCustomInputTextColor(false);
                  onUpdateDesign({ inputTextColor: color.value });
                }}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-smooth',
                  color.preview,
                  design.inputTextColor === color.value
                    ? 'border-transparent! ring-3 ring-primary'
                    : 'border-border! hover:border-primary/70!'
                )}
                title={color.label}
              />
            ))}
            <button
              onClick={() => setShowCustomInputTextColor(!showCustomInputTextColor)}
              className={cn(
                'w-7 h-7 rounded-full border-2 transition-smooth overflow-hidden',
                (showCustomInputTextColor || (design.inputTextColor && !inputTextColors.some(c => c.value === design.inputTextColor)))
                  ? 'border-transparent! border-0! ring-3 ring-primary'
                  : 'border-border! hover:border-primary/70!'
              )}
              title="Власний колір"
            >
              <div 
                className="w-full h-full rounded-full"
                style={{ 
                  background: design.inputTextColor && !inputTextColors.some(c => c.value === design.inputTextColor)
                    ? design.inputTextColor
                    : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
                }}
              />
            </button>
          </div>
          {showCustomInputTextColor && (
            <ColorPicker
              key={`inputText-${customInputTextColor}`}
              value={customInputTextColor}
              onChange={(color) => {
                setCustomInputTextColor(color);
                if (color.startsWith('rgba') || /^#[0-9A-Fa-f]{6}$/i.test(color)) {
                  onUpdateDesign({ inputTextColor: color });
                }
              }}
              className="mt-2"
            />
          )}
        </div>

        {/* Input Border Color */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Колір рамки</label>
          <div className="flex gap-2 flex-wrap">
            {inputColors.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setShowCustomInputColor(false);
                  onUpdateDesign({ inputColor: color.value });
                }}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-smooth',
                  color.preview,
                  design.inputColor === color.value
                    ? 'border-transparent! ring-3 ring-primary'
                    : 'border-border! hover:border-primary/70!'
                )}
                title={color.label}
              />
            ))}
            <button
              onClick={() => setShowCustomInputColor(!showCustomInputColor)}
              className={cn(
                'w-7 h-7 rounded-full border-2 transition-smooth overflow-hidden',
                (showCustomInputColor || (design.inputColor && !inputColors.some(c => c.value === design.inputColor)))
                  ? 'border-transparent! border-0! ring-3 ring-primary'
                  : 'border-border! hover:border-primary/70!'
              )}
              title="Власний колір"
            >
              <div 
                className="w-full h-full rounded-full"
                style={{ 
                  background: design.inputColor && !inputColors.some(c => c.value === design.inputColor)
                    ? design.inputColor
                    : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
                }}
              />
            </button>
          </div>
          {showCustomInputColor && (
            <ColorPicker
              key={`inputBorder-${customInputColor}`}
              value={customInputColor}
              onChange={(color) => {
                setCustomInputColor(color);
                if (color.startsWith('rgba') || /^#[0-9A-Fa-f]{6}$/i.test(color)) {
                  onUpdateDesign({ inputColor: color });
                }
              }}
              className="mt-2"
            />
          )}
        </div>

        {/* Input Background Color */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Колір фону</label>
          <div className="flex gap-2 flex-wrap">
            {inputBgColors.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setShowCustomInputBgColor(false);
                  onUpdateDesign({ inputBgColor: color.value });
                }}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-smooth',
                  color.preview,
                  (design.inputBgColor || 'transparent') === color.value
                    ? 'border-transparent! ring-3 ring-primary'
                    : 'border-border! hover:border-primary/70!'
                )}
                title={color.label}
              />
            ))}
            <button
              onClick={() => setShowCustomInputBgColor(!showCustomInputBgColor)}
              className={cn(
                'w-7 h-7 rounded-full border-2 transition-smooth overflow-hidden',
                (showCustomInputBgColor || (design.inputBgColor && !inputBgColors.some(c => c.value === design.inputBgColor)))
                  ? 'border-transparent! border-0! ring-3 ring-primary'
                  : 'border-border! hover:border-primary/70!'
              )}
              title="Власний колір"
            >
              <div 
                className="w-full h-full rounded-full"
                style={{ 
                  background: design.inputBgColor && !inputBgColors.some(c => c.value === design.inputBgColor)
                    ? design.inputBgColor
                    : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
                }}
              />
            </button>
          </div>
          {showCustomInputBgColor && (
            <ColorPicker
              key={`inputBg-${customInputBgColor}`}
              value={customInputBgColor}
              onChange={(color) => {
                setCustomInputBgColor(color);
                if (color.startsWith('rgba') || /^#[0-9A-Fa-f]{6}$/i.test(color)) {
                  onUpdateDesign({ inputBgColor: color });
                }
              }}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  )
}
