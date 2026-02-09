// components/form-builder/ColorPicker

'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/utils'

// Convert hex to rgba
const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
};

// Parse color string and extract hex + alpha
const parseColor = (color) => {
  if (color === 'transparent') {
    return { hex: '#ffffff', alpha: 0 };
  }

  // Check for rgba format
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0');
    const alpha = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
    return { hex: `#${r}${g}${b}`, alpha };
  }

  // Check for hex format
  const hexMatch = color.match(/^#?([a-f\d]{6})$/i);
  if (hexMatch) {
    return { hex: `#${hexMatch[1]}`, alpha: 1 };
  }

  // Check for 8-digit hex with alpha
  const hex8Match = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hex8Match) {
    const alpha = parseInt(hex8Match[4], 16) / 255;
    return { hex: `#${hex8Match[1]}${hex8Match[2]}${hex8Match[3]}`, alpha };
  }

  return { hex: '#000000', alpha: 1 };
};

// Format output based on alpha
const formatColor = (hex, alpha) => {
  // Minimum alpha is 1% to avoid losing the color
  const clampedAlpha = Math.max(0.01, alpha);
  if (clampedAlpha >= 1) {
    return hex.toUpperCase();
  }
  return hexToRgba(hex, clampedAlpha);
};

export const ColorPicker = ({
  value,
  onChange,
  className,
}) => {
  const parsed = parseColor(value);
  const [hex, setHex] = useState(parsed.hex);
  const [alpha, setAlpha] = useState(parsed.alpha);
  const [hexInput, setHexInput] = useState(parsed.hex.toUpperCase());
  const [prevValue, setPrevValue] = useState(value);

  // Update local state when value prop changes (derived state pattern)
  // This happens during render, not in useEffect, avoiding cascading renders
  if (prevValue !== value) {
    const parsed = parseColor(value);
    setHex(parsed.hex);
    setAlpha(parsed.alpha);
    setHexInput(parsed.hex.toUpperCase());
    setPrevValue(value);
  }

  const handleHexChange = (newHex) => {
    setHexInput(newHex);
    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
      setHex(newHex);
      onChange(formatColor(newHex, alpha));
    }
  };

  const handleColorPickerChange = (e) => {
    const newHex = e.target.value;
    setHex(newHex);
    setHexInput(newHex.toUpperCase());
    onChange(formatColor(newHex, alpha));
  };

  const handleAlphaChange = (values) => {
    // Minimum 1% to keep color visible and avoid reset
    const newAlpha = Math.max(0.01, values[0] / 100);
    setAlpha(newAlpha);
    onChange(formatColor(hex, newAlpha));
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        {/* Color picker input */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <input
            type="color"
            value={hex}
            onChange={handleColorPickerChange}
            className="w-full h-full rounded-md border border-border cursor-pointer"
          />
          {/* Overlay to show transparency */}
          {alpha < 1 && (
            <div
              className="absolute inset-0 rounded-md pointer-events-none"
              style={{
                background: `linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
                             linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)`,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 4px 4px',
              }}
            />
          )}
        </div>

        {/* Hex input */}
        <Input
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
          placeholder="#FFFFFF"
          className="flex-1 uppercase"
          maxLength={7}
        />
      </div>

      {/* Opacity slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Прозорість</span>
          <span>{Math.round(alpha * 100)}%</span>
        </div>
        <Slider
          className="cursor-pointer"
          value={[alpha * 100]}
          onValueChange={handleAlphaChange}
          max={100}
          min={1}
          step={1}
        />
      </div>
    </div>
  )
}
