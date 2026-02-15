import { useState, useRef, useEffect } from 'react';
import { Settings2, Columns3 } from 'lucide-react';
import { cn } from '@/utils';

export const MobileSidePanelDrawer = ({ children, isSettingsBlockMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentTranslateY, setCurrentTranslateY] = useState(0);
  const drawerRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  const [keyboardOffset, setKeyboardOffset] = useState(0)

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

    updateHeight()
    
    // Listen to visual viewport changes (better for keyboard)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
      window.visualViewport.addEventListener('scroll', updateHeight)
    }
    
    window.addEventListener('resize', updateHeight)
    window.addEventListener('orientationchange', updateHeight)

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight)
        window.visualViewport.removeEventListener('scroll', updateHeight)
      }
      window.removeEventListener('resize', updateHeight)
      window.removeEventListener('orientationchange', updateHeight)
    };
  }, [])

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
      
      {/* Floating button when drawer is closed */}
      {!isOpen && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 z-50 md:hidden"
          style={{
            // Always position at 0 from bottom - this is the actual visible bottom
            bottom: 0,
            // Add safe area padding for devices with home indicator
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <button
            onClick={handleToggle}
            className={cn(
              'flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow-lg',
              'select-none pointer-events-auto'
            )}
            style={{
              width: '200px',
              height: '32px',
              borderTopLeftRadius: '36px',
              borderTopRightRadius: '36px',
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0'
            }}
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
      )}
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        data-mobile-drawer
        className={cn(
          'fixed inset-x-0 z-50 md:hidden pointer-events-none'
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
        {/* Handle button - only visible when drawer is open */}
        <div className="flex justify-center">
          <button
            onClick={handleToggle}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            className={cn(
              'flex items-center justify-center gap-2 bg-primary text-primary-foreground',
              'cursor-grab active:cursor-grabbing',
              'select-none touch-none pointer-events-auto'
            )}
            style={{
              width: '200px',
              height: '32px',
              borderTopLeftRadius: '36px',
              borderTopRightRadius: '36px',
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0'
            }}
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

        {/* Content */}
        <div 
          data-drawer-content
          className="pointer-events-auto overflow-y-auto" 
          style={{ height: 'calc(100% - 32px)' }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
