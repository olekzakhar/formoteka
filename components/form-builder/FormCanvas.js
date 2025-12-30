// form-builder/FormCanvas

import { BlockItem } from './BlockItem';
import { Plus, ArrowRight, CheckCircle, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button'

const fontSizeClass = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

const DropZone = ({
  active,
  isDragging,
  label = 'Drop here',
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  // Invisible by default; while dragging, create real spacing between blocks.
  const heightClass = isDragging ? (active ? 'h-24' : 'h-12') : 'h-0';

  return (
    <div
      className={cn(
        'w-[calc(100%+3rem)] -ml-12 transition-[height] duration-150 ease-out overflow-hidden',
        heightClass,
        isDragging || active ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      onDragEnter={onDragOver}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div
        className={cn(
          'h-full rounded-lg flex items-center justify-center transition-smooth',
          active
            ? 'bg-accent border-2 border-dashed border-primary'
            : isDragging
              ? 'bg-muted/20 border border-dashed border-border'
              : 'border border-transparent'
        )}
      >
        {active && <span className="text-xs text-primary font-medium">{label}</span>}
      </div>
    </div>
  );
};

export const FormCanvas = ({
  blocks,
  activeBlockId,
  formDesign,
  submitButtonText,
  successBlocks,
  activeSuccessBlockId,
  onSelectBlock,
  onClearSelection,
  onDeleteBlock,
  onDuplicateBlock,
  onOpenSettings,
  onOpenAddBlock,
  onAddBlockAt,
  onUpdateBlock,
  onMoveBlock,
  onSubmitButtonClick,
  isSubmitButtonSelected,
  onSelectSuccessBlock,
  onDeleteSuccessBlock,
  onDuplicateSuccessBlock,
  onOpenSuccessSettings,
  onAddSuccessBlockAt,
  onUpdateSuccessBlock,
  onMoveSuccessBlock,
  onOpenAddSuccessBlock,
}) => {
  const [dropIndex, setDropIndex] = useState(null);
  const [successDropIndex, setSuccessDropIndex] = useState(null);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState(null);
  const [draggedSuccessBlockIndex, setDraggedSuccessBlockIndex] = useState(null);
  const [isExternalDragging, setIsExternalDragging] = useState(false);
  const dragGhostRef = useRef(null);

  useEffect(() => {
    // Keep a persistent, tiny drag ghost element in the DOM.
    const ghost = document.createElement('div');
    ghost.style.position = 'absolute';
    ghost.style.top = '-9999px';
    ghost.style.left = '-9999px';
    ghost.style.padding = '8px 10px';
    ghost.style.borderRadius = '10px';
    ghost.style.border = '1px solid hsl(var(--border))';
    ghost.style.background = 'hsl(var(--card))';
    ghost.style.color = 'hsl(var(--foreground))';
    ghost.style.fontSize = '12px';
    ghost.style.fontWeight = '600';
    ghost.style.whiteSpace = 'nowrap';
    document.body.appendChild(ghost);
    dragGhostRef.current = ghost;

    const reset = () => {
      setIsExternalDragging(false);
      setDropIndex(null);
      setSuccessDropIndex(null);
    };

    window.addEventListener('dragend', reset);
    window.addEventListener('drop', reset);

    return () => {
      window.removeEventListener('dragend', reset);
      window.removeEventListener('drop', reset);
      dragGhostRef.current = null;
      ghost.remove();
    };
  }, []);

  const getDraggedBlockType = (e) => {
    return (e.dataTransfer.getData('blockType') || e.dataTransfer.getData('text/plain'));
  };

  const getDraggedBlockIndex = (e) => {
    const idx = e.dataTransfer.getData('blockIndex');
    return idx ? parseInt(idx, 10) : null;
  };

  const getDraggedSuccessBlockIndex = (e) => {
    const idx = e.dataTransfer.getData('successBlockIndex');
    return idx ? parseInt(idx, 10) : null;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    const fromIndex = getDraggedBlockIndex(e);
    if (fromIndex === null) {
      // Fallbacks for different browsers
      const blockType = getDraggedBlockType(e);
      const types = Array.from(e.dataTransfer.types || []);
      const maybeExternal = Boolean(blockType) || types.includes('blockType') || types.includes('text/plain');
      if (maybeExternal) setIsExternalDragging(true);
    }

    e.dataTransfer.dropEffect = draggedBlockIndex !== null ? 'move' : 'copy';
    setDropIndex(index);
    setSuccessDropIndex(null);
  };

  const handleDragLeave = () => {
    // Intentionally no-op: clearing on dragleave causes flicker when hovering child elements.
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if reordering existing block
    const fromIndex = getDraggedBlockIndex(e);
    if (fromIndex !== null) {
      const toIndex = fromIndex < index ? index - 1 : index;
      if (fromIndex !== toIndex) {
        onMoveBlock(fromIndex, toIndex);
      }
      setDraggedBlockIndex(null);
    } else {
      const blockType = getDraggedBlockType(e);
      if (blockType) {
        onAddBlockAt(blockType, index);
      }
    }

    // Reset all drag state
    setDropIndex(null);
    setSuccessDropIndex(null);
    setIsExternalDragging(false);
  };

  const setSmallDragGhost = (e, label) => {
    const ghost = dragGhostRef.current;
    if (!ghost) return;

    ghost.textContent = label;
    e.dataTransfer.setDragImage(ghost, 12, 12);
  };

  const handleBlockDragStart = (e, index) => {
    // Firefox requires at least one data item to be set.
    e.dataTransfer.setData('blockIndex', index.toString());
    e.dataTransfer.setData('text/plain', blocks[index]?.label ?? 'Moving block');
    e.dataTransfer.effectAllowed = 'move';

    setSmallDragGhost(e, blocks[index]?.label ?? 'Moving block');

    setIsExternalDragging(false);
    setDraggedBlockIndex(index);
  };

  const handleBlockDragEnd = () => {
    setDraggedBlockIndex(null);
    setDropIndex(null);
    setIsExternalDragging(false);
  };

  // Success page drag handlers
  const handleSuccessDragOver = (e, index) => {
    e.preventDefault();

    const fromIndex = getDraggedSuccessBlockIndex(e);
    if (fromIndex === null) {
      const blockType = getDraggedBlockType(e);
      const types = Array.from(e.dataTransfer.types || []);
      const maybeExternal = Boolean(blockType) || types.includes('blockType') || types.includes('text/plain');
      if (maybeExternal) setIsExternalDragging(true);
    }

    e.dataTransfer.dropEffect = draggedSuccessBlockIndex !== null ? 'move' : 'copy';
    setSuccessDropIndex(index);
    setDropIndex(null);
  };

  const handleSuccessDragLeave = () => {
    // Intentionally no-op to avoid flicker.
  };

  const handleSuccessDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const fromIndex = getDraggedSuccessBlockIndex(e);
    if (fromIndex !== null) {
      const toIndex = fromIndex < index ? index - 1 : index;
      if (fromIndex !== toIndex) {
        onMoveSuccessBlock(fromIndex, toIndex);
      }
      setDraggedSuccessBlockIndex(null);
    } else {
      const blockType = getDraggedBlockType(e);
      if (blockType) {
        onAddSuccessBlockAt(blockType, index);
      }
    }

    // Reset all drag state
    setDropIndex(null);
    setSuccessDropIndex(null);
    setIsExternalDragging(false);
  };

  const handleSuccessBlockDragStart = (e, index) => {
    e.dataTransfer.setData('successBlockIndex', index.toString());
    e.dataTransfer.setData('text/plain', successBlocks[index]?.label ?? 'Moving block');
    e.dataTransfer.effectAllowed = 'move';

    setSmallDragGhost(e, successBlocks[index]?.label ?? 'Moving block');

    setIsExternalDragging(false);
    setDraggedSuccessBlockIndex(index);
  };

  const handleSuccessBlockDragEnd = () => {
    setDraggedSuccessBlockIndex(null);
    setSuccessDropIndex(null);
    setIsExternalDragging(false);
  };

  const handleClearAll = () => {
    onClearSelection();
    onSelectSuccessBlock(null);
  };

  const isDraggingBlocks = draggedBlockIndex !== null || isExternalDragging;
  const isDraggingSuccessBlocks = draggedSuccessBlockIndex !== null || isExternalDragging;

  return (
    <div
      className="flex-1 h-full overflow-y-auto"
      onClick={handleClearAll}
      onDragEnterCapture={(e) => {
        e.preventDefault();
        const fromIndex = getDraggedBlockIndex(e);
        const fromSuccessIndex = getDraggedSuccessBlockIndex(e);

        // Detect drags coming from the Add tab (external), even if custom types aren't readable yet.
        const types = Array.from(e.dataTransfer.types || []);
        const maybeExternal = types.includes('blockType') || types.includes('text/plain');

        if (maybeExternal && fromIndex === null && fromSuccessIndex === null) {
          setIsExternalDragging(true);
        }
      }}
      onDragOverCapture={(e) => {
        e.preventDefault();
        const fromIndex = getDraggedBlockIndex(e);
        const fromSuccessIndex = getDraggedSuccessBlockIndex(e);

        const types = Array.from(e.dataTransfer.types || []);
        const maybeExternal = types.includes('blockType') || types.includes('text/plain');

        if (maybeExternal && fromIndex === null && fromSuccessIndex === null) {
          setIsExternalDragging(true);
        }
      }}
    >
      <div className="w-full max-w-4xl mx-auto py-6 px-6">
        {/* Form Container */}
        <div className={cn('rounded-2xl border-2 border-[#2f3032]/90!', formDesign.backgroundColor)}>
          <div className="w-full pt-6 pb-10 px-4 sm:px-6">
            <div className={cn('w-full max-w-[700px] mx-auto', formDesign.textColor, fontSizeClass[formDesign.fontSize])}>
            {/* Blocks */}
            <div className="space-y-2">
              {blocks.length === 0 ? (
                <div
                  className={cn(
                    'border-2 border-dashed rounded-lg p-12 text-center transition-smooth',
                    dropIndex === 0
                      ? 'border-primary bg-accent/50'
                      : 'border-border hover:border-muted-foreground/50'
                  )}
                  onDragEnter={(e) => handleDragOver(e, 0)}
                  onDragOver={(e) => handleDragOver(e, 0)}
                  onDrop={(e) => handleDrop(e, 0)}
                >
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">Ваша форма порожня</p>
                  <p className="text-sm text-muted-foreground">Додайте або перетягніть сюди блоки з вкладки &quot;Додати&quot;</p>
                </div>
              ) : (
                <div
                  className="relative"
                  onDragOver={(e) => {
                    const bt = getDraggedBlockType(e);
                    const fromIndex = getDraggedBlockIndex(e);
                    const fromSuccessIndex = getDraggedSuccessBlockIndex(e);
                    if (bt && fromIndex === null && fromSuccessIndex === null) {
                      e.preventDefault();
                      setIsExternalDragging(true);
                    }
                  }}
                  onDrop={(e) => {
                    const bt = getDraggedBlockType(e);
                    const fromIndex = getDraggedBlockIndex(e);
                    const fromSuccessIndex = getDraggedSuccessBlockIndex(e);
                    if (bt && fromIndex === null && fromSuccessIndex === null) {
                      e.preventDefault();
                      e.stopPropagation();
                      onAddBlockAt(bt, dropIndex ?? blocks.length);
                      setDropIndex(null);
                      setIsExternalDragging(false);
                    }
                  }}
                >
                  <DropZone
                    active={dropIndex === 0}
                    isDragging={isDraggingBlocks}
                    onDragOver={(e) => handleDragOver(e, 0)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 0)}
                  />

                  <div className="space-y-2">
                    {blocks.map((block, index) => (
                      <div key={block.id} className={cn(draggedBlockIndex === index ? 'opacity-50' : '')}>
                        <BlockItem
                          block={block}
                          isActive={activeBlockId === block.id}
                          onSelect={() => {
                            onSelectSuccessBlock(null);
                            onSelectBlock(block.id);
                          }}
                          onDelete={() => onDeleteBlock(block.id)}
                          onDuplicate={() => onDuplicateBlock(block.id)}
                          onOpenSettings={() => onOpenSettings(block.id)}
                          onAddBlock={onOpenAddBlock}
                          onUpdateBlock={(updates) => onUpdateBlock(block.id, updates)}
                          dragHandleProps={{
                            draggable: true,
                            onDragStart: (e) => handleBlockDragStart(e, index),
                            onDragEnd: handleBlockDragEnd,
                          }}
                        />

                        {/* Drop zone after each block (no layout gap; hitbox appears only while dragging) */}
                        <DropZone
                          active={dropIndex === index + 1}
                          isDragging={isDraggingBlocks}
                          onDragOver={(e) => handleDragOver(e, index + 1)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index + 1)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button - Fixed at end */}
            <div className="mt-6 group/submit relative inline-block">
              {/* Settings icon on left */}
              <div
                className={cn(
                  'absolute -left-9 top-1/2 -translate-y-1/2 z-20',
                  'opacity-0 transition-smooth group-hover/submit:opacity-100'
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmitButtonClick();
                  }}
                  className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-smooth"
                  title="Button settings"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>
              {/* Button with hover/selected border */}
              <div
                className={cn(
                  'rounded-lg transition-smooth',
                  isSubmitButtonSelected 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'ring-0 group-hover/submit:ring-2 group-hover/submit:ring-border group-hover/submit:ring-offset-2'
                )}
              >
                <Button
                  variant="black"
                  size="black"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmitButtonClick();
                  }}
                >
                  {submitButtonText}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Success Page Section */}
        <div className={cn('mt-8 rounded-2xl shadow-sm', formDesign.backgroundColor)}>
          <div className="py-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>

            {/* Success Page Blocks */}
            <div className="space-y-2 w-full max-w-[700px] mx-auto px-4 sm:px-6">
              {successBlocks.length === 0 ? (
                <div
                  className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center transition-smooth',
                    successDropIndex === 0
                      ? 'border-primary bg-accent/50'
                      : 'border-border hover:border-muted-foreground/50'
                  )}
                  onDragEnter={(e) => handleSuccessDragOver(e, 0)}
                  onDragOver={(e) => handleSuccessDragOver(e, 0)}
                  onDrop={(e) => handleSuccessDrop(e, 0)}
                >
                  <p className="text-muted-foreground mb-2">Сторінка успіху порожня</p>
                  <p className="text-sm text-muted-foreground">Додайте або перетягніть сюди блоки з вкладки &quot;Додати&quot;</p>
                </div>
               ) : (
                 <div
                   className="relative"
                   onDragOver={(e) => {
                     const bt = getDraggedBlockType(e);
                     const fromIndex = getDraggedBlockIndex(e);
                     const fromSuccessIndex = getDraggedSuccessBlockIndex(e);
                     if (bt && fromIndex === null && fromSuccessIndex === null) {
                       e.preventDefault();
                       setIsExternalDragging(true);
                     }
                   }}
                   onDrop={(e) => {
                     const bt = getDraggedBlockType(e);
                     const fromIndex = getDraggedBlockIndex(e);
                     const fromSuccessIndex = getDraggedSuccessBlockIndex(e);
                     if (bt && fromIndex === null && fromSuccessIndex === null) {
                       e.preventDefault();
                       e.stopPropagation();
                       onAddSuccessBlockAt(bt, successDropIndex ?? successBlocks.length);
                       setSuccessDropIndex(null);
                       setIsExternalDragging(false);
                     }
                   }}
                 >
                  <DropZone
                    active={successDropIndex === 0}
                    isDragging={isDraggingSuccessBlocks}
                    onDragOver={(e) => handleSuccessDragOver(e, 0)}
                    onDragLeave={handleSuccessDragLeave}
                    onDrop={(e) => handleSuccessDrop(e, 0)}
                  />

                  <div className="space-y-2">
                    {successBlocks.map((block, index) => (
                      <div
                        key={block.id}
                        className={cn(draggedSuccessBlockIndex === index ? 'opacity-50' : '')}
                      >
                        <BlockItem
                          block={block}
                          isActive={activeSuccessBlockId === block.id}
                          onSelect={() => {
                            onSelectBlock(null);
                            onSelectSuccessBlock(block.id);
                          }}
                          onDelete={() => onDeleteSuccessBlock(block.id)}
                          onDuplicate={() => onDuplicateSuccessBlock(block.id)}
                          onOpenSettings={() => onOpenSuccessSettings(block.id)}
                          onAddBlock={onOpenAddSuccessBlock}
                          onUpdateBlock={(updates) => onUpdateSuccessBlock(block.id, updates)}
                          dragHandleProps={{
                            draggable: true,
                            onDragStart: (e) => handleSuccessBlockDragStart(e, index),
                            onDragEnd: handleSuccessBlockDragEnd,
                          }}
                        />

                        <DropZone
                          active={successDropIndex === index + 1}
                          isDragging={isDraggingSuccessBlocks}
                          onDragOver={(e) => handleSuccessDragOver(e, index + 1)}
                          onDragLeave={handleSuccessDragLeave}
                          onDrop={(e) => handleSuccessDrop(e, index + 1)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
