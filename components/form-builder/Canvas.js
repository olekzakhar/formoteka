// components/form-builder/Canvas

import { BlocksEditor } from '@/components/form-builder/BlocksEditor';
import { Plus, ArrowRight, Monitor, Smartphone } from 'lucide-react';
import { cn } from '@/utils';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button'
import { OrderButton } from '@/components/ui/OrderButton'

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
  onPageModeChange,
  onAddBlock,
}) => {
  const [pageMode, setPageMode] = useState('form'); // 'form' or 'success'
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(false);
  
  // Refs for throttling dragOver
  const lastDragTime = useRef(0);
  const dragThrottleDelay = 50; // Update every 50ms instead of every frame
  // const blocksContainerRef = useRef(null);

  // Повідомляємо батьківський компонент про зміну режиму перегляду
  useEffect(() => {
    if (onPageModeChange) {
      onPageModeChange(pageMode)
    }
  }, [pageMode, onPageModeChange])

  const handleClearAll = (e) => {
    // Не очищаємо вибір якщо це drag event
    if (e.dataTransfer) return;
    
    // Коли клікається на канвасі і відкрито Block Settings тоді буде ставати активною таба Додати а при інших умовах ні
    // Викликаємо onClearSelection тільки якщо є активний блок або success блок або вибрана кнопка submit
    if (activeBlockId || activeSuccessBlockId || isSubmitButtonSelected) {
      onClearSelection()
      onSelectSuccessBlock(null)
    }
  }

  // Обробник dragOver для визначення позиції вставки (оптимізований)
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    // Throttle: update max every 50ms
    const now = Date.now();
    if (now - lastDragTime.current < dragThrottleDelay) {
      return;
    }
    lastDragTime.current = now;

    // Перевіряємо чи це перетягування з sidebar
    const hasBlockType = e.dataTransfer.types.includes('blocktype') || 
                         e.dataTransfer.types.includes('text/plain');
    
    if (!hasBlockType) {
      setIsDraggingFromSidebar(false);
      setDragOverIndex(null);
      return;
    }

    setIsDraggingFromSidebar(true);

    // Знаходимо найближчий блок
    const blocksContainer = e.currentTarget.querySelector('[data-blocks-container]');
    if (!blocksContainer) return;

    const blockElements = blocksContainer.querySelectorAll('[data-block-root]')
    
    if (blockElements.length === 0) {
      setDragOverIndex(0);
      return;
    }

    let closestIndex = 0;
    let closestDistance = Infinity;
    const mouseY = e.clientY;

    // Use for...of for better performance than forEach
    let index = 0;
    for (const el of blockElements) {
      const rect = el.getBoundingClientRect();
      const midpoint = rect.top + (rect.height >> 1); // Bit shift for faster division by 2
      const distance = Math.abs(mouseY - midpoint);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = mouseY < midpoint ? index : index + 1;
      }
      index++;
    }

    setDragOverIndex(closestIndex);
  }, [dragThrottleDelay]);

  // Обробник drop для додавання нових блоків з sidebar
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const blockType = e.dataTransfer.getData('blockType') || e.dataTransfer.getData('text/plain');
    
    if (blockType && onAddBlock) {
      // Використовуємо dragOverIndex для вставки в потрібне місце
      // dragOverIndex вже правильно вказує на позицію вставки (0 = початок, length = кінець)
      const insertIndex = dragOverIndex !== null ? dragOverIndex : undefined;
      onAddBlock(blockType, insertIndex);
    }

    setDragOverIndex(null);
    setIsDraggingFromSidebar(false);
  }, [dragOverIndex, onAddBlock])

  const handleDragLeave = useCallback((e) => {
    // Перевіряємо чи курсор дійсно покинув область
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX >= rect.right ||
      e.clientY < rect.top ||
      e.clientY >= rect.bottom
    ) {
      setDragOverIndex(null);
      setIsDraggingFromSidebar(false);
    }
  }, [])

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
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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
                    <div className="space-y-2" data-blocks-container>
                      {blocks.length === 0 ? (
                        <div
                          className="border-2 border-dashed rounded-lg p-12 text-center transition-smooth border-border hover:border-muted-foreground/50"
                        >
                          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 text-sm">Ваша форма порожня</p>
                          <p className="text-sm opacity-90">Додайте або перетягніть сюди блоки з вкладки &quot;Додати&quot;</p>
                        </div>
                      ) : (
                        <div className="space-y-2 flex flex-wrap gap-x-4 transition-all duration-300 ease-out will-change-transform">
                          {blocks.map((block, index) => {
                            const widthClass = {
                              '1/1': '',
                              '1/2': 'max-w-[calc(50%-0.5rem)]',
                              '1/3': 'max-w-[calc(33.333%-0.67rem)]',
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
                                className={cn(
                                  'w-full',
                                  activeBlockId === block.id ? 'z-10' : '',
                                  (isDraggingFromSidebar && dragOverIndex === index) ? '' : widthClass,
                                  verticalAlignClass,
                                  horizontalAlignClass
                                )} 
                                key={block.id}
                              >
                                {/* Drop placeholder */}
                                {isDraggingFromSidebar && dragOverIndex === index && (
                                  <div className="h-20 mb-2 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center">
                                    <span className="text-sm text-primary font-medium">Додати сюди</span>
                                  </div>
                                )}
                                
                                <BlocksEditor
                                  block={block}
                                  blockIndex={index}
                                  totalBlocks={blocks.length}
                                  isActive={activeBlockId === block.id}
                                  onSelect={() => {
                                    onSelectSuccessBlock(null);
                                    onSelectBlock(block.id);
                                  }}
                                  onDelete={() => onDeleteBlock(block.id)}
                                  onDuplicate={() => onDuplicateBlock(block.id)}
                                  onMoveUp={() => index > 0 && onMoveBlock(index, index - 1)}
                                  onMoveDown={() => index < blocks.length - 1 && onMoveBlock(index, index + 1)}
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
                          
                          {/* Drop placeholder після останнього блоку */}
                          {isDraggingFromSidebar && dragOverIndex === blocks.length && (
                            <div className="w-full h-20 mt-2 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center">
                              <span className="text-sm text-primary font-medium">Додати сюди</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submit Button - Fixed at end (only if not sticky) */}
                    {!formDesign.stickyButton && (
                      <div 
                        className={cn(
                          "mt-6 group/submit relative py-1.5",
                          // Обводка на зовнішньому блоці (на всю ширину)
                          "after:content-[''] after:absolute after:-inset-x-2 after:-inset-y-0 after:rounded-lg after:pointer-events-none",
                          // Transition setup for color changes
                          'after:transition-all after:duration-100 after:ease-out',
                          // Border matching blocks: green flash then gray border on hover
                          isSubmitButtonSelected
                            ? 'after:border-2 after:border-primary'
                            : 'after:border after:border-transparent hover:after:!border-border hover:after:!duration-75 group-hover/submit:after:!border-border group-hover/submit:after:!delay-75 group-hover/submit:after:!duration-150'
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSubmitButtonClick();
                        }}
                      >
                        {/* Button wrapper without border styles */}
                        <div className="relative inline-block">
                          <Button
                            variant="black"
                            size="black"
                            onClick={(e) => {
                              // Не блокуємо спливання, щоб подія дійшла до батьківського div
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
              className="rounded-2xl border-2 border-[#2f3032]/90!"
              style={{ backgroundColor: formDesign.backgroundColor }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-full pt-6 pb-10 px-4 sm:px-6">
                <div
                  className="w-full max-w-[700px] mx-auto"
                  style={{
                    color: formDesign.textColor,
                    fontSize: formDesign.fontSize
                  }}
                >
                  {/* Success Page Blocks */}
                  <div className="space-y-2" data-blocks-container>
                    {successBlocks.length === 0 ? (
                      <div 
                        className="border-2 border-dashed rounded-lg p-12 text-center transition-smooth border-border hover:border-muted-foreground/50"
                      >
                        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                          <Plus className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="mb-2 text-sm">Сторінка успіху порожня</p>
                        <p className="text-sm opacity-90">Додайте або перетягніть сюди блоки з вкладки &quot;Додати&quot;</p>
                      </div>
                    ) : (
                      <div className="py-8 space-y-2 flex flex-wrap justify-center items-center gap-x-4 transition-all duration-300 ease-out will-change-transform">
                        {successBlocks.map((block, index) => {
                          const widthClass = {
                            '1/1': '',
                            '1/2': 'max-w-[calc(50%-0.5rem)]',
                            '1/3': 'max-w-[calc(33.333%-0.67rem)]',
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
                              className={cn(
                                'w-full',
                                activeSuccessBlockId === block.id ? 'z-10' : '',
                                (isDraggingFromSidebar && dragOverIndex === index) ? '' : widthClass,
                                verticalAlignClass,
                                horizontalAlignClass
                              )} 
                              key={block.id}
                            >
                              {/* Drop placeholder */}
                              {isDraggingFromSidebar && dragOverIndex === index && (
                                <div className="h-20 mb-2 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center">
                                  <span className="text-sm text-primary font-medium">Додати сюди</span>
                                </div>
                              )}
                              
                              <BlocksEditor
                                block={block}
                                blockIndex={index}
                                totalBlocks={successBlocks.length}
                                isActive={activeSuccessBlockId === block.id}
                                onSelect={() => {
                                  onSelectBlock(null);
                                  onSelectSuccessBlock(block.id);
                                }}
                                onDelete={() => onDeleteSuccessBlock(block.id)}
                                onDuplicate={() => onDuplicateSuccessBlock(block.id)}
                                onMoveUp={() => index > 0 && onMoveSuccessBlock(index, index - 1)}
                                onMoveDown={() => index < successBlocks.length - 1 && onMoveSuccessBlock(index, index + 1)}
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
                          )
                        })}
                        
                        {/* Drop placeholder після останнього блоку */}
                        {isDraggingFromSidebar && dragOverIndex === successBlocks.length && (
                          <div className="w-full h-20 mt-2 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-primary font-medium">Додати сюди</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
