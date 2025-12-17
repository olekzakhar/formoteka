import { BlockItem } from './BlockItem';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const FormCanvas = ({
  blocks,
  activeBlockId,
  onSelectBlock,
  onClearSelection,
  onDeleteBlock,
  onDuplicateBlock,
  onOpenSettings,
  onOpenAddBlock,
  onAddBlockAt,
  onUpdateBlock,
}) => {
  const [dropIndex, setDropIndex] = useState(null);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDropIndex(index);
  };

  const handleDragLeave = () => {
    setDropIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('blockType');
    if (blockType) {
      onAddBlockAt(blockType, index);
    }
    setDropIndex(null);
  };

  return (
    <div
      className="flex-1 h-full bg-canvas overflow-y-auto"
      onClick={onClearSelection}
    >
      <div className="max-w-2xl mx-auto py-12 px-8">
        {/* Form header */}
        <div className="pl-14 mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Untitled Form</h1>
          <p className="text-muted-foreground">Add blocks to build your form</p>
        </div>

        {/* Blocks */}
        <div className="space-y-4 pl-14">
          {blocks.length === 0 ? (
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-12 text-center transition-smooth',
                dropIndex === 0
                  ? 'border-primary bg-accent/50'
                  : 'border-border hover:border-muted-foreground/50'
              )}
              onDragOver={(e) => handleDragOver(e, 0)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 0)}
            >
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">Ваша форма порожня</p>
              <p className="text-sm text-muted-foreground">
                Натисніть на будь-який блок у панелі справа або перетягніть його сюди, щоб почати
              </p>
            </div>
          ) : (
            <>
              {/* Drop zone before first block */}
              <div
                className={cn(
                  'h-2 -my-1 rounded-full transition-smooth',
                  dropIndex === 0 && 'h-16 bg-accent border-2 border-dashed border-primary my-2'
                )}
                onDragOver={(e) => handleDragOver(e, 0)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 0)}
              />

              {blocks.map((block, index) => (
                <div key={block.id}>
                  <BlockItem
                    block={block}
                    isActive={activeBlockId === block.id}
                    onSelect={() => onSelectBlock(block.id)}
                    onDelete={() => onDeleteBlock(block.id)}
                    onDuplicate={() => onDuplicateBlock(block.id)}
                    onOpenSettings={() => onOpenSettings(block.id)}
                    onAddBlock={onOpenAddBlock}
                    onUpdateBlock={(updates) => onUpdateBlock(block.id, updates)}
                  />
                  {/* Drop zone after each block */}
                  <div
                    className={cn(
                      'h-2 -my-1 rounded-full transition-smooth',
                      dropIndex === index + 1 &&
                        'h-16 bg-accent border-2 border-dashed border-primary my-2'
                    )}
                    onDragOver={(e) => handleDragOver(e, index + 1)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index + 1)}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
