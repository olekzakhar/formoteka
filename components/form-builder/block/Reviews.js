'use client'

import { Plus, Star, Trash2, User, GripVertical, Camera } from 'lucide-react';
import { cn } from '@/utils';
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';

export const BlockReviews = ({ block, onUpdateBlock, isPreview = false }) => {
  const reviews = block.reviews || [];
  const layout = block.reviewsLayout || 'cards';
  const showAvatar = block.reviewsShowAvatar !== false;
  
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatarId, setUploadingAvatarId] = useState<string | null>(null);

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
    if (editingField?.field !== 'text') return;
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

  const handleAddReview = () => {
    if (!onUpdateBlock) return;
    const newReview = {
      id: crypto.randomUUID(),
      text: 'Great experience! Highly recommended.',
      authorName: 'Customer Name',
      authorRole: 'Role / Company',
      rating: 5,
    };
    onUpdateBlock({ reviews: [...reviews, newReview] });
  };

  const handleRemoveReview = (id) => {
    if (!onUpdateBlock) return;
    onUpdateBlock({ reviews: reviews.filter((r) => r.id !== id) });
  };

  const handleAvatarClick = (reviewId) => {
    if (isPreview || !onUpdateBlock) return;
    setUploadingAvatarId(reviewId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingAvatarId || !onUpdateBlock) {
      setUploadingAvatarId(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const next = reviews.map((r) =>
        r.id === uploadingAvatarId ? { ...r, authorAvatar: reader.result } : r
      );
      onUpdateBlock({ reviews: next });
      setUploadingAvatarId(null);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartEdit = (review) => {
    if (isPreview) return;
    setEditingField({ id: review.id, field });
    setEditValue(field === 'text' ? review.text : field === 'authorName' ? review.authorName : (review.authorRole || ''));
  };

  const handleSaveEdit = () => {
    if (!editingField || !onUpdateBlock) {
      setEditingField(null);
      return;
    }
    const newReviews = reviews.map((r) => {
      if (r.id === editingField.id) {
        return { ...r, [editingField.field]: editValue };
      }
      return r;
    });
    onUpdateBlock({ reviews: newReviews });
    setEditingField(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && editingField?.field !== 'text') {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const DND_MIME = 'application/x-formoteka-review-index';

  const handleDragStart = (e, sourceIndex) => {
    e.stopPropagation();

    // Prevent the parent canvas DnD from interpreting this drag
    e.dataTransfer.effectAllowed = 'move';
    // IMPORTANT: don't set `text/plain` here, otherwise the outer FormCanvas treats this as a block drag.
    e.dataTransfer.setData(DND_MIME, String(sourceIndex));

    // Create a stable drag image so the item doesn't "vanish" when React re-renders
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

    // Defer state so the browser can start the drag before the source node is re-rendered
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
    const maxInsertIndex = Math.max(0, reviews.length - 1);
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

    const next = Math.max(0, reviews.length - 1);
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

    const newReviews = [...reviews];
    const [removed] = newReviews.splice(draggedIndex, 1);

    const max = newReviews.length;
    const insertIndex = Math.max(0, Math.min(max, dropTargetIndex ?? max));
    newReviews.splice(insertIndex, 0, removed);

    onUpdateBlock({ reviews: newReviews });
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = (e) => {
    e?.stopPropagation?.();
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            'w-4 h-4',
            i <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );

  const renderEditableText = (review) => {
    const isEditingText = editingField?.id === review.id && editingField?.field === 'text';
    
    if (isEditingText) {
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
          className="text-sm leading-relaxed bg-transparent outline-none w-full resize-none overflow-hidden p-0 m-0 px-1 -mx-1 rounded block align-top"
          style={{ minHeight: 0 }}
        />
      );
    }
    
    return (
      <p 
        className={cn("text-sm leading-relaxed m-0", !isPreview && "cursor-text hover:bg-muted/50 rounded px-1 -mx-1")}
        onClick={(e) => {
          e.stopPropagation();
          handleStartEdit(review, 'text');
        }}
      >
        {review.text}
      </p>
    );
  };

  const renderEditableName = (review) => {
    const isEditingName = editingField?.id === review.id && editingField?.field === 'authorName';
    
    if (isEditingName) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium bg-transparent outline-none w-full p-0 m-0 leading-5 px-1 -mx-1 rounded block"
        />
      );
    }
    
    return (
      <p 
        className={cn("text-sm font-medium leading-5 m-0", !isPreview && "cursor-text hover:bg-muted/50 rounded px-1 -mx-1")}
        onClick={(e) => {
          e.stopPropagation();
          handleStartEdit(review, 'authorName');
        }}
      >
        {review.authorName}
      </p>
    );
  };

  const renderEditableRole = (review) => {
    const isEditingRole = editingField?.id === review.id && editingField?.field === 'authorRole';
    
    if (isEditingRole) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className="text-xs bg-transparent outline-none w-full p-0 m-0 leading-4 opacity-80 px-1 -mx-1 rounded block"
        />
      );
    }
    
    if (!review.authorRole && isPreview) return null;
    
    return (
      <p 
        className={cn("text-xs leading-4 opacity-80 m-0", !isPreview && "cursor-text hover:bg-muted/50 rounded px-1 -mx-1")}
        onClick={(e) => {
          e.stopPropagation();
          handleStartEdit(review, 'authorRole');
        }}
      >
        {review.authorRole || (isPreview ? '' : 'Add role...')}
      </p>
    );
  };

  const renderAvatar = (review, size) => {
    const sizeClass = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
    const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
    
    if (isPreview) {
      return review.authorAvatar ? (
        <img
          src={review.authorAvatar}
          alt={review.authorName}
          className={cn(sizeClass, "rounded-full object-cover")}
        />
      ) : (
        <div className={cn(sizeClass, "rounded-full bg-muted flex items-center justify-center")}>
          <User className={cn(iconSize, "text-muted-foreground")} />
        </div>
      );
    }
    
    return (
      <button
        type="button"
        draggable={false}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          handleAvatarClick(review.id);
        }}
        className={cn(
          sizeClass,
          "rounded-full bg-muted flex items-center justify-center overflow-hidden",
          "border-2 border-dashed border-border hover:border-primary/50 transition-smooth",
          "group/avatar relative"
        )}
        title="Click to add/change avatar"
      >
        {review.authorAvatar ? (
          <>
            <img
              src={review.authorAvatar}
              alt={review.authorName}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <Camera className={cn(iconSize, "text-muted-foreground group-hover/avatar:text-primary transition-colors")} />
          </div>
        )}
      </button>
    );
  };

  const renderReviewCard = (review, sourceIndex, listIndex) => {
    return (
      <div
        data-dnd-card
        onDragOver={(e) => handleDragOver(e, listIndex)}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative p-4 rounded-xl bg-muted/50 border border-border/50 group transition-all duration-200',
          layout === 'list' ? 'flex gap-4' : '',
          !isPreview && 'pl-8'
        )}
      >
        {!isPreview && (
          <>
            <button
              type="button"
              draggable
              onDragStart={(e) => handleDragStart(e, sourceIndex)}
              onDragEnd={handleDragEnd}
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute top-4 left-2 p-1 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth cursor-grab active:cursor-grabbing"
              aria-label="Reorder review"
              title="Drag to reorder"
            >
              <GripVertical className="w-3 h-3" />
            </button>
            <button
              type="button"
              draggable={false}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveReview(review.id);
              }}
              className="absolute top-2 right-2 p-1 rounded-md bg-background/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth z-10"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}

        {layout === 'list' && showAvatar && (
          <div className="flex-shrink-0">
            {renderAvatar(review, 'md')}
          </div>
        )}

        <div className={cn('flex-1', layout === 'cards' ? 'space-y-3' : 'space-y-1')}>
          {renderEditableText(review)}

          <div className={cn('flex items-center gap-3', layout === 'cards' && 'mt-4')}>
            {layout === 'cards' && showAvatar && (
              <div className="flex-shrink-0">
                {renderAvatar(review, 'sm')}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {renderEditableName(review)}
              {renderEditableRole(review)}
            </div>
          </div>

          {renderStars(review.rating)}
        </div>
      </div>
    );
  };

  const indexById = new Map(reviews.map((r, i) => [r.id, i]));
  const listWithoutDragged = draggedIndex === null ? reviews : reviews.filter((_, i) => i !== draggedIndex);
  const showDropPlaceholder = draggedIndex !== null && dropTargetIndex !== null;

  if (reviews.length === 0 && !isPreview) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleAddReview}
          className="w-full py-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-muted/30 transition-smooth flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">Add your first review</span>
        </button>
      </>
    );
  }

  return (
    <div className="space-y-3">
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <div
        className={cn(
          layout === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'
        )}
        onDragOver={handleDragOverEndZone}
        onDrop={handleDrop}
      >
        {listWithoutDragged.map((review, listIndex) => {
          const sourceIndex = indexById.get(review.id) ?? listIndex;
          return (
            <div key={review.id} className="space-y-3">
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
                  className="h-16 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5"
                />
              )}
              {renderReviewCard(review, sourceIndex, listIndex)}
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
            className="h-16 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5"
          />
        )}
      </div>

      {!isPreview && (
        <button
          type="button"
          onClick={handleAddReview}
          className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-smooth flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Add review</span>
        </button>
      )}
    </div>
  );
};
