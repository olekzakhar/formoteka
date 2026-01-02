'use client'

import { useState } from 'react';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';

const backgroundColors = [
  { value: 'bg-white', label: 'Білий', preview: 'bg-white' },
  { value: 'bg-[#F9F8F7]', label: 'Молочний', preview: 'bg-[#F9F8F7]' },
  { value: 'bg-[#DAD6D3]', label: 'Піщаний', preview: 'bg-[#DAD6D3]' },
  { value: 'bg-[#BDC2C2]', label: 'Попелястий', preview: 'bg-[#BDC2C2]' },
  { value: 'bg-[#E7CBCB]', label: 'Пудровий', preview: 'bg-[#E7CBCB]' },
  { value: 'bg-[#4B4913]', label: 'Оливковий', preview: 'bg-[#4B4913]' },
];

const textColors = [
  { value: 'text-foreground', label: 'Default', preview: 'bg-foreground' },
  { value: 'text-slate-900', label: 'Dark', preview: 'bg-slate-900' },
  { value: 'text-slate-700', label: 'Medium', preview: 'bg-slate-700' },
  { value: 'text-primary', label: 'Primary', preview: 'bg-primary' },
];

const fontSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export const DesignTab = ({ design, onUpdateDesign }) => {
  const [showCustomBgColor, setShowCustomBgColor] = useState(false);
  const [customBgColor, setCustomBgColor] = useState('#ffffff');
  const [showCustomTextColor, setShowCustomTextColor] = useState(false);
  const [customTextColor, setCustomTextColor] = useState('#000000');

  // Check if current background is a custom color (excluding predefined ones)
  const predefinedBgColors = backgroundColors.map(c => c.value);
  const predefinedTextColors = textColors.map(c => c.value);
  
  const isCustomBg = design.backgroundColor.startsWith('bg-[#') && 
                     !predefinedBgColors.includes(design.backgroundColor);
  const isCustomText = design.textColor.startsWith('text-[#') && 
                       !predefinedTextColors.includes(design.textColor);

  const handleCustomBgColorChange = (color) => {
    setCustomBgColor(color);
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      onUpdateDesign({ backgroundColor: `bg-[${color}]` });
    }
  };

  const handleCustomTextColorChange = (color) => {
    setCustomTextColor(color);
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      onUpdateDesign({ textColor: `text-[${color}]` });
    }
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Background Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Background Color</label>
        <div className="grid grid-cols-3 gap-2">
          {backgroundColors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                setShowCustomBgColor(false);
                onUpdateDesign({ backgroundColor: color.value });
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
            onClick={() => setShowCustomBgColor(!showCustomBgColor)}
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
                  ? design.backgroundColor.match(/bg-\[(#[0-9A-Fa-f]+)\]/)?.[1] || 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)'
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

      {/* Text Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Text Color</label>
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
            onClick={() => setShowCustomTextColor(!showCustomTextColor)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-smooth col-span-2',
              (showCustomTextColor || isCustomText)
                ? 'border-primary bg-accent/50'
                : 'border-border hover:border-primary/50'
            )}
          >
            <div 
              className="w-6 h-6 rounded-full border border-border"
              style={{ 
                background: isCustomText 
                  ? design.textColor.match(/text-\[(#[0-9A-Fa-f]+)\]/)?.[1] || 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
                  : 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
              }}
            />
            <span className="text-sm text-foreground">Custom Color</span>
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

      {/* Font Size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Font Size</label>
        <div className="flex gap-2">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => onUpdateDesign({ fontSize: size.value })}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-smooth',
                design.fontSize === size.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:border-primary/50'
              )}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Disabled Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-foreground">Disable Form</label>
            <p className="text-xs text-muted-foreground mt-0.5">
              When enabled, form submissions are disabled
            </p>
          </div>
          <button
            onClick={() => onUpdateDesign({ formDisabled: !design.formDisabled })}
            className={cn(
              'relative w-11 h-6 rounded-full transition-smooth',
              design.formDisabled ? 'bg-primary' : 'bg-muted'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow-soft transition-smooth',
                design.formDisabled && 'translate-x-5'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
