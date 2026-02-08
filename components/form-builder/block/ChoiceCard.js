// components/form-builder/block/ChoiceCard

import { cn } from '@/utils';
import { Check, Image as ImageIcon, X } from 'lucide-react';

export const BlockChoiceCard = ({
  block,
  onUpdateBlock,
  isEditable = false,
  inputColor,
  accentColor,
  isPreview = false,
  selectedValues = [],
  onSelect,
}) => {
  const options = block.options || [];
  const optionImages = block.optionImages || [];
  const gap = block.choiceGap ?? 12;
  const columns = block.choiceColumns || 2;
  const isCheckbox = block.type === 'checkbox';

  // Check if any option has an image - this enables card mode
  const hasAnyImage = optionImages.some((img) => img && img.length > 0);

  const handleImageUpload = (index) => {
    if (!onUpdateBlock) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const newImages = [...optionImages];
          newImages[index] = reader.result;
          onUpdateBlock({ optionImages: newImages });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeImage = (index) => {
    if (!onUpdateBlock) return;
    const newImages = [...optionImages];
    newImages[index] = '';
    onUpdateBlock({ optionImages: newImages });
  };

  // Card style rendering (when any image exists)
  if (hasAnyImage) {
    const gridClass = columns === 1 ? 'grid-cols-1' : 
                      columns === 2 ? 'grid-cols-2' : 
                      columns === 3 ? 'grid-cols-3' : 'grid-cols-4';
    
    return (
      <div
        className={cn('grid', gridClass)}
        style={{ gap: `${gap}px` }}
      >
        {options.map((opt, i) => {
          const hasImage = optionImages[i] && optionImages[i].length > 0;
          const isSelected = selectedValues.includes(opt);
          const accent = accentColor || 'hsl(var(--primary))';

          return (
            <div
              key={i}
              className={cn(
                'relative rounded-xl border-2 overflow-hidden transition-all cursor-pointer',
                isSelected
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )}
              style={isSelected ? { borderColor: accent } : undefined}
              onClick={() => {
                if (isPreview && onSelect) {
                  onSelect(opt);
                }
              }}
            >
              {/* Image area */}
              <div
                className={cn(
                  'relative aspect-[4/3] bg-muted/30',
                  !hasImage && 'flex items-center justify-center'
                )}
              >
                {hasImage ? (
                  <>
                    <img
                      src={optionImages[i]}
                      alt={opt}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    {isEditable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(i);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-destructive transition-all opacity-0 group-hover:opacity-100"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {/* Placeholder for image */}
                    {hasAnyImage && (
                      <div className="w-full h-full flex items-center justify-center bg-muted/40">
                        {isEditable ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageUpload(i);
                            }}
                            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-xs">Add image</span>
                          </button>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                        )}
                      </div>
                    )}
                    {!hasAnyImage && isEditable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageUpload(i);
                        }}
                        className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-xs">Add image</span>
                      </button>
                    )}
                  </>
                )}

                {/* Selection indicator */}
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accent }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Label area */}
              <div className="p-3 bg-background">
                <div className="flex items-center gap-2">
                  {/* Custom control */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all',
                      isCheckbox ? 'rounded-md' : 'rounded-full'
                    )}
                    style={{
                      borderColor: isSelected ? accent : inputColor || 'hsl(var(--border))',
                      backgroundColor: isSelected ? accent : 'transparent',
                    }}
                  >
                    {isSelected && (
                      isCheckbox ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: 'white' }}
                        />
                      )
                    )}
                  </div>
                  <span className="text-sm font-medium">{opt}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Simple style (no images)
  // Use max-content grid columns so items don't stretch to full width.
  const simpleGridTemplateColumns = `repeat(${columns}, minmax(0, max-content))`;

  return (
    <div
      className="grid justify-start"
      style={{
        gridTemplateColumns: simpleGridTemplateColumns,
        columnGap: `${gap}px`,
        rowGap: `${gap}px`,
      }}
    >
      {options.map((opt, i) => {
        const isSelected = selectedValues.includes(opt);
        const accent = accentColor || 'hsl(var(--primary))';

        return (
          <label
            key={i}
            className="inline-flex items-center gap-3 cursor-pointer group select-none w-fit"
            onClick={() => {
              if (isPreview && onSelect) {
                onSelect(opt);
              }
            }}
          >
            {/* Custom control - same size as card mode */}
            <div
              className={cn(
                'flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-all',
                isCheckbox ? 'rounded-md' : 'rounded-full',
                !isSelected && 'group-hover:border-primary/50'
              )}
              style={{
                borderColor: isSelected ? accent : inputColor || 'hsl(var(--border))',
                backgroundColor: isSelected ? accent : 'transparent',
              }}
            >
              {isSelected && (
                isCheckbox ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: 'white' }}
                  />
                )
              )}
            </div>
            <span className="text-sm text-foreground">{opt}</span>
          </label>
        );
      })}
    </div>
  )
}
