// components/form-builder/Canvas

import { BlocksEditor } from '@/components/form-builder/BlocksEditor';
import { Plus, ArrowRight, Settings as SettingsIcon, Monitor, Smartphone } from 'lucide-react';
import { cn } from '@/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'
import { OrderButton } from '@/components/ui/OrderButton'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const Canvas = ({
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
  onUpdateBlock,
  onMoveBlock,
  onSubmitButtonClick,
  isSubmitButtonSelected,
  onSelectSuccessBlock,
  onDeleteSuccessBlock,
  onDuplicateSuccessBlock,
  onOpenSuccessSettings,
  onUpdateSuccessBlock,
  onMoveSuccessBlock,
  onOpenAddSuccessBlock,
  onPageModeChange
}) => {
  const [pageMode, setPageMode] = useState('form'); // 'form' or 'success'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Повідомляємо батьківський компонент про зміну режиму перегляду
  useEffect(() => {
    if (onPageModeChange) {
      onPageModeChange(pageMode)
    }
  }, [pageMode, onPageModeChange])

  const handleClearAll = () => {
    // Коли клікається на канвасі і відкрито Block Settings тоді буде ставати активною таба Додати а при інших умовах ні
    // Викликаємо onClearSelection тільки якщо є активний блок або success блок або вибрана кнопка submit
    if (activeBlockId || activeSuccessBlockId || isSubmitButtonSelected) {
      onClearSelection()
      onSelectSuccessBlock(null)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onMoveBlock(oldIndex, newIndex);
      }
    }
  };

  const handleSuccessDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = successBlocks.findIndex((block) => block.id === active.id);
      const newIndex = successBlocks.findIndex((block) => block.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onMoveSuccessBlock(oldIndex, newIndex);
      }
    }
  };

  return (
    <div
      className="w-full h-full overflow-y-auto"
      onClick={handleClearAll}
    >
      <div className="flex gap-1 transition-all duration-300">
        <div className={cn(
          "w-full mx-auto pt-2 pb-6 px-3 sm:px-6",
            previewMode === 'mobile' ? 'max-w-[375px]' : 'w-full max-w-4xl'
          )}>

          <div className="relative justify-center flex gap-3.5">
            {/* Pages Mode Toggle */}
            <div className="flex justify-center mb-2 text-[12.5px] font-semibold">
              <div className="inline-flex bg-white/25 rounded-lg p-[3px] border border-border">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPageMode('form');
                  }}
                  className={cn(
                    'px-2.5 py-[5px] rounded-md transition-smooth',
                    pageMode === 'form'
                      ? 'bg-primary/[0.25] text-black/[0.8]'
                      : 'text-muted-foreground hover:text-black/[0.8]'
                  )}
                >
                  Форма
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPageMode('success');
                  }}
                  className={cn(
                    'px-2.5 py-[5px] rounded-md transition-smooth',
                    pageMode === 'success'
                      ? 'bg-primary/[0.25] text-black/[0.8]'
                      : 'text-muted-foreground hover:text-black/[0.8]'
                  )}
                >
                  Після відправки
                </button>
              </div>
            </div>

            {/* Preview Mode Toggle */}
            <div className="flex justify-center mb-2">
              <div className="inline-flex bg-white/25 rounded-lg p-[3px] border border-border">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewMode('desktop');
                  }}
                  className={cn(
                    'px-2 py-[7px] rounded-md transition-smooth',
                    previewMode === 'desktop'
                      ? 'bg-primary/[0.25] text-black/[0.8]'
                      : 'text-muted-foreground hover:text-black/[0.8]'
                  )}
                  title="Десктопна версія"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewMode('mobile');
                  }}
                  className={cn(
                    'px-2 py-[7px] rounded-md transition-smooth',
                    previewMode === 'mobile'
                      ? 'bg-primary/[0.25] text-black/[0.8]'
                      : 'text-muted-foreground hover:text-black/[0.8]'
                  )}
                  title="Мобільна версія"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Form Container - показується тільки коли pageMode === 'form' */}
          {pageMode === 'form' && (
            <>
              <div
                className="rounded-2xl border-2 border-[#2f3032]/90!"
                style={{ backgroundColor: formDesign.backgroundColor }}
              >
                <div className="w-full pt-6 pb-10 px-4 sm:px-6">
                  <div
                    className="w-full max-w-[700px] mx-auto"
                    style={{
                      color: formDesign.textColor,
                      fontSize: formDesign.fontSize
                    }}
                  >
                    {/* Blocks */}
                    <div className="space-y-2">
                      {blocks.length === 0 ? (
                        <div
                          className="border-2 border-dashed rounded-lg p-12 text-center transition-smooth border-border hover:border-muted-foreground/50">
                          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 text-sm">Ваша форма порожня</p>
                          <p className="text-sm opacity-90">Додайте або перетягніть сюди блоки з вкладки &quot;Додати&quot;</p>
                        </div>
                      ) : (
                        <DndContext
                          id="form-blocks-dnd"
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={blocks.map(block => block.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2">
                              {blocks.map((block) => {
                                const widthClass = {
                                  '1/1': 'w-full',
                                  '1/2': 'w-[calc(50%-0.5rem)]',
                                  '1/3': 'w-[calc(33.333%-0.67rem)]',
                                }[block.blockWidth || '1/1'];

                                const verticalAlignClass = {
                                  top: 'self-start',
                                  center: 'self-center',
                                  bottom: 'self-end',
                                }[block.blockVerticalAlign || 'top'];

                                // Horizontal positioning for inline blocks (when a row has remaining free space)
                                const horizontalAlignClass = block.blockWidth !== '1/1'
                                  ? {
                                      start: '',
                                      center: 'mx-auto',
                                      end: 'ml-auto',
                                    }[block.blockHorizontalAlign || 'start']
                                  : '';

                                return (
                                  <div
                                    key={block.id}
                                    className={cn(
                                      'relative',
                                      widthClass,
                                      verticalAlignClass,
                                      horizontalAlignClass,
                                    )}
                                  >
                                    <BlocksEditor
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
                                      headingColor={formDesign.headingColor}
                                      headingSize={formDesign.headingSize}
                                      inputColor={formDesign.inputColor}
                                      inputBgColor={formDesign.inputBgColor}
                                      inputTextColor={formDesign.inputTextColor}
                                      formTextColor={formDesign.textColor}
                                      accentColor={formDesign.accentColor}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>

                    {/* Submit Button - Fixed at end (only if not sticky) */}
                    {!formDesign.stickyButton && (
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
                            title="Налаштування кнопки"
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
                    )}
                  </div>
                </div>
              </div>

              {/* Sticky Submit Button (when enabled) */}
              {formDesign.stickyButton && (
                <div
                  className={cn(
                    'group/sticky mt-4 rounded-xl p-3 bg-card border border-border cursor-pointer transition-smooth',
                    isSubmitButtonSelected
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'ring-0 hover:ring-2 hover:ring-border hover:ring-offset-2'
                  )}
                  style={{
                    backgroundColor: formDesign.backgroundColor,
                    color: formDesign.textColor,
                    fontSize: formDesign.fontSize
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmitButtonClick();
                  }}
                >
                  <div className="group-hover/sticky:opacity-90 transition-smooth">
                    <OrderButton
                      hasLineItems={blocks.some((b) => b.type === 'line-items')}
                      quantityLineItems={1}
                      totalAmount="0.00"
                      submitButtonText={submitButtonText}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Success Page Section - показується тільки коли pageMode === 'success' */}
          {pageMode === 'success' && (
            <div
              className="rounded-2xl border-2 border-[#2f3032]/90! bg-white"
              style={{
                backgroundColor: formDesign.backgroundColor,
                color: formDesign.textColor,
                fontSize: formDesign.fontSize
              }}
            >
              <div className="py-8">
                {/* Success Page Blocks */}
                <div
                  className="space-y-2 w-full max-w-[700px] mx-auto px-4 sm:px-6"
                  style={{
                    backgroundColor: formDesign.backgroundColor,
                    color: formDesign.textColor,
                    fontSize: formDesign.fontSize
                  }}
                >
                  {successBlocks.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center transition-smooth border-border hover:border-muted-foreground/50">
                      <p className="mb-2 text-sm">Сторінка успіху порожня</p>
                      <p className="text-sm opacity-90">Додайте або перетягніть сюди блоки з вкладки &quot;Додати&quot;</p>
                    </div>
                  ) : (
                    <DndContext
                      id="success-blocks-dnd"
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleSuccessDragEnd}
                    >
                      <SortableContext
                        items={successBlocks.map(block => block.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {successBlocks.map((block) => (
                            <div key={block.id} className="relative">
                              <BlocksEditor
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
                                headingColor={formDesign.headingColor}
                                headingSize={formDesign.headingSize}
                                inputColor={formDesign.inputColor}
                                inputBgColor={formDesign.inputBgColor}
                                inputTextColor={formDesign.inputTextColor}
                                formTextColor={formDesign.textColor}
                              />
                            </div>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Це пустий блок щоб блок канвас залишався по центру а це імітує sidepanel */}
        {/* а 4px це додатковий відступ щоб канвас не впирався в sidepanel на меншій ширині */}
        <div className="hidden md:block w-full max-w-[calc(290px-4px)] lg:max-w-[calc(370px-4px)]"></div>
      </div>
    </div>
  )
}
