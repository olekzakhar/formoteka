import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const SubmitButtonSettings = ({ buttonText, onButtonTextChange }) => {
  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Preview */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground mb-3">Preview</p>
        <button
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium',
            'bg-primary text-primary-foreground'
          )}
        >
          {buttonText}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Button text */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Button Text</label>
        <input
          type="text"
          value={buttonText}
          onChange={(e) => onButtonTextChange(e.target.value)}
          className={cn(
            'w-full px-3 py-2 rounded-md border border-input bg-background text-foreground',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'transition-smooth'
          )}
        />
      </div>

      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          This submit button is always visible at the end of your form and cannot be removed or moved.
        </p>
      </div>
    </div>
  );
};
