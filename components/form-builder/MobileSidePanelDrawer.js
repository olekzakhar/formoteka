import { useState, useRef, useEffect } from 'react';
import { Settings2, Columns3 } from 'lucide-react';
import { cn } from '@/utils';

export const MobileSidePanelDrawer = ({ children, isSettingsBlockMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentTranslateY, setCurrentTranslateY] = useState(0);
  const drawerRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // Track actual available viewport height (accounting for keyboard)
  useEffect(() => {
    const updateHeight = () => {
      // Use visualViewport when available (better for iOS keyboard)
      const height = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(height);
      
      // Calculate keyboard offset (difference between window height and visual viewport)
      const offset = window.innerHeight - height;
      setKeyboardOffset(offset);
      
      // Also update CSS variable for other components
      const vh = height * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateHeight();
    
    // Listen to visual viewport changes (better for keyboard)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);
    }
    
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight);
        window.visualViewport.removeEventListener('scroll', updateHeight);
      }
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setCurrentTranslateY(0);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isOpen) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartY;
    
    // When open, only allow dragging down
    if (diff > 0) {
      setCurrentTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    
    if (isOpen && currentTranslateY > threshold) {
      setIsOpen(false);
    }
    
    setCurrentTranslateY(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !isOpen) return;
      
      const diff = e.clientY - dragStartY;
      
      // When open, only allow dragging down
      if (diff > 0) {
        setCurrentTranslateY(diff);
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      
      const threshold = 100;
      
      if (isOpen && currentTranslateY > threshold) {
        setIsOpen(false);
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
      // When closed, move drawer completely off screen (including handle)
      return `translateY(100%)`;
    }
  };
  
  // Calculate dynamic height based on viewport - use current values directly
  const drawerHeight = viewportHeight * 0.92;
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Floating button - ALWAYS visible with margin from bottom */}
      <div 
        className="fixed left-1/2 -translate-x-1/2 md:hidden"
        style={{
          bottom: '12px', // Fixed margin from bottom
          zIndex: isOpen ? 40 : 50, // Lower z-index when drawer is open
        }}
      >
        <button
          onClick={handleToggle}
          className={cn(
            'flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow-lg',
            'select-none pointer-events-auto rounded-full pl-[23px] pr-6 py-2',
            'transition-all duration-200',
            isOpen && 'scale-95 opacity-90'
          )}
        >
          {isSettingsBlockMode ? (
            <>
              <Settings2 className="w-4 h-4" />
              <span className="text-sm font-medium">Властивості</span>
            </>
          ) : (
            <>
              <Columns3 className="w-4 h-4 rotate-90" />
              <span className="text-sm font-medium">Блоки</span>
            </>
          )}
        </button>
      </div>
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        data-mobile-drawer
        className={cn(
          'fixed inset-x-0 z-50 md:hidden pointer-events-none',
          'bg-background rounded-t-3xl shadow-2xl'
        )}
        style={{
          transform: getTransformStyle(),
          height: `${drawerHeight}px`,
          // Always position at actual bottom
          bottom: 0,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          // Only animate transform, NOT height
          transition: isDragging ? 'none' : 'transform 300ms ease-out',
          // Completely hide when closed
          display: isOpen ? 'block' : 'none',
        }}
      >
        {/* Apple-style drag handle */}
        <div 
          className="pt-2 pb-2 flex justify-center bg-[#E4E5E5] rounded-t-3xl pointer-events-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div 
            className="w-14 h-[2px] bg-gray-400/60 rounded-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Content */}
        <div 
          data-drawer-content
          className="bg-[#E4E5E5] pointer-events-auto overflow-y-auto" 
          style={{ height: 'calc(100% - 28px)' }} // Subtract handle height
        >
          {children}
        </div>
      </div>
    </>
  )
}
