'use client'

import { cn } from '@/utils';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image, Plus, X } from 'lucide-react';


export const BlockSlideshow = ({ block, onUpdateBlock, isPreview = false }) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const images = block.slideshowImages || [];
  const positions = block.slideshowImagePositions || [];
  const height = block.slideshowHeight || 200;
  const gap = block.slideshowGap ?? 12;
  const radius = block.slideshowRadius || 'small';

  const radiusClass = {
    none: 'rounded-none',
    small: 'rounded-md',
    medium: 'rounded-xl',
    large: 'rounded-2xl',
  }[radius];

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [images]);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.6;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = 'grab';
      }
    }
  };

  // Touch support
  const handleTouchStart = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleImageUpload = (index) => {
    if (!onUpdateBlock) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = index === undefined;
    input.onchange = (e) => {
      const files = (e.target).files;
      if (!files || files.length === 0) return;
      
      const fileArray = Array.from(files);
      let loadedCount = 0;
      const newImages = [...images];
      const newPositions = [...positions];
      const results = [];
      
      fileArray.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (index !== undefined) {
            // Replacing single image
            newImages[index] = reader.result;
          } else {
            // Adding multiple images - collect in order
            results.push({ idx: i, data: reader.result });
          }
          loadedCount++;
          
          // When all files are loaded, update once
          if (loadedCount === fileArray.length) {
            if (index === undefined) {
              // Sort by original index and add all
              results.sort((a, b) => a.idx - b.idx);
              results.forEach(r => {
                newImages.push(r.data);
                newPositions.push({ x: 50, y: 50 });
              });
            }
            onUpdateBlock({ 
              slideshowImages: newImages,
              slideshowImagePositions: newPositions
            });
          }
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const handleRemoveImage = (index) => {
    if (!onUpdateBlock) return;
    const newImages = images.filter((_, i) => i !== index);
    const newPositions = positions.filter((_, i) => i !== index);
    onUpdateBlock({ 
      slideshowImages: newImages,
      slideshowImagePositions: newPositions
    });
  };

  const hasImages = images.length > 0;

  return (
    <div className="relative group/slideshow">
      {/* Navigation Arrows */}
      {hasImages && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleScroll('left');
            }}
            disabled={!canScrollLeft}
            className={cn(
              'p-1.5 rounded-md bg-background/80 hover:bg-background shadow-sm transition-smooth',
              !canScrollLeft && 'opacity-40 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleScroll('right');
            }}
            disabled={!canScrollRight}
            className={cn(
              'p-1.5 rounded-md bg-background/80 hover:bg-background shadow-sm transition-smooth',
              !canScrollRight && 'opacity-40 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          'flex overflow-x-auto scrollbar-hide',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          'select-none'
        )}
        style={{ gap: `${gap}px` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, index) => {
          const pos = positions[index] || { x: 50, y: 50 };
          return (
            <div
              key={index}
              className={cn("relative flex-shrink-0 group/image overflow-hidden", radiusClass)}
              style={{ height: `${height}px` }}
            >
              <img
                src={img}
                alt={`Slideshow image ${index + 1}`}
                className={cn("h-full w-auto object-cover", radiusClass)}
                style={{ 
                  height: `${height}px`,
                  objectPosition: `${pos.x}% ${pos.y}%`
                }}
                draggable={false}
              />
              {!isPreview && onUpdateBlock && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className="absolute top-2 left-2 p-1 rounded-md bg-background/80 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover/image:opacity-100 transition-smooth shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Image Button (only in editor) */}
        {!isPreview && onUpdateBlock && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleImageUpload();
            }}
            className={cn(
              'flex-shrink-0 flex flex-col items-center justify-center gap-2',
              'border-2 border-dashed border-border bg-muted/30',
              'hover:border-primary/50 hover:bg-muted/50 transition-smooth',
              images.length === 0 ? 'w-full' : 'aspect-[3/4]',
              radiusClass
            )}
            style={{ height: `${height}px`, minWidth: images.length === 0 ? '100%' : `${height * 0.75}px` }}
          >
            <Plus className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add photos</span>
          </button>
        )}

        {/* Empty state in preview */}
        {isPreview && images.length === 0 && (
          <div
            className={cn(
              "flex-shrink-0 w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-muted/30",
              radiusClass
            )}
            style={{ height: `${height}px` }}
          >
            <Image className="w-8 h-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">No images in slideshow</span>
          </div>
        )}
      </div>

      {/* Custom scrollbar hide style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
