// SortablePanel.tsx - Wrapper for panel that makes it sortable
'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IPanelForTabBarAndTabContentWithResize from './IPanelForTabBarAndTabContentWithResize';
import { PanelState } from '@/shared/model/tab-admin/store';

interface SortablePanelProps {
    id: string;
    panel: PanelState;
    panelSize: { width?: string | number; height?: string | number };
    screenCount: number;
    isLastPanel: boolean;
    isPanelHovered: boolean;
    handleResizeStop: (panelId: string, size: { width: number; height: number }) => void;
    setHoveredPanel: (panelId: string | null) => void;
    onRemovePanel: () => void;
}

const SortablePanel: React.FC<SortablePanelProps> = ({
    id,
    panel,
    panelSize,
    screenCount,
    isLastPanel,
    isPanelHovered,
    handleResizeStop,
    setHoveredPanel,
    onRemovePanel
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <IPanelForTabBarAndTabContentWithResize
                panel={panel}
                panelSize={panelSize}
                screenCount={screenCount}
                isLastPanel={isLastPanel}
                isPanelHovered={isPanelHovered}
                handleResizeStop={handleResizeStop}
                setHoveredPanel={setHoveredPanel}
                onRemovePanel={onRemovePanel}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
};

export default SortablePanel;