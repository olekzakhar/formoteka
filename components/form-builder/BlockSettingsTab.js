import { blockDefinitions } from '@/data/block-definitions';
import { BlockIcon } from './BlockIcon';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      {/* Block type indicator */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shadow-soft">
          <BlockIcon icon={definition?.icon || 'Type'} className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{definition?.label}</p>
          <p className="text-xs text-muted-foreground">Block type</p>
        </div>
      </div>

      {/* Label field */}
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

      {/* Placeholder field */}
      {block.placeholder !== undefined && (
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
      {!['heading', 'paragraph'].includes(block.type) && (
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
