import { cn } from '@/lib/utils';

const backgroundColors = [
  { value: 'bg-background', label: 'Default', preview: 'bg-background' },
  { value: 'bg-white', label: 'White', preview: 'bg-white' },
  { value: 'bg-slate-50', label: 'Light Gray', preview: 'bg-slate-50' },
  { value: 'bg-slate-100', label: 'Gray', preview: 'bg-slate-100' },
  { value: 'bg-primary/5', label: 'Primary Tint', preview: 'bg-primary/20' },
  { value: 'bg-blue-50', label: 'Blue Tint', preview: 'bg-blue-100' },
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
  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Background Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Background Color</label>
        <div className="grid grid-cols-3 gap-2">
          {backgroundColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdateDesign({ backgroundColor: color.value })}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-lg border transition-smooth',
                design.backgroundColor === color.value
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn('w-8 h-8 rounded-md border border-border', color.preview)} />
              <span className="text-xs text-muted-foreground">{color.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Text Color</label>
        <div className="grid grid-cols-2 gap-2">
          {textColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdateDesign({ textColor: color.value })}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-smooth',
                design.textColor === color.value
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className={cn('w-6 h-6 rounded-full', color.preview)} />
              <span className="text-sm text-foreground">{color.label}</span>
            </button>
          ))}
        </div>
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
    </div>
  );
};
