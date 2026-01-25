// components/form-builder/tabs/Design

'use client'

import { useState } from 'react';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Background colors with associated text colors
const backgroundColors = [
  { value: 'bg-white', label: 'Білий', preview: 'bg-white', textColor: 'text-foreground' },
  { value: 'bg-[#F9F8F7]', label: 'Молочний', preview: 'bg-[#F9F8F7]', textColor: 'text-slate-900' },
  { value: 'bg-[#DAD6D3]', label: 'Піщаний', preview: 'bg-[#DAD6D3]', textColor: 'text-slate-900' },
  { value: 'bg-[#BDC2C2]', label: 'Попелястий', preview: 'bg-[#BDC2C2]', textColor: 'text-slate-900' },
  { value: 'bg-[#E7CBCB]', label: 'Пудровий', preview: 'bg-[#E7CBCB]', textColor: 'text-foreground' },
  { value: 'bg-[#4B4913]', label: 'Оливковий', preview: 'bg-[#4B4913]', textColor: 'text-slate-900' },
  // Dark backgrounds
  // { value: 'bg-slate-800', preview: 'bg-slate-800', textColor: 'text-slate-100' },
  // { value: 'bg-slate-900', preview: 'bg-slate-900', textColor: 'text-slate-100' },
  // { value: 'bg-black', preview: 'bg-black', textColor: 'text-white' },
]

const headingColors = [
  { value: 'text-foreground', label: 'Default', preview: 'bg-foreground' },
  { value: 'text-slate-900', label: 'Dark', preview: 'bg-slate-900' },
  { value: 'text-primary', label: 'Medium', preview: 'bg-primary' },
  { value: 'text-slate-600', label: 'Primary', preview: 'bg-slate-600' },
]

const textColors = [
  { value: 'text-foreground', label: 'Default', preview: 'bg-foreground' },
  { value: 'text-slate-900', label: 'Dark', preview: 'bg-slate-900' },
  { value: 'text-[#666666]', label: 'Medium', preview: 'bg-[#666666]' },
  { value: 'text-primary', label: 'Primary', preview: 'bg-primary' },
]

const headingSizes = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
  { value: 'xlarge', label: 'XL' },
]

const textSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]



export const TabsDesign = ({ design, onUpdateDesign }) => {
  // Extract current custom colors from design
  const getCurrentBgColor = () => {
    const match = design.backgroundColor?.match(/bg-\[(#[0-9A-Fa-f]{6})\]/i)
    return match ? match[1] : '#ffffff'
  }
  
  const getCurrentTextColor = () => {
    const match = design.textColor?.match(/text-\[(#[0-9A-Fa-f]{6})\]/i)
    return match ? match[1] : '#000000'
  }
  
  const getCurrentHeadingColor = () => {
    const match = design.headingColor?.match(/text-\[(#[0-9A-Fa-f]{6})\]/i)
    return match ? match[1] : '#000000'
  }

  const [showCustomBgColor, setShowCustomBgColor] = useState(false)
  const [customBgColor, setCustomBgColor] = useState(getCurrentBgColor())
  const [showCustomTextColor, setShowCustomTextColor] = useState(false)
  const [customTextColor, setCustomTextColor] = useState(getCurrentTextColor())
  const [showCustomHeadingColor, setShowCustomHeadingColor] = useState(false)
  const [customHeadingColor, setCustomHeadingColor] = useState(getCurrentHeadingColor())

  // Check if current colors are custom (not in predefined arrays)
  const isCustomBg = !backgroundColors.some(c => c.value === design.backgroundColor);
  const isCustomText = !textColors.some(c => c.value === design.textColor);
  const isCustomHeading = !headingColors.some(c => c.value === (design.headingColor || 'text-foreground'));

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
              setShowCustomBgColor(!showCustomBgColor);
              // Update state with current color when opening picker
              if (!showCustomBgColor) {
                setCustomBgColor(getCurrentBgColor());
              }
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
              style={{ 
                background: isCustomBg 
                  ? getCurrentBgColor()
                  : 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)'
              }}
            />
            <span className="text-xs text-muted-foreground">Custom</span>
          </button>
        </div>
        
        {/* Custom background color picker */}
        {showCustomBgColor && (
          <div className="flex gap-2 items-center mt-2">
            <input
              type="color"
              value={customBgColor}
              onChange={(e) => handleCustomBgColorChange(e.target.value)}
              className="w-10 h-10 rounded-md border border-border cursor-pointer"
            />
            <Input
              value={customBgColor}
              onChange={(e) => handleCustomBgColorChange(e.target.value)}
              placeholder="#FFFFFF"
              className="flex-1 uppercase"
              maxLength={7}
            />
          </div>
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
              setShowCustomHeadingColor(!showCustomHeadingColor);
              // Update state with current color when opening picker
              if (!showCustomHeadingColor) {
                setCustomHeadingColor(getCurrentHeadingColor());
              }
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
              style={{
                background: isCustomHeading
                  ? getCurrentHeadingColor()
                  : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
              }}
            />
            <span className="text-sm text-foreground">Custom</span>
          </button>
        </div>

        {/* Custom heading color picker */}
        {showCustomHeadingColor && (
          <div className="flex gap-2 items-center mt-2">
            <input
              type="color"
              value={customHeadingColor}
              onChange={(e) => handleCustomHeadingColorChange(e.target.value)}
              className="w-10 h-10 rounded-md border border-border cursor-pointer"
            />
            <Input
              value={customHeadingColor}
              onChange={(e) => handleCustomHeadingColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 uppercase"
              maxLength={7}
            />
          </div>
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
              setShowCustomTextColor(!showCustomTextColor);
              // Update state with current color when opening picker
              if (!showCustomTextColor) {
                setCustomTextColor(getCurrentTextColor());
              }
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
              style={{ 
                background: isCustomText 
                  ? getCurrentTextColor()
                  : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
              }}
            />
            <span className="text-sm text-foreground">Custom</span>
          </button>
        </div>

        {/* Custom text color picker */}
        {showCustomTextColor && (
          <div className="flex gap-2 items-center mt-2">
            <input
              type="color"
              value={customTextColor}
              onChange={(e) => handleCustomTextColorChange(e.target.value)}
              className="w-10 h-10 rounded-md border border-border cursor-pointer"
            />
            <Input
              value={customTextColor}
              onChange={(e) => handleCustomTextColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 uppercase"
              maxLength={7}
            />
          </div>
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

      {/* Text Size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Розмір тексту</label>
        <div className="flex gap-2">
          {textSizes.map((size) => (
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
    </div>
  )
}
