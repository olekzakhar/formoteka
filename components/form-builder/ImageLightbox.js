import { useState } from 'react';
import { cn } from '@/utils';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const ImageLightbox = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleThumbnailClick = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-foreground/90" />
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors z-10"
      >
        <X className="w-6 h-6 text-background" />
      </button>

      {/* Main image */}
      <div
        className="relative flex-1 flex items-center justify-center w-full px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-background" />
          </button>
        )}

        <img
          src={images[currentIndex]}
          alt=""
          className="max-h-[70vh] max-w-[80vw] object-contain rounded-lg"
        />

        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-background" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="flex gap-2 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, index) => (
            <button
              type="button"
              key={index}
              onClick={(e) => handleThumbnailClick(e, index)}
              className={cn(
                'w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
