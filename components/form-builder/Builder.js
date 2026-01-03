// components/form-builder/Builder

'use client'

import { useState, useCallback } from 'react';
import { useBuilder } from '@/hooks/useBuilder';
import { FormCanvas } from './FormCanvas';
import { SidePanel } from './SidePanel';
import { FormHeader } from './FormHeader';
import { FormPreview } from './FormPreview';
import { MobileSidePanelDrawer } from './MobileSidePanelDrawer';
import { getDefaultBlock } from '@/data/block-definitions';
import { useIsMobile } from '@/hooks/use-mobile';

export const Builder = ({ form }) => {
  const isMobile = useIsMobile();
  const [isPreview, setIsPreview] = useState(false);
  const [showBlockSettings, setShowBlockSettings] = useState(false);
  const [showSubmitSettings, setShowSubmitSettings] = useState(false);
  // const [formName, setFormName] = useState('Без назви');
  const [submitButtonText, setSubmitButtonText] = useState('Надіслати');
  const [formDesign, setFormDesign] = useState({
    backgroundColor: 'bg-white',
    textColor: 'text-foreground',
    fontSize: 'medium',
    formDisabled: true,
  });

  // Success page blocks state
  const [successBlocks, setSuccessBlocks] = useState([
    { id: 'success-heading', type: 'heading', label: 'Дякуємо!', textAlign: 'center' },
    { id: 'success-text', type: 'paragraph', label: 'Ми отримали вашу заявку.', textAlign: 'center' },
  ]);
  const [activeSuccessBlockId, setActiveSuccessBlockId] = useState(null);
  const [isEditingSuccessBlock, setIsEditingSuccessBlock] = useState(false);

  const {
    blocks,
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
  } = useBuilder();

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
        // onFormNameChange={setFormName}
        onTogglePreview={() => setIsPreview((v) => !v)}
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
            formName={form?.name}
            onClose={() => setIsPreview(false)}
          />
        )}
      </div>
    </div>
  )
}
