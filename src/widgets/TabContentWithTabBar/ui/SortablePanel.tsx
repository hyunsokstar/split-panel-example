'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PanelState } from '@/shared/model/tab-admin/store';
import IPanelForTabBarAndTabContentWithResize from './IPanelForTabBarAndTabContentWithResize';

interface SortablePanelProps {
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
    panel,
    panelSize,
    screenCount,
    isLastPanel,
    isPanelHovered,
    handleResizeStop,
    setHoveredPanel,
    onRemovePanel,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: panel.id,
        data: {
            type: 'panel',
            panel,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="h-full"
            data-panel-id={panel.id}
        >
            <IPanelForTabBarAndTabContentWithResize
                panel={panel}
                panelSize={panelSize}
                screenCount={screenCount}
                isLastPanel={isLastPanel}
                isPanelHovered={isPanelHovered}
                handleResizeStop={handleResizeStop}
                setHoveredPanel={setHoveredPanel}
                onRemovePanel={onRemovePanel}
                dragHandleListeners={listeners}
                dragHandleAttributes={attributes}
            />
        </div>
    );
};

export default SortablePanel;