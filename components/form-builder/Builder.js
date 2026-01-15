// components/form-builder/Builder

'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import { useBuilder } from '@/hooks/useBuilder';
import { Canvas } from '@/components/form-builder/Canvas';
import { SidePanel } from '@/components/form-builder/SidePanel';
import { Header } from '@/components/form-builder/Header';
import { Preview } from '@/components/form-builder/Preview';
import { MobileSidePanelDrawer } from '@/components/form-builder/MobileSidePanelDrawer';
import { getDefaultBlock } from '@/data/block-definitions';
import { useIsMobile } from '@/hooks/use-mobile';
import { updateFormData } from '@/server/action';
import { createClient } from '@/utils/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

export const Builder = ({ form }) => {
  const isMobile = useIsMobile();
  const [isPreview, setIsPreview] = useState(false);
  const [showBlockSettings, setShowBlockSettings] = useState(false);
  const [showSubmitSettings, setShowSubmitSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const supabase = createClient();

  // Parse saved data from database
  const savedFormData = form?.form_data || {};
  const savedSettings = form?.settings || {};
  const savedSuccessMessage = form?.success_message || [];

  // Initialize state with saved data
  const [submitButtonText, setSubmitButtonText] = useState(
    savedFormData.submitButtonText || 'Надіслати'
  );
  const [formDesign, setFormDesign] = useState(
    savedSettings.formDesign || {
      backgroundColor: 'bg-white',
      textColor: 'text-foreground',
      fontSize: 'medium',
      formDisabled: true,
    }
  );

  // Success page blocks state
  const [successBlocks, setSuccessBlocks] = useState(
    savedSuccessMessage.length > 0 ? savedSuccessMessage : [
      { id: 'success-heading', type: 'heading', label: 'Дякуємо!', textAlign: 'center' },
      { id: 'success-text', type: 'paragraph', label: 'Ми отримали вашу заявку.', textAlign: 'center' },
    ]
  );
  const [activeSuccessBlockId, setActiveSuccessBlockId] = useState(null);
  const [isEditingSuccessBlock, setIsEditingSuccessBlock] = useState(false);

  const {
    blocks,
    setBlocks,
    activeBlockId,
    activeTab,
    setActiveTab,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    selectBlock,
    clearSelection,
  } = useBuilder(savedFormData.blocks || []);

  // Track if this is the initial load
  const isInitialLoad = useRef(true);
  const isDataLoaded = useRef(false);
  const saveTimeoutRef = useRef(null);
  const lastSaveDataRef = useRef(null);

  // Debounce with longer delay (3 seconds instead of 1)
  const debouncedBlocks = useDebounce(blocks, 3000);
  const debouncedSubmitButtonText = useDebounce(submitButtonText, 3000);
  const debouncedFormDesign = useDebounce(formDesign, 3000);
  const debouncedSuccessBlocks = useDebounce(successBlocks, 3000);

  // Функція для видалення зображень з R2
  const deleteImagesFromR2 = useCallback(async (fileNames) => {
    // Фільтруємо тільки валідні імена файлів (не data URLs і не пусті)
    const validFileNames = fileNames.filter(
      fileName => fileName && 
      !fileName.startsWith('data:') && 
      !fileName.startsWith('http') // якщо збережені старі дані з URL
    );
    
    if (validFileNames.length === 0) return;

    try {
      const results = await Promise.allSettled(
        validFileNames.map(fileName =>
          fetch('/api/upload', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName }),
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to delete ${fileName}`);
            return fileName;
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (successful > 0) {
        console.log(`✅ Видалено зображень: ${successful}`);
      }
      if (failed > 0) {
        console.error(`❌ Не вдалося видалити: ${failed}`);
      }
    } catch (error) {
      console.error('❌ Помилка видалення зображень:', error);
    }
  }, []);

  // Core save function that actually saves to database
  const saveToDatabase = useCallback(async (dataToSave) => {
    if (!form?.slug || !form?.user_id) return false;

    // Create data snapshot
    const currentData = dataToSave || {
      blocks: blocks,
      submitButtonText: submitButtonText,
      formDesign: formDesign,
      successBlocks: successBlocks,
    };

    // Check if data actually changed (deep comparison)
    const dataString = JSON.stringify(currentData);
    if (lastSaveDataRef.current === dataString) {
      return false; // No changes, skip save
    }

    setIsSaving(true);
    setHasUnsavedChanges(false);

    try {
      const result = await updateFormData(supabase, form.slug, form.user_id, currentData);

      if (result.success) {
        lastSaveDataRef.current = dataString;
        setLastSaved(new Date());
        // console.log('✅ Form saved successfully');
        return true;
      } else {
        // console.error('❌ Error saving form:', result.error);
        setHasUnsavedChanges(true);
        return false;
      }
    } catch (error) {
      // console.error('❌ Error saving form:', error);
      setHasUnsavedChanges(true);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [form?.slug, form?.user_id, blocks, submitButtonText, formDesign, successBlocks, supabase]);

  // Auto-save function (uses debounced values)
  const autoSave = useCallback(async () => {
    // Skip saving on initial load
    if (isInitialLoad.current || !isDataLoaded.current) {
      return;
    }

    const currentData = {
      blocks: debouncedBlocks,
      submitButtonText: debouncedSubmitButtonText,
      formDesign: debouncedFormDesign,
      successBlocks: debouncedSuccessBlocks,
    };

    await saveToDatabase(currentData);
  }, [debouncedBlocks, debouncedSubmitButtonText, debouncedFormDesign, debouncedSuccessBlocks, saveToDatabase]);

  // Manual save function (uses current values, not debounced)
  const handleManualSave = useCallback(async () => {
    if (!hasUnsavedChanges || isSaving) return;

    const currentData = {
      blocks: blocks,
      submitButtonText: submitButtonText,
      formDesign: formDesign,
      successBlocks: successBlocks,
    };

    const success = await saveToDatabase(currentData);
    if (success) {
      console.log('✅ Manual save completed');
    }
  }, [hasUnsavedChanges, isSaving, blocks, submitButtonText, formDesign, successBlocks, saveToDatabase]);

  // Trigger auto-save when debounced values change
  useEffect(() => {
    autoSave();
  }, [autoSave]);

  // Mark as having unsaved changes when state changes (immediate feedback)
  useEffect(() => {
    // Only track changes after data is loaded and initial load is complete
    if (!isInitialLoad.current && isDataLoaded.current) {
      setHasUnsavedChanges(true);
    }
  }, [blocks, submitButtonText, formDesign, successBlocks]);

  // Save on page unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Save on visibility change (when user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasUnsavedChanges && !isSaving) {
        handleManualSave();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasUnsavedChanges, isSaving, handleManualSave]);

  // Load saved data when form changes
  useEffect(() => {
    if (form) {
      const formData = form.form_data || {};
      const settings = form.settings || {};
      const successMessage = form.success_message || [];
      
      if (formData.blocks) {
        setBlocks(formData.blocks);
      }
      
      if (successMessage.length > 0) {
        setSuccessBlocks(successMessage);
      }
      
      if (formData.submitButtonText) {
        setSubmitButtonText(formData.submitButtonText);
      }
      
      if (settings.formDesign) {
        setFormDesign(settings.formDesign);
      }

      // Initialize last save data reference
      const initialData = {
        blocks: formData.blocks || [],
        submitButtonText: formData.submitButtonText || 'Надіслати',
        formDesign: settings.formDesign || {
          backgroundColor: 'bg-white',
          textColor: 'text-foreground',
          fontSize: 'medium',
          formDisabled: true,
        },
        successBlocks: successMessage.length > 0 ? successMessage : [
          { id: 'success-heading', type: 'heading', label: 'Дякуємо!', textAlign: 'center' },
          { id: 'success-text', type: 'paragraph', label: 'Ми отримали вашу заявку.', textAlign: 'center' },
        ],
      };
      
      lastSaveDataRef.current = JSON.stringify(initialData);

      // Reset flags after data is loaded - use a longer timeout
      setTimeout(() => {
        isDataLoaded.current = true;
        isInitialLoad.current = false;
      }, 500);
    }
  }, [form, setBlocks]);

  const activeBlock = blocks.find((b) => b.id === activeBlockId) || null;
  const activeSuccessBlock = successBlocks.find((b) => b.id === activeSuccessBlockId) || null;

  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Success block handlers
  const addSuccessBlock = useCallback((type, index) => {
    const isTextBlock = ['heading', 'paragraph'].includes(type);
    const newBlock = {
      id: generateId(),
      type,
      ...getDefaultBlock(type),
      // Default to center alignment for text blocks in success page
      ...(isTextBlock ? { textAlign: 'center' } : {}),
    };

    setSuccessBlocks((prev) => {
      if (index !== undefined && index >= 0) {
        const newBlocks = [...prev];
        newBlocks.splice(index, 0, newBlock);
        return newBlocks;
      }
      return [...prev, newBlock];
    });

    setActiveSuccessBlockId(newBlock.id);
    setIsEditingSuccessBlock(true);
  }, []);

  const updateSuccessBlock = useCallback((id, updates) => {
    setSuccessBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updates } : block))
    );
  }, []);

  const deleteSuccessBlock = useCallback((id) => {
    setSuccessBlocks((prev) => prev.filter((block) => block.id !== id));
    if (activeSuccessBlockId === id) {
      setActiveSuccessBlockId(null);
      setIsEditingSuccessBlock(false);
    }
  }, [activeSuccessBlockId]);

  const duplicateSuccessBlock = useCallback((id) => {
    const block = successBlocks.find((b) => b.id === id);
    if (!block) return;

    const index = successBlocks.findIndex((b) => b.id === id);
    const newBlock = {
      ...block,
      id: generateId(),
      label: `${block.label} (copy)`,
    };

    setSuccessBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    setActiveSuccessBlockId(newBlock.id);
  }, [successBlocks]);

  const moveSuccessBlock = useCallback((fromIndex, toIndex) => {
    setSuccessBlocks((prev) => {
      const newBlocks = [...prev];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      return newBlocks;
    });
  }, []);

  // Оновлена функція видалення блоків з видаленням зображень
  const handleDeleteBlock = useCallback(async (blockId) => {
    const block = blocks.find(b => b.id === blockId);
    
    // Якщо це блок зображення і в ньому є зображення - видаляємо їх з R2
    if (block?.type === 'image' && block.images?.length > 0) {
      await deleteImagesFromR2(block.images);
    }
    
    deleteBlock(blockId);
    
    if (activeBlockId === blockId) {
      setShowBlockSettings(false);
    }
  }, [blocks, deleteBlock, activeBlockId, deleteImagesFromR2]);

  // Оновлена функція видалення success блоків з видаленням зображень
  const handleDeleteSuccessBlock = useCallback(async (blockId) => {
    const block = successBlocks.find(b => b.id === blockId);
    
    if (block?.type === 'image' && block.images?.length > 0) {
      await deleteImagesFromR2(block.images);
    }
    
    deleteSuccessBlock(blockId);
  }, [successBlocks, deleteSuccessBlock, deleteImagesFromR2]);

  const openBlockSettings = () => {
    setShowBlockSettings(true);
    setShowSubmitSettings(false);
    setIsEditingSuccessBlock(false);
  };

  const handleAddBlock = (type) => {
    addBlock(type);
    openBlockSettings();
  };

  const handleAddBlockAt = (type, index) => {
    addBlock(type, index);
    openBlockSettings();
  };

  const handleOpenSettings = (id) => {
    selectBlock(id);
    openBlockSettings();
  };

  const handleOpenAddBlock = () => {
    setShowBlockSettings(false);
    setShowSubmitSettings(false);
    setIsEditingSuccessBlock(false);
    setActiveTab('add');
  };

  const handleCloseBlockSettings = () => {
    setShowBlockSettings(false);
    setIsEditingSuccessBlock(false);
    clearSelection();
    setActiveSuccessBlockId(null);
    setActiveTab('add');
  };

  const handleSelectBlock = (id) => {
    selectBlock(id);
    setActiveSuccessBlockId(null);
    setIsEditingSuccessBlock(false);
    if (id) {
      openBlockSettings();
    }
  };

  const handleClearSelection = () => {
    clearSelection();
    setActiveSuccessBlockId(null);
    setShowBlockSettings(false);
    setShowSubmitSettings(false);
    setIsEditingSuccessBlock(false);
  };

  const handleUpdateDesign = (updates) => {
    setFormDesign((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmitButtonClick = () => {
    setShowSubmitSettings(true);
    setShowBlockSettings(false);
    setIsEditingSuccessBlock(false);
    clearSelection();
    setActiveSuccessBlockId(null);
  };

  // Success page block handlers
  const handleSelectSuccessBlock = (id) => {
    setActiveSuccessBlockId(id);
    selectBlock(null);
    setShowBlockSettings(false);
    setShowSubmitSettings(false);
    if (id) {
      setIsEditingSuccessBlock(true);
    }
  };

  const handleOpenSuccessSettings = (id) => {
    setActiveSuccessBlockId(id);
    selectBlock(null);
    setShowBlockSettings(false);
    setShowSubmitSettings(false);
    setIsEditingSuccessBlock(true);
  };

  const handleAddSuccessBlockAt = (type, index) => {
    addSuccessBlock(type, index);
  };

  const handleOpenAddSuccessBlock = () => {
    setShowBlockSettings(false);
    setShowSubmitSettings(false);
    setIsEditingSuccessBlock(false);
    setActiveTab('add');
  };

  const sidePanelContent = (
    <SidePanel
      activeTab={activeTab}
      onTabChange={setActiveTab}
      activeBlock={activeBlock}
      activeSuccessBlock={activeSuccessBlock}
      showBlockSettings={showBlockSettings}
      showSubmitSettings={showSubmitSettings}
      showSuccessBlockSettings={isEditingSuccessBlock}
      submitButtonText={submitButtonText}
      onSubmitButtonTextChange={setSubmitButtonText}
      onCloseBlockSettings={handleCloseBlockSettings}
      onCloseSubmitSettings={() => {
        setShowSubmitSettings(false);
        setActiveTab('add');
      }}
      onCloseSuccessBlockSettings={() => {
        setIsEditingSuccessBlock(false);
        setActiveSuccessBlockId(null);
        setActiveTab('add');
      }}
      onAddBlock={handleAddBlock}
      onUpdateBlock={(updates) => {
        if (activeBlockId) {
          updateBlock(activeBlockId, updates);
        }
      }}
      onUpdateSuccessBlock={(updates) => {
        if (activeSuccessBlockId) {
          updateSuccessBlock(activeSuccessBlockId, updates);
        }
      }}
      formDesign={formDesign}
      onUpdateDesign={handleUpdateDesign}
    />
  );

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header
        formName={form?.name}
        onTogglePreview={() => setIsPreview((v) => !v)}
        isSaving={isSaving}
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
        onManualSave={handleManualSave}
      />

      <div className="relative flex-1 overflow-hidden">
        {/* Canvas - full width with responsive padding to account for floating panel */}
        <Canvas
          blocks={blocks}
          activeBlockId={activeBlockId}
          formDesign={formDesign}
          submitButtonText={submitButtonText}
          successBlocks={successBlocks}
          activeSuccessBlockId={activeSuccessBlockId}
          onSelectBlock={handleSelectBlock}
          onClearSelection={handleClearSelection}
          onDeleteBlock={handleDeleteBlock}
          onDuplicateBlock={duplicateBlock}
          onOpenSettings={handleOpenSettings}
          onOpenAddBlock={handleOpenAddBlock}
          onAddBlockAt={handleAddBlockAt}
          onUpdateBlock={updateBlock}
          onMoveBlock={moveBlock}
          onSubmitButtonClick={handleSubmitButtonClick}
          isSubmitButtonSelected={showSubmitSettings}
          onSelectSuccessBlock={handleSelectSuccessBlock}
          onDeleteSuccessBlock={handleDeleteSuccessBlock}
          onDuplicateSuccessBlock={duplicateSuccessBlock}
          onOpenSuccessSettings={handleOpenSuccessSettings}
          onAddSuccessBlockAt={handleAddSuccessBlockAt}
          onUpdateSuccessBlock={updateSuccessBlock}
          onMoveSuccessBlock={moveSuccessBlock}
          onOpenAddSuccessBlock={handleOpenAddSuccessBlock}
        />

        {/* Desktop side panel */}
        <div className="hidden md:block absolute top-0 right-0 h-full z-10 pointer-events-none">
          <div className="pointer-events-auto h-full">
            {sidePanelContent}
          </div>
        </div>

        {/* Mobile side panel drawer */}
        {isMobile && (
          <MobileSidePanelDrawer>
            {sidePanelContent}
          </MobileSidePanelDrawer>
        )}

        {isPreview && (
          <Preview
            blocks={blocks}
            successBlocks={successBlocks}
            submitButtonText={submitButtonText}
            formDesign={formDesign}
            formSlug={form?.slug}
            onClose={() => setIsPreview(false)}
          />
        )}
      </div>
    </div>
  )
}
