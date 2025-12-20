import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileSidePanelDrawer = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentTranslateY, setCurrentTranslateY] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setCurrentTranslateY(0);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartY;
    
    if (isOpen) {
      // When open, only allow dragging down
      if (diff > 0) {
        setCurrentTranslateY(diff);
      }
    } else {
      // When closed, only allow dragging up
      if (diff < 0) {
        setCurrentTranslateY(diff);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    
    if (isOpen && currentTranslateY > threshold) {
      setIsOpen(false);
    } else if (!isOpen && currentTranslateY < -threshold) {
      setIsOpen(true);
    }
    
    setCurrentTranslateY(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const diff = e.clientY - dragStartY;
      
      if (isOpen) {
        if (diff > 0) {
          setCurrentTranslateY(diff);
        }
      } else {
        if (diff < 0) {
          setCurrentTranslateY(diff);
        }
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      const threshold = 100;
      
      if (isOpen && currentTranslateY > threshold) {
        setIsOpen(false);
      } else if (!isOpen && currentTranslateY < -threshold) {
        setIsOpen(true);
      }
      
      setCurrentTranslateY(0);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartY, isOpen, currentTranslateY]);

  const getTransformStyle = () => {
    if (isOpen) {
      return `translateY(${currentTranslateY}px)`;
    } else {
      // When closed, drawer is off-screen, pulled up reveals it
      return `translateY(calc(100% - 32px + ${currentTranslateY}px))`;
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 md:hidden',
          'bg-card border-t border-border shadow-xl',
          isDragging ? '' : 'transition-transform duration-300 ease-out'
        )}
        style={{
          transform: getTransformStyle(),
          maxHeight: '85vh',
        }}
      >
        {/* Handle button */}
        <div className="flex justify-center">
          <button
            onClick={handleToggle}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            className={cn(
              'flex items-center justify-center bg-primary text-primary-foreground',
              'cursor-grab active:cursor-grabbing',
              'select-none touch-none'
            )}
            style={{
              width: '180px',
              height: '32px',
              borderTopLeftRadius: '36px',
              borderTopRightRadius: '36px',
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0',
              marginTop: '-32px',
            }}
          >
            {isOpen ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};
