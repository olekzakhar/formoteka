// hooks/useFormBuilder

import { useState, useCallback } from 'react';
import { getDefaultBlock } from '@/data/block-definitions';

export const useFormBuilder = () => {
  const [blocks, setBlocks] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [activeTab, setActiveTab] = useState('add');

  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addBlock = useCallback((type, index) => {
    const newBlock = {
      id: generateId(),
      type,
      ...getDefaultBlock(type),
    };

    setBlocks((prev) => {
      if (index !== undefined && index >= 0) {
        const newBlocks = [...prev];
        newBlocks.splice(index, 0, newBlock);
        return newBlocks;
      }
      return [...prev, newBlock];
    });

    // ❌ ПРИБРАТИ ЦЕЙ РЯДОК:
    // setActiveBlockId(newBlock.id);
  }, []);

  const updateBlock = useCallback((id, updates) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updates } : block))
    );
  }, []);

  const deleteBlock = useCallback((id) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
    if (activeBlockId === id) {
      setActiveBlockId(null);
      setActiveTab('add');
    }
  }, [activeBlockId]);

  const duplicateBlock = useCallback((id) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;

    const index = blocks.findIndex((b) => b.id === id);
    const newBlock = {
      ...block,
      id: generateId(),
      label: `${block.label} (copy)`,
    };

    setBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    // ❌ ПРИБРАТИ ЦЕЙ РЯДОК:
    // setActiveBlockId(newBlock.id);
  }, [blocks]);

  const moveBlock = useCallback((fromIndex, toIndex) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      return newBlocks;
    });
  }, []);

  const selectBlock = useCallback((id) => {
    setActiveBlockId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setActiveBlockId(null);
    setActiveTab('add');
  }, []);

  return {
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
  };
};
