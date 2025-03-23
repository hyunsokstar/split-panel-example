// C:\Users\terec\boiler-plate\boiler-for-rdd\src\widgets\TabContentWithTabBar\index.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTabBarStore, type PanelState, Tab } from '@/shared/model/tab-admin/store';
import {
    DndContext,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
    defaultDropAnimation,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    arrayMove,
} from '@dnd-kit/sortable';
import SortablePanel from './ui/sortablepanel';

const dropAnimation = {
    ...defaultDropAnimation,
    sideEffects: ({ active }: { active: { node: HTMLElement } }) => {
        active.node.style.opacity = '0.5';
        return () => {
            active.node.style.opacity = '';
        };
    },
};

export function TabContentWithTabBar() {
    const {
        panels,
        screenCount,
        isSplitScreen,
        moveTab,
        reorderPanels,
        updateSplitScreenCount,
        removePanel,
    } = useTabBarStore();

    const [activeTab, setActiveDragTab] = useState<Tab | null>(null);
    const [activePanel, setActivePanel] = useState<PanelState | null>(null);
    const [panelSizes, setPanelSizes] = useState<Record<string, { width?: string | number; height?: string | number }>>({});
    const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    // 화면 분할 개수가 바뀌면 기존 사이즈 초기화 (항상 균등 분할)
    useEffect(() => {
        setPanelSizes({});
    }, [screenCount]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);

        // Handle tab dragging
        const { tab, panelId, type } = active.data.current || {};

        if (type === 'panel') {
            const draggedPanel = panels.find(p => p.id === active.id);
            if (draggedPanel) {
                setActivePanel(draggedPanel);
            }
        } else if (tab && panelId) {
            setActiveDragTab(tab);
            setActivePanel(null);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        // 필요 시 구현
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Reset active states
        setActiveId(null);
        setActiveDragTab(null);
        setActivePanel(null);

        if (!over || !active.data.current) return;

        const activeData = active.data.current;

        // Handle panel reordering
        if (activeData.type === 'panel' && over.data.current?.type === 'panel') {
            const activeId = active.id as string;
            const overId = over.id as string;

            if (activeId !== overId) {
                reorderPanels(activeId, overId);
            }
            return;
        }

        // Handle tab movement
        const sourceTabId = active.id as string;
        const sourcePanelId = activeData.panelId;
        let targetPanelId = sourcePanelId;

        if (over.data.current?.panelId) {
            targetPanelId = over.data.current.panelId;
        } else if (over.data.current?.type === 'panel-area') {
            const match = (over.id as string).match(/droppable-(.+)/);
            if (match && match[1]) {
                targetPanelId = match[1];
            }
        }

        if (sourcePanelId !== targetPanelId) {
            moveTab(sourceTabId, sourcePanelId, targetPanelId);
        }
    };

    const handleRemovePanel = (panelId: string) => {
        removePanel(panelId);
    };

    const handleResizeStop = (panelId: string, size: { width: number; height: number }) => {
        const newSizes = { ...panelSizes, [panelId]: size };
        setPanelSizes(newSizes);
    };

    if (panels.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <p className="text-xl">환영합니다</p>
                    <p className="mt-2">좌측 메뉴에서 원하는 기능을 선택하세요</p>
                </div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {!isSplitScreen ? (
                <SortablePanel
                    panel={panels[0]}
                    panelSize={panelSizes[panels[0].id] || {}}
                    screenCount={screenCount}
                    isLastPanel={true}
                    isPanelHovered={hoveredPanel === panels[0].id}
                    handleResizeStop={handleResizeStop}
                    setHoveredPanel={setHoveredPanel}
                    onRemovePanel={() => handleRemovePanel(panels[0].id)}
                />
            ) : (
                <div className="w-full h-full">
                    <SortableContext
                        items={panels.map(panel => panel.id)}
                    >
                        <div className="flex w-full h-full">
                            {panels.map((panel, index) => {
                                const isLastPanel = index === panels.length - 1;
                                const savedSize = panelSizes[panel.id] || {};
                                const width = savedSize.width;
                                const height = savedSize.height || '100%';

                                return (
                                    <SortablePanel
                                        key={panel.id}
                                        panel={panel}
                                        panelSize={{ width, height }}
                                        screenCount={screenCount}
                                        isLastPanel={isLastPanel}
                                        isPanelHovered={hoveredPanel === panel.id}
                                        handleResizeStop={handleResizeStop}
                                        setHoveredPanel={setHoveredPanel}
                                        onRemovePanel={() => handleRemovePanel(panel.id)}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                </div>
            )}

            <DragOverlay dropAnimation={dropAnimation}>
                {activeTab && (
                    <div className="flex items-center px-3 py-1.5 h-8 border border-blue-400 bg-blue-50 rounded-md min-w-[120px] shadow-lg">
                        <span className="text-xs font-medium truncate flex-1">{activeTab.label}</span>
                    </div>
                )}
                {activePanel && (
                    <div className="border-2 border-blue-400 bg-blue-50/20 rounded-md shadow-lg h-full w-[300px]">
                        <div className="h-10 bg-blue-100 border-b border-blue-300 flex items-center px-3">
                            <span className="text-sm font-medium">패널 이동 중...</span>
                        </div>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}

export default TabContentWithTabBar;