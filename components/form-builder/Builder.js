// components/form-builder/Builder

'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import { useBuilder } from '@/hooks/useBuilder';
import { FormCanvas } from './FormCanvas';
import { SidePanel } from './SidePanel';
import { FormHeader } from './FormHeader';
import { FormPreview } from './FormPreview';
import { MobileSidePanelDrawer } from './MobileSidePanelDrawer';
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
  const saveTimeoutRef = useRef(null);
  const lastSaveDataRef = useRef(null);

  // Debounce with longer delay (3 seconds instead of 1)
  const debouncedBlocks = useDebounce(blocks, 3000);
  const debouncedSubmitButtonText = useDebounce(submitButtonText, 3000);
  const debouncedFormDesign = useDebounce(formDesign, 3000);
  const debouncedSuccessBlocks = useDebounce(successBlocks, 3000);

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
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
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
    if (!isInitialLoad.current) {
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
      lastSaveDataRef.current = JSON.stringify({
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
      });

      // Reset initial load flag after data is loaded
      setTimeout(() => {
        isInitialLoad.current = false;
      }, 100);
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
      <FormHeader
        formName={form?.name}
        onTogglePreview={() => setIsPreview((v) => !v)}
        isSaving={isSaving}
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
        onManualSave={handleManualSave}
      />

      <div className="flex flex-1 overflow-hidden">
        <FormCanvas
          blocks={blocks}
          activeBlockId={activeBlockId}
          formDesign={formDesign}
          submitButtonText={submitButtonText}
          successBlocks={successBlocks}
          activeSuccessBlockId={activeSuccessBlockId}
          onSelectBlock={handleSelectBlock}
          onClearSelection={handleClearSelection}
          onDeleteBlock={deleteBlock}
          onDuplicateBlock={duplicateBlock}
          onOpenSettings={handleOpenSettings}
          onOpenAddBlock={handleOpenAddBlock}
          onAddBlockAt={handleAddBlockAt}
          onUpdateBlock={updateBlock}
          onMoveBlock={moveBlock}
          onSubmitButtonClick={handleSubmitButtonClick}
          isSubmitButtonSelected={showSubmitSettings}
          onSelectSuccessBlock={handleSelectSuccessBlock}
          onDeleteSuccessBlock={deleteSuccessBlock}
          onDuplicateSuccessBlock={duplicateSuccessBlock}
          onOpenSuccessSettings={handleOpenSuccessSettings}
          onAddSuccessBlockAt={handleAddSuccessBlockAt}
          onUpdateSuccessBlock={updateSuccessBlock}
          onMoveSuccessBlock={moveSuccessBlock}
          onOpenAddSuccessBlock={handleOpenAddSuccessBlock}
        />

        {/* Desktop side panel */}
        <div className="hidden md:block">
          {sidePanelContent}
        </div>

        {/* Mobile side panel drawer */}
        {isMobile && (
          <MobileSidePanelDrawer>
            {sidePanelContent}
          </MobileSidePanelDrawer>
        )}

        {isPreview && (
          <FormPreview
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
