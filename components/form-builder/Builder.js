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
  const [formName, setFormName] = useState(form?.name ?? 'Без назви');
  const isMobile = useIsMobile();
  const [isPreview, setIsPreview] = useState(false);
  const [showBlockSettings, setShowBlockSettings] = useState(false);
  const [showSubmitSettings, setShowSubmitSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentPageMode, setCurrentPageMode] = useState('form');
  const supabase = createClient();

  // Parse saved data from database
  const savedFormData = form?.form_data || {};
  const savedSettings = form?.settings || {};
  const savedSuccessMessage = form?.success_message || [];

  // Separate state for is_public
  const [isPublic, setIsPublic] = useState(form?.is_public ?? false);

  // Initialize state with saved data
  const [submitButtonText, setSubmitButtonText] = useState(
    savedFormData.submitButtonText || 'Надіслати'
  )

  const [formDesign, setFormDesign] = useState(
    savedSettings.design || {
      backgroundColor: '#FFFFFF',
      textColor: '#131720', // text-foreground
      headingColor: '#131720', // text-foreground
      headingSize: '20px',
      fontSize: '16px',
      stickyButton: false,
      accentColor: '#000000',
      inputColor: '#e5e7eb',
      inputBgColor: 'transparent',
    }
  );

  const [formSeo, setFormSeo] = useState(
    savedSettings.seo || {
      title: '',
      description: ''
    }
  )

  const [deliveryTargets, setDeliveryTargets] = useState(
    savedSettings.delivery || {
      mode: 'email',
      email: '',
      telegram: { enabled: true, handle: '' },
      viber: { enabled: false, handle: '' },
      instagram: { enabled: false, handle: '' }
    }
  )

  // Success page blocks state with icon block as first element
  const [successBlocks, setSuccessBlocks] = useState(
    savedSuccessMessage.length > 0 ? savedSuccessMessage : [
      { 
        id: 'success-icon', 
        type: 'icon', 
        label: 'Icon',
        iconName: 'CheckCircle',
        iconSize: 32,
        iconColor: 'rgba(255,255,255,0.85)',
        iconBgColor: 'rgba(0,0,0,0.20)',
        iconBgPadding: 16,
        iconBgShape: 'circle',
      },
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
  const debouncedFormName = useDebounce(formName, 3000);
  const debouncedBlocks = useDebounce(blocks, 3000);
  const debouncedSubmitButtonText = useDebounce(submitButtonText, 3000);
  const debouncedFormDesign = useDebounce(formDesign, 3000);
  const debouncedSuccessBlocks = useDebounce(successBlocks, 3000);
  const debouncedFormSeo = useDebounce(formSeo, 3000);
  const debouncedDeliveryTargets = useDebounce(deliveryTargets, 3000);
  const debouncedIsPublic = useDebounce(isPublic, 3000);

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
  // FIXED: Removed all state dependencies to prevent infinite loops
  const saveToDatabase = useCallback(async (dataToSave) => {
    if (!form?.slug || !form?.user_id) return false;

    // dataToSave now contains all the data we need
    const dataString = JSON.stringify(dataToSave);
    if (lastSaveDataRef.current === dataString) {
      return false; // No changes, skip save
    }

    setIsSaving(true);
    setHasUnsavedChanges(false);

    try {
      const result = await updateFormData(supabase, form.slug, form.user_id, dataToSave);

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
  }, [form?.slug, form?.user_id, supabase]);

  // Manual save function (uses current values, not debounced)
  const handleManualSave = useCallback(async () => {
    if (!hasUnsavedChanges || isSaving) return;

    const currentData = {
      formName: formName,
      blocks: blocks,
      submitButtonText: submitButtonText,
      formDesign: formDesign,
      successBlocks: successBlocks,
      formSeo: formSeo,
      deliveryTargets: deliveryTargets,
      isPublic: isPublic,
    };

    const success = await saveToDatabase(currentData);
    if (success) {
      console.log('✅ Manual save completed');
    }
  }, [hasUnsavedChanges, isSaving, formName, blocks, submitButtonText, formDesign, successBlocks, formSeo, deliveryTargets, isPublic, saveToDatabase]);

  // FIXED: Auto-save effect - removed autoSave callback dependency
  useEffect(() => {
    // Skip saving on initial load
    if (isInitialLoad.current || !isDataLoaded.current) {
      return;
    }

    const currentData = {
      formName: debouncedFormName,
      blocks: debouncedBlocks,
      submitButtonText: debouncedSubmitButtonText,
      formDesign: debouncedFormDesign,
      successBlocks: debouncedSuccessBlocks,
      formSeo: debouncedFormSeo,
      deliveryTargets: debouncedDeliveryTargets,
      isPublic: debouncedIsPublic,
    };

    saveToDatabase(currentData);
  }, [
    debouncedFormName, 
    debouncedBlocks, 
    debouncedSubmitButtonText, 
    debouncedFormDesign, 
    debouncedSuccessBlocks, 
    debouncedFormSeo, 
    debouncedDeliveryTargets,
    debouncedIsPublic,
    saveToDatabase
  ]);

  // Mark as having unsaved changes when state changes (immediate feedback)
  useEffect(() => {
    // Only track changes after data is loaded and initial load is complete
    if (!isInitialLoad.current && isDataLoaded.current) {
      setHasUnsavedChanges(true);
    }
  }, [formName, blocks, submitButtonText, formDesign, successBlocks, formSeo, deliveryTargets, isPublic]);

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
      
      // Load form name
      if (form.name) {
        setFormName(form.name);
      }

      // Load is_public
      if (form.is_public !== undefined) {
        setIsPublic(form.is_public);
      }
      
      if (formData.blocks) {
        setBlocks(formData.blocks);
      }
      
      if (successMessage.length > 0) {
        setSuccessBlocks(successMessage);
      }
      
      if (formData.submitButtonText) {
        setSubmitButtonText(formData.submitButtonText);
      }

      if (settings.design) {
        setFormDesign(settings.design);
      }

      if (settings.seo) {
        setFormSeo(settings.seo);
      }

      if (settings.delivery) {
        setDeliveryTargets(settings.delivery);
      }

      // Initialize last save data reference
      const initialData = {
        formName: form.name || 'Без назви',
        blocks: formData.blocks || [],
        submitButtonText: formData.submitButtonText || 'Надіслати',
        formDesign: settings.design || {
          backgroundColor: '#FFFFFF',
          textColor: '#131720', // text-foreground
          headingColor: '#131720', // text-foreground
          headingSize: '20px',
          fontSize: '16px',
          stickyButton: false,
          accentColor: '#000000',
          inputColor: '#e5e7eb',
          inputBgColor: 'transparent',
        },
        successBlocks: successMessage.length > 0 ? successMessage : [
          { 
            id: 'success-icon', 
            type: 'icon', 
            label: 'Icon',
            iconName: 'CheckCircle',
            iconSize: 32,
            iconColor: 'rgba(255,255,255,0.85)',
            iconBgColor: 'rgba(0,0,0,0.20)',
            iconBgPadding: 16,
            iconBgShape: 'circle',
          },
          { id: 'success-heading', type: 'heading', label: 'Дякуємо!', textAlign: 'center' },
          { id: 'success-text', type: 'paragraph', label: 'Ми отримали вашу заявку.', textAlign: 'center' },
        ],
        formSeo: settings.seo || {
          title: '',
          description: '',
        },
        deliveryTargets: settings.delivery || {
          mode: 'email',
          email: '',
          telegram: { enabled: true, handle: '' },
          viber: { enabled: false, handle: '' },
          instagram: { enabled: false, handle: '' },
        },
        isPublic: form.is_public ?? false,
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

  // ОНОВЛЕНА ФУНКЦІЯ: Тепер перевіряє currentPageMode і додає блок у правильне місце
  const handleAddBlock = useCallback((type, index) => {
    if (currentPageMode === 'success') {
      addSuccessBlock(type, index)
      setIsEditingSuccessBlock(true)
    } else {
      addBlock(type, index)
      openBlockSettings()
    }
  }, [currentPageMode, addSuccessBlock, addBlock])

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
    setShowSubmitSettings(false);
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

  useEffect(() => {
    // Apply SEO settings to the current document head (SPA).
    const nextTitle = (formSeo.title || '').trim() || formName;
    if (nextTitle) document.title = nextTitle;

    const ensureMetaByName = (name) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      return el;
    };

    const ensureMetaByProp = (property) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      return el;
    };

    const desc = (formSeo.description || '').trim();
    if (desc) {
      ensureMetaByName('description').content = desc;
      ensureMetaByProp('og:description').content = desc;
    }

    if (nextTitle) {
      ensureMetaByProp('og:title').content = nextTitle;
    }

  }, [formSeo.title, formSeo.description, formName]);

  // FIXED: Auto-add/remove messenger-select block - removed blocks and updateBlock from dependencies
  useEffect(() => {
    if (deliveryTargets.mode !== 'messengers') {
      // Remove messenger-select block if email mode
      setBlocks(prev => {
        const hasMessengerBlock = prev.some(b => b.type === 'messenger-select');
        if (hasMessengerBlock) {
          return prev.filter(b => b.type !== 'messenger-select');
        }
        return prev;
      });
      return;
    }

    const enabledMessengers = [];
    if (deliveryTargets.telegram.enabled) {
      enabledMessengers.push({ type: 'telegram', handle: deliveryTargets.telegram.handle });
    }
    if (deliveryTargets.viber.enabled) {
      enabledMessengers.push({ type: 'viber', handle: deliveryTargets.viber.handle });
    }
    if (deliveryTargets.instagram.enabled) {
      enabledMessengers.push({ type: 'instagram', handle: deliveryTargets.instagram.handle });
    }

    if (enabledMessengers.length >= 2) {
      // Need messenger-select block
      setBlocks(prev => {
        const existingMessengerBlock = prev.find(b => b.type === 'messenger-select');
        
        if (existingMessengerBlock) {
          // Update existing block with new options
          return prev.map(block => 
            block.id === existingMessengerBlock.id 
              ? { ...block, messengerOptions: enabledMessengers }
              : block
          );
        } else {
          // Add new messenger-select block before submit button (at end of blocks)
          const newBlock = {
            id: `block-${Date.now()}-messenger`,
            type: 'messenger-select',
            label: 'Замовити через',
            messengerOptions: enabledMessengers,
          };
          return [...prev, newBlock];
        }
      });
    } else {
      // Remove messenger-select block if only 1 or 0 messengers
      setBlocks(prev => prev.filter(b => b.type !== 'messenger-select'));
    }
  }, [deliveryTargets, setBlocks]);

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

  const handleOpenAddSuccessBlock = () => {
    setShowBlockSettings(false);
    setShowSubmitSettings(false);
    setIsEditingSuccessBlock(false);
    setActiveTab('add');
  };

  const handlePageModeChange = (mode) => {
    setCurrentPageMode(mode)
  }

  const hasLineItemsBlock = blocks.some((b) => b.type === 'line-items');

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
      formSeo={formSeo}
      onUpdateSeo={(updates) => setFormSeo((prev) => ({ ...prev, ...updates }))}
      deliveryTargets={deliveryTargets}
      onUpdateDeliveryTargets={(updates) => setDeliveryTargets((prev) => ({ ...prev, ...updates }))}
      isPublic={isPublic}
      onUpdateIsPublic={setIsPublic}
      hasLineItemsBlock={hasLineItemsBlock}
      onOpenSubmitSettings={handleSubmitButtonClick}
    />
  );

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header
        formSlug={form?.slug}
        formName={formName}
        setFormName={setFormName}
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
          onUpdateBlock={updateBlock}
          onMoveBlock={moveBlock}
          onSubmitButtonClick={handleSubmitButtonClick}
          isSubmitButtonSelected={showSubmitSettings}
          onSelectSuccessBlock={handleSelectSuccessBlock}
          onDeleteSuccessBlock={handleDeleteSuccessBlock}
          onDuplicateSuccessBlock={duplicateSuccessBlock}
          onOpenSuccessSettings={handleOpenSuccessSettings}
          onUpdateSuccessBlock={updateSuccessBlock}
          onMoveSuccessBlock={moveSuccessBlock}
          onOpenAddSuccessBlock={handleOpenAddSuccessBlock}
          onPageModeChange={handlePageModeChange}
          onAddBlock={handleAddBlock}
        />

        {/* Desktop side panel */}
        <div id="side-panel" className="hidden md:block absolute top-0 right-0 h-full z-10 pointer-events-none">
          <div className="pointer-events-auto h-full">
            {sidePanelContent}
          </div>
        </div>

        {/* Mobile side panel drawer */}
        {isMobile && (
          <MobileSidePanelDrawer
            isSettingsBlockMode={showBlockSettings || showSubmitSettings || isEditingSuccessBlock}
          >
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
