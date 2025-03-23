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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import IPanelForTabBarAndTabContentWithResize from './ui/IPanelForTabBarAndTabContentWithResize';
import { TabBarWithDndKit } from './ui/TabBarWithDndKit';

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
        updateSplitScreenCount,
        removePanel,
    } = useTabBarStore();

    const [activeTab, setActiveDragTab] = useState<Tab | null>(null);
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const [panelSizes, setPanelSizes] = useState<Record<string, { width?: string | number; height?: string | number }>>({});
    const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

    useEffect(() => {
        setPanelSizes({});
    }, [screenCount]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const { tab, panelId } = active.data.current || {};
        if (tab && panelId) {
            setActiveDragTab(tab);
            setActivePanel(panelId);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        // 필요 시 구현
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !active.data.current) {
            setActiveDragTab(null);
            setActivePanel(null);
            return;
        }

        const sourceTabId = active.id as string;
        const sourcePanelId = active.data.current.panelId;
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
        setActiveDragTab(null);
        setActivePanel(null);
    };

    const handleRemovePanel = (panelId: string) => {
        removePanel(panelId);
    };

    const handleResizeStop = (panelId: string, size: { width: number; height: number }) => {
        const newSizes = { ...panelSizes, [panelId]: size };
        setPanelSizes(newSizes);
    };

    const renderPanel = (panel: PanelState) => {
        const ActiveTabContent = panel.activeTabId
            ? panel.tabs.find((tab) => tab.id === panel.activeTabId)?.component
            : null;

        return (
            <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <TabBarWithDndKit
                    panel={panel}
                    onRemovePanel={() => handleRemovePanel(panel.id)}
                    showRemoveButton={screenCount > 1}
                />
                <div className="flex-1 overflow-auto p-4" data-panel-id={panel.id}>
                    {ActiveTabContent ? (
                        <ActiveTabContent />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <p>콘텐츠를 선택해주세요</p>
                        </div>
                    )}
                </div>
            </div>
        );
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
                renderPanel(panels[0])
            ) : (
                <div className="w-full h-full">
                    <div className="flex w-full h-full">
                        {panels.map((panel, index) => {
                            const isLastPanel = index === panels.length - 1;
                            const savedSize = panelSizes[panel.id] || {};
                            const width = savedSize.width;
                            const height = savedSize.height || '100%';
                            return (
                                <IPanelForTabBarAndTabContentWithResize
                                    key={panel.id}
                                    panel={panel}
                                    panelSize={{ width, height }}
                                    screenCount={screenCount}
                                    isLastPanel={isLastPanel}
                                    isPanelHovered={hoveredPanel === panel.id}
                                    handleResizeStop={handleResizeStop}
                                    setHoveredPanel={setHoveredPanel}
                                >
                                    {renderPanel(panel)}
                                </IPanelForTabBarAndTabContentWithResize>
                            );
                        })}
                    </div>
                </div>
            )}

            <DragOverlay dropAnimation={dropAnimation}>
                {activeTab && (
                    <div className="flex items-center px-3 py-1.5 h-8 border border-blue-400 bg-blue-50 rounded-md min-w-[120px] shadow-lg">
                        <span className="text-xs font-medium truncate flex-1">
                            {activeTab.label}
                        </span>
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}

export default TabContentWithTabBar;
