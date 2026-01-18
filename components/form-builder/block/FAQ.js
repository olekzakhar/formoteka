'use client'

import { ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/utils';
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const BlockFAQ = ({ block, onUpdateBlock, isPreview = false }) => {
  const faqItems = block.faqItems || [];
  
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const inputRef = useRef(null);

  const autoResizeTextarea = useCallback((el) => {
    if (!el) return;
    // Use `auto` to shrink first, then grow to exact scrollHeight (prevents extra gap)
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);

      if (inputRef.current instanceof HTMLTextAreaElement) {
        requestAnimationFrame(() => {
          autoResizeTextarea(inputRef.current);
        });
      }
    }
  }, [editingField, autoResizeTextarea]);

  useLayoutEffect(() => {
    if (editingField?.field !== 'answer') return;
    if (!(inputRef.current instanceof HTMLTextAreaElement)) return;
    autoResizeTextarea(inputRef.current);
  }, [editValue, editingField, autoResizeTextarea]);

  useEffect(() => {
    // Safety net: if a drop happens outside of this block, ensure we don't leave an item "missing".
    const reset = () => {
      setDraggedIndex(null);
      setDropTargetIndex(null);
    };
    window.addEventListener('dragend', reset);
    window.addEventListener('drop', reset);
    return () => {
      window.removeEventListener('dragend', reset);
      window.removeEventListener('drop', reset);
    };
  }, []);

  const handleAddFAQ = () => {
    if (!onUpdateBlock) return;
    const newItem = {
      id: crypto.randomUUID(),
      question: 'New question?',
      answer: 'Answer to the question goes here.',
    };
    onUpdateBlock({ faqItems: [...faqItems, newItem] });
  };

  const handleRemoveFAQ = (id) => {
    if (!onUpdateBlock) return;
    onUpdateBlock({ faqItems: faqItems.filter((item) => item.id !== id) });
  };

  const handleStartEdit = (item, field, e) => {
    if (isPreview) return;
    e.stopPropagation();
    setEditingField({ id: item.id, field });
    setEditValue(field === 'question' ? item.question : item.answer);
  };

  const handleSaveEdit = () => {
    if (!editingField || !onUpdateBlock) {
      setEditingField(null);
      return;
    }
    const newItems = faqItems.map((item) => {
      if (item.id === editingField.id) {
        return { ...item, [editingField.field]: editValue };
      }
      return item;
    });
    onUpdateBlock({ faqItems: newItems });
    setEditingField(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && editingField?.field === 'question') {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const DND_MIME = 'application/x-formoteka-faq-index';

  const handleDragStart = (e, sourceIndex) => {
    e.stopPropagation();

    e.dataTransfer.effectAllowed = 'move';
    // IMPORTANT: don't set `text/plain` here, otherwise the outer FormCanvas treats this as a block drag.
    e.dataTransfer.setData(DND_MIME, String(sourceIndex));

    const handleEl = e.currentTarget;
    const cardEl = handleEl.closest('[data-dnd-card]');
    if (cardEl) {
      const clone = cardEl.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.top = '-10000px';
      clone.style.left = '-10000px';
      clone.style.width = `${cardEl.offsetWidth}px`;
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);
      e.dataTransfer.setDragImage(clone, 24, 24);
      requestAnimationFrame(() => {
        try {
          document.body.removeChild(clone);
        } catch {
          // ignore
        }
      });
    }

    requestAnimationFrame(() => {
      setDraggedIndex(sourceIndex);
      setDropTargetIndex(sourceIndex);
    });
  };

  const isInternalDrag = (e) => Array.from(e.dataTransfer.types).includes(DND_MIME);

  const handleDragOver = (e, listIndex) => {
    if (draggedIndex === null) return;
    if (!isInternalDrag(e)) return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    const rect = (e.currentTarget).getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    const target = before ? listIndex : listIndex + 1;

    // After removing the dragged item, valid insert indices are 0..(len-1)
    const maxInsertIndex = Math.max(0, faqItems.length - 1);
    const next = Math.max(0, Math.min(maxInsertIndex, target));
    setDropTargetIndex((prev) => (prev === next ? prev : next));
  };

  const handleDragOverEndZone = (e) => {
    if (draggedIndex === null) return;
    if (!isInternalDrag(e)) return;

    // Only treat the container itself as the "end zone".
    // Otherwise this handler fires for every child (because of bubbling) and causes flicker.
    if (e.target !== e.currentTarget) return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    const next = Math.max(0, faqItems.length - 1);
    setDropTargetIndex((prev) => (prev === next ? prev : next));
  };

  const handleDragLeave = () => {
    // no-op: clearing on dragleave causes flicker when moving across child elements
  };

  const handleDrop = (e) => {
    if (!isInternalDrag(e)) return;

    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || !onUpdateBlock) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      return;
    }

    const newItems = [...faqItems];
    const [removed] = newItems.splice(draggedIndex, 1);

    const max = newItems.length;
    const insertIndex = Math.max(0, Math.min(max, dropTargetIndex ?? max));
    newItems.splice(insertIndex, 0, removed);

    onUpdateBlock({ faqItems: newItems });
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = (e) => {
    e?.stopPropagation?.();
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const renderEditableQuestion = (item) => {
    const isEditing = editingField?.id === item.id && editingField?.field === 'question';
    
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-medium bg-transparent outline-none w-full p-0 m-0 leading-5 block px-1 -mx-1 rounded"
        />
      );
    }

    return (
      <span 
        className={cn("block w-full leading-5", !isPreview && "cursor-text hover:bg-muted/50 rounded px-1 -mx-1")}
        onClick={(e) => handleStartEdit(item, 'question', e)}
      >
        {item.question}
      </span>
    );
  };

  const renderEditableAnswer = (item) => {
    const isEditing = editingField?.id === item.id && editingField?.field === 'answer';
    
    if (isEditing) {
      return (
        <textarea
          ref={inputRef}
          rows={1}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            autoResizeTextarea(e.target);
          }}
          onFocus={(e) => {
            requestAnimationFrame(() => autoResizeTextarea(e.currentTarget));
          }}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditingField(null);
          }}
          onClick={(e) => e.stopPropagation()}
          className="text-sm bg-transparent outline-none w-full resize-none overflow-hidden p-0 m-0 leading-relaxed opacity-80 px-1 -mx-1 rounded block align-top"
          style={{ minHeight: 0 }}
        />
      );
    }
    
    return (
      <span 
        className={cn("leading-relaxed", !isPreview && "cursor-text hover:bg-muted/50 rounded px-1 -mx-1 block")}
        onClick={(e) => handleStartEdit(item, 'answer', e)}
      >
        {item.answer}
      </span>
    );
  };

  if (faqItems.length === 0 && !isPreview) {
    return (
      <button
        type="button"
        onClick={handleAddFAQ}
        className="w-full py-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-smooth flex flex-col items-center justify-center gap-2"
      >
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Plus className="w-5 h-5 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">Add your first FAQ</span>
      </button>
    );
  }

  const indexById = new Map(faqItems.map((it, i) => [it.id, i]));
  const listWithoutDragged = draggedIndex === null ? faqItems : faqItems.filter((_, i) => i !== draggedIndex);
  const showDropPlaceholder = draggedIndex !== null && dropTargetIndex !== null;

  return (
    <div className="space-y-3">
      <Accordion
        type="multiple"
        className="space-y-2"
        onDragOver={handleDragOverEndZone}
        onDrop={handleDrop}
      >
        {listWithoutDragged.map((item, listIndex) => {
          const sourceIndex = indexById.get(item.id) ?? listIndex;

          return (
            <div key={item.id} className="space-y-2">
              {showDropPlaceholder && dropTargetIndex === listIndex && (
                <div
                  onDragOver={(e) => {
                    if (draggedIndex === null) return;
                    if (!isInternalDrag(e)) return;
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'move';
                    setDropTargetIndex((prev) => (prev === listIndex ? prev : listIndex));
                  }}
                  onDrop={handleDrop}
                  className="h-14 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5"
                />
              )}

              <div
                onDragOver={(e) => handleDragOver(e, listIndex)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="relative"
                data-dnd-card
              >
                <AccordionItem value={item.id} className="border border-border rounded-lg pl-10 pr-4 bg-muted/30 group">
                  {!isPreview && (
                    <>
                      <button
                        type="button"
                        draggable
                        onDragStart={(e) => handleDragStart(e, sourceIndex)}
                        onDragEnd={handleDragEnd}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="absolute top-3 left-2 p-1 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth cursor-grab active:cursor-grabbing z-10"
                        aria-label="Reorder FAQ item"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFAQ(item.id);
                        }}
                        className="absolute top-3 right-10 p-1 rounded-md bg-background/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth z-10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                    {renderEditableQuestion(item)}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm pb-3 opacity-80">
                    {renderEditableAnswer(item)}
                  </AccordionContent>
                </AccordionItem>
              </div>
            </div>
          );
        })}

        {showDropPlaceholder && dropTargetIndex === listWithoutDragged.length && (
          <div
            onDragOver={(e) => {
              if (draggedIndex === null) return;
              if (!isInternalDrag(e)) return;
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = 'move';
              const endIndex = listWithoutDragged.length;
              setDropTargetIndex((prev) => (prev === endIndex ? prev : endIndex));
            }}
            onDrop={handleDrop}
            className="h-14 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5"
          />
        )}
      </Accordion>

      {!isPreview && (
        <button
          type="button"
          onClick={handleAddFAQ}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-smooth flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Add FAQ item</span>
        </button>
      )}
    </div>
  );
};