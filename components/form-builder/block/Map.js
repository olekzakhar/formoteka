// components/form-builder/block/Map

'use client'

import { cn } from '@/utils';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import the actual map component with SSR disabled
const MapComponentDynamic = dynamic(
  () => import('@/components/form-builder/block/MapContainer'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center bg-muted/30 rounded-xl border border-border" style={{ height: 320 }}>
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    )
  }
);

export const BlockMap = ({
  block,
  onUpdateBlock,
  isPreview = false,
  onRequestSelect,
}) => {
  const height = block.mapHeight ?? 320;

  return (
    <MapComponentDynamic
      block={block}
      onUpdateBlock={onUpdateBlock}
      isPreview={isPreview}
      onRequestSelect={onRequestSelect}
    />
  );
};
