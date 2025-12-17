'use client'

import { useState } from 'react';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import { FormCanvas } from './FormCanvas';
import { SidePanel } from './SidePanel';
import { FormHeader } from './FormHeader';
import { FormPreview } from './FormPreview';

export const FormBuilder = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [showBlockSettings, setShowBlockSettings] = useState(false);
  const [formDesign, setFormDesign] = useState({
    backgroundColor: 'bg-background',
    textColor: 'text-foreground',
    fontSize: 'medium',
  });
  
  const {
    blocks,
    activeBlockId,
    activeTab = 'add' || 'design',
    setActiveTab,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    selectBlock,
    clearSelection,
  } = useFormBuilder();

  const activeBlock = blocks.find((b) => b.id === activeBlockId) || null;

  const handleAddBlock = (type) => {
    addBlock(type);
  };

  const handleAddBlockAt = (type, index) => {
    addBlock(type, index);
  };

  const handleOpenSettings = (id) => {
    selectBlock(id);
    setShowBlockSettings(true);
  };

  const handleOpenAddBlock = () => {
    setShowBlockSettings(false);
    setActiveTab('add');
  };

  const handleCloseBlockSettings = () => {
    setShowBlockSettings(false);
    clearSelection();
  };

  const handleSelectBlock = (id) => {
    selectBlock(id);
    if (id) {
      setShowBlockSettings(true);
    }
  };

  const handleClearSelection = () => {
    clearSelection();
    setShowBlockSettings(false);
  };

  const handleUpdateDesign = (updates) => {
    setFormDesign((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <FormHeader isPreview={isPreview} onTogglePreview={() => setIsPreview(!isPreview)} />
      
      <div className="flex flex-1 overflow-hidden">
        {isPreview ? (
          <FormPreview blocks={blocks} />
        ) : (
          <>
            <FormCanvas
              blocks={blocks}
              activeBlockId={activeBlockId}
              onSelectBlock={handleSelectBlock}
              onClearSelection={handleClearSelection}
              onDeleteBlock={deleteBlock}
              onDuplicateBlock={duplicateBlock}
              onOpenSettings={handleOpenSettings}
              onOpenAddBlock={handleOpenAddBlock}
              onAddBlockAt={handleAddBlockAt}
              onUpdateBlock={updateBlock}
            />
            <SidePanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeBlock={activeBlock}
              showBlockSettings={showBlockSettings}
              onCloseBlockSettings={handleCloseBlockSettings}
              onAddBlock={handleAddBlock}
              onUpdateBlock={(updates) => {
                if (activeBlockId) {
                  updateBlock(activeBlockId, updates);
                }
              }}
              formDesign={formDesign}
              onUpdateDesign={handleUpdateDesign}
            />
          </>
        )}
      </div>
    </div>
  );
};
