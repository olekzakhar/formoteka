// components/form-builder/tabs/Design

'use client'

import { useState } from 'react';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/form-builder/ColorPicker'

// Background colors with associated text colors
const backgroundColors = [
  { label: 'Білий', value: '#ffffff', preview: '#ffffff', textColor: '#131720' }, //text-foreground
  { label: 'Молочний', value: '#F9F8F7', preview: '#F9F8F7', textColor: '#0f172a' }, // text-slate-900
  { label: 'Піщаний', value: '#DAD6D3', preview: '#DAD6D3', textColor: '#0f172a' }, // text-slate-900
  { label: 'Попелястий', value: '#BDC2C2', preview: '#BDC2C2', textColor: '#0f172a' }, // text-slate-900
  { label: 'Пудровий', value: '#E7CBCB', preview: '#E7CBCB', textColor: '#131720' }, //text-foreground
  { label: 'Оливковий', value: '#4B4913', preview: '#4B4913', textColor: '#0f172a' }, // text-slate-900
  // Dark backgrounds
  // { value: 'bg-slate-800', preview: 'bg-slate-800', textColor: 'text-slate-100' },
  // { value: 'bg-slate-900', preview: 'bg-slate-900', textColor: 'text-slate-100' },
  // { value: 'bg-black', preview: 'bg-black', textColor: 'text-white' },
]

const headingColors = [
  { label: 'Default', value: '#131720', preview: '#131720' }, // text-foreground bg-foreground
  { label: 'Dark', value: '#0f172a', preview: '#0f172a' }, // text-slate-900 bg-slate-900
  { label: 'Primary', value: '#475569', preview: '#475569' }, // text-slate-600 bg-slate-600
]

const textColors = [
  { label: 'Default', value: '#131720', preview: '#131720' }, // text-foreground bg-foreground
  { label: 'Dark', value: '#0f172a', preview: '#0f172a' }, // text-slate-900 bg-slate-900
  { label: 'Medium', value: '#666666', preview: '#666666' },
]

const headingSizes = [
  { value: '16px', label: 'S' },
  { value: '20px', label: 'M' },
  { value: '28px', label: 'L' },
  { value: '32px', label: 'XL' },
]

const fontSizes = [
  { value: '14px', label: 'Small' },
  { value: '16px', label: 'Medium' },
  { value: '20px', label: 'Large' },
]

// Predefined accent colors
const accentColors = [
  { label: 'Чорний', value: '#000000', preview: '#000000' },
  { label: 'Білий', value: '#ffffff', preview: '#ffffff' },
  { label: 'Синій', value: '#3b82f6', preview: '#3b82f6' }, // bg-blue-500
  { label: 'Зелений', value: '#22c55e', preview: '#22c55e' }, // bg-green-500
  { label: 'Жовтий', value: '#eab308', preview: '#eab308' }, // bg-yellow-500
  { label: 'Червоний', value: '#ef4444', preview: '#ef4444' }, // bg-red-500
]

// Predefined input background colors
const inputBgColors = [
  { label: 'Прозорий', value: 'transparent', preview: 'transparent' },
  { label: 'Білий', value: '#ffffff', preview: '#ffffff' },
  { label: 'Світло-сірий', value: '#f9fafb', preview: '#f9fafb' }, // bg-gray-50
  { label: 'Сірий', value: '#f3f4f6', preview: '#f3f4f6' }, // bg-gray-100
  { label: 'Темно-сірий', value: '#1f2937', preview: '#1f2937' }, // bg-gray-800
  { label: 'Чорний', value: '#000000', preview: '#000000' },
]

// Predefined input colors
const inputColors = [
  { label: 'Світло-сірий', value: '#e5e7eb', preview: '#e5e7eb' }, // bg-gray-200
  { label: 'Сірий', value: '#d1d5db', preview: '#d1d5db' }, // bg-gray-300
  { label: 'Темно-сірий', value: '#9ca3af', preview: '#9ca3af' }, // bg-gray-400
  { label: 'Чорний', value: '#000000', preview: '#000000' },
  { label: 'Білий', value: '#ffffff', preview: '#ffffff' },
  { label: 'Синій', value: '#3b82f6', preview: '#3b82f6' }, // bg-blue-500
]

// Predefined input text colors
const inputTextColors = [
  { label: 'Чорний', value: '#000000', preview: '#000000' },
  { label: 'Темно-сірий', value: '#1f2937', preview: '#1f2937' }, // bg-gray-800
  { label: 'Сірий', value: '#374151', preview: '#374151' }, // bg-gray-700
  { label: 'Білий', value: '#ffffff', preview: '#ffffff' },
  { label: 'Світло-сірий', value: '#f9fafb', preview: '#f9fafb' }, // bg-gray-50
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
  const isCustomBg = design.backgroundColor.startsWith('#') || design.backgroundColor.startsWith('rgb');
  const isCustomText = design.textColor.startsWith('#') || design.textColor.startsWith('rgb');
  const isCustomHeading = design.headingColor?.startsWith('#') || design.headingColor?.startsWith('rgb');

  // Extract current custom colors from design
  const customGradient = 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'

  // Helper to determine if a color is light or dark (for custom colors)
  const isLightColor = (color) => {
    let r, g, b
    
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const rgb = parseInt(hex, 16)
      r = (rgb >> 16) & 0xff
      g = (rgb >> 8) & 0xff
      b = (rgb >> 0) & 0xff
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g)
      if (match) {
        [r, g, b] = match.map(Number)
      }
    }
    
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma > 128;
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
              <div
                className="w-8 h-8 rounded-md border border-border"
                style={{ backgroundColor: color.preview }}
              />
              <span className="text-xs text-muted-foreground">{color.label}</span>
            </button>
          ))}
          {/* Custom color button */}
          <button
            onClick={() => {
              // Підставляємо поточний колір при відкритті
              if (!showCustomBgColor && isCustomBg) {
                const match = design?.backgroundColor
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
              style={{ background: design?.backgroundColor || customGradient }}
            />
            <span className="text-xs text-muted-foreground">Власний</span>
          </button>
        </div>
        
        {/* Custom background color picker */}
        {showCustomBgColor && (
          <ColorPicker
            value={customBgColor}
            onChange={(color) => {
              setCustomBgColor(color)
              // Визначаємо колір тексту на основі яскравості фону
              const textColorValue = isLightColor(color) ? '#0f172a' : '#f1f5f9'
              
              onUpdateDesign({
                backgroundColor: color,
                textColor: isCustomText ? design.textColor : textColorValue,
                headingColor: isCustomHeading ? design.headingColor : textColorValue
              })
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
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color.preview }}
              />
              <span className="text-sm text-foreground">{color.label}</span>
            </button>
          ))}
          {/* Custom heading color button */}
          <button
            onClick={() => {
              if (!showCustomHeadingColor && isCustomHeading) {
                const match = design?.headingColor
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
              style={{ background: design?.headingColor || customGradient }}
            />
            <span className="text-sm text-foreground">Власний</span>
          </button>
        </div>

        {/* Custom heading color picker */}
        {showCustomHeadingColor && (
          <ColorPicker
            value={customHeadingColor}
            onChange={(color) => {
              setCustomHeadingColor(color)
              onUpdateDesign({ headingColor: color })
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
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color.preview }}
              />
              <span className="text-sm text-foreground">{color.label}</span>
            </button>
          ))}
          {/* Custom text color button */}
          <button
            onClick={() => {
              if (!showCustomTextColor && isCustomText) {
                const match = design?.textColor
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
              style={{ background: design?.textColor || customGradient }}
            />
            <span className="text-sm text-foreground">Власний</span>
          </button>
        </div>

        {/* Custom text color picker */}
        {showCustomTextColor && (
          <ColorPicker
            value={customTextColor}
            onChange={(color) => {
              setCustomTextColor(color)
              onUpdateDesign({ textColor: color })
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
                design.accentColor === color.value
                  ? 'border-transparent! ring-3 ring-primary'
                  : 'border-border! hover:border-primary/70!'
              )}
              style={{ backgroundColor: color.preview }}
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
                  design.inputTextColor === color.value
                    ? 'border-transparent! ring-3 ring-primary'
                    : 'border-border! hover:border-primary/70!'
                )}
                style={{ backgroundColor: color.preview }}
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
                    : customGradient
                }}
              />
            </button>
          </div>
          {showCustomInputTextColor && (
            <ColorPicker
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
                  design.inputColor === color.value
                    ? 'border-transparent! ring-3 ring-primary'
                    : 'border-border! hover:border-primary/70!'
                )}
                style={{ backgroundColor: color.preview }}
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
                    : customGradient
                }}
              />
            </button>
          </div>
          {showCustomInputColor && (
            <ColorPicker
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
                  (design.inputBgColor || 'transparent') === color.value
                    ? 'border-transparent! ring-3 ring-primary'
                    : 'border-border! hover:border-primary/70!'
                )}
                style={{ backgroundColor: color.preview }}
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
                    : customGradient
                }}
              />
            </button>
          </div>
          {showCustomInputBgColor && (
            <ColorPicker
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
