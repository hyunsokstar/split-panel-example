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
        reorderTabs,
        updateSplitScreenCount,
        removePanel,
    } = useTabBarStore();

    const [activeTab, setActiveDragTab] = useState<Tab | null>(null);
    const [activePanel, setActivePanel] = useState<PanelState | null>(null);
    const [panelSizes, setPanelSizes] = useState<Record<string, { width?: string | number; height?: string | number }>>({});
    const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activePanelId, setActivePanelId] = useState<string | null>(null);

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
            setActivePanelId(panelId);
            console.log(`Drag started: tab ${tab.id} from panel ${panelId}`);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        // 디버깅용 로그
        if (process.env.NODE_ENV === 'development') {
            const { active, over } = event;
            if (over && active.data.current?.type === 'tab') {
                console.log(`Dragging over:`, {
                    activeId: active.id,
                    activeType: active.data.current.type,
                    activePanel: active.data.current.panelId,
                    overId: over.id,
                    overType: over.data.current?.type,
                    overPanel: over.data.current?.panelId
                });
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (process.env.NODE_ENV === 'development') {
            console.log("Drag end:", {
                activeId: active.id,
                activeData: active.data.current,
                overId: over?.id,
                overData: over?.data.current
            });
        }

        // Reset active states
        const resetStates = () => {
            setActiveId(null);
            setActiveDragTab(null);
            setActivePanel(null);
            setActivePanelId(null);
        };

        if (!over || !active.data.current) {
            resetStates();
            return;
        }

        const activeData = active.data.current;

        // 패널 순서 변경 처리
        if (activeData.type === 'panel' && over.data.current?.type === 'panel') {
            const activeId = active.id as string;
            const overId = over.id as string;

            if (activeId !== overId) {
                reorderPanels(activeId, overId);
            }
            resetStates();
            return;
        }

        // 탭 이동 또는 순서 변경 처리
        if (activeData.type === 'tab') {
            const sourceTabId = active.id as string;
            const sourcePanelId = activeData.panelId;

            // 같은 패널 내 탭 순서 변경 (두 탭 간)
            if (over.data.current?.type === 'tab') {
                const overTabId = over.id as string;
                const overPanelId = over.data.current.panelId;

                if (sourcePanelId === overPanelId && sourceTabId !== overTabId) {
                    // 같은 패널 내 순서 변경
                    const panelToReorder = panels.find(p => p.id === sourcePanelId);

                    if (panelToReorder) {
                        const tabIds = panelToReorder.tabs.map(tab => tab.id);
                        const newOrder = [...tabIds];

                        const activeIndex = newOrder.indexOf(sourceTabId);
                        const overIndex = newOrder.indexOf(overTabId);

                        if (activeIndex !== -1 && overIndex !== -1) {
                            const [movedItem] = newOrder.splice(activeIndex, 1);
                            newOrder.splice(overIndex, 0, movedItem);

                            console.log(`Reordering tabs in panel ${sourcePanelId}:`, newOrder);
                            reorderTabs(sourcePanelId, newOrder);
                        }
                    }
                }
                // 다른 패널로 이동
                else if (sourcePanelId !== overPanelId) {
                    console.log(`Moving tab ${sourceTabId} from panel ${sourcePanelId} to panel ${overPanelId}`);
                    moveTab(sourceTabId, sourcePanelId, overPanelId);
                }
            }
            // 패널 영역으로 이동
            else if (over.data.current?.type === 'panel-area') {
                const targetPanelId = over.data.current.panelId;

                if (targetPanelId && sourcePanelId !== targetPanelId) {
                    console.log(`Moving tab ${sourceTabId} from panel ${sourcePanelId} to panel ${targetPanelId}`);
                    moveTab(sourceTabId, sourcePanelId, targetPanelId);
                }
            }
            // droppable- ID로 시작하는 패널 영역으로 이동
            else if (typeof over.id === 'string' && over.id.startsWith('droppable-')) {
                const targetPanelId = over.id.substring(10); // 'droppable-' 이후 문자열

                if (targetPanelId && sourcePanelId !== targetPanelId) {
                    console.log(`Moving tab ${sourceTabId} from panel ${sourcePanelId} to panel ${targetPanelId}`);
                    moveTab(sourceTabId, sourcePanelId, targetPanelId);
                }
            }
        }

        resetStates();
    };

    const handleRemovePanel = (panelId: string) => {
        removePanel(panelId);
    };

    const handleResizeStop = (panelId: string, size: { width: number; height: number }) => {
        const newSizes = { ...panelSizes, [panelId]: size };
        setPanelSizes(newSizes);
    };

    // 패널이 없는 경우 처리
    if (!panels || panels.length === 0) {
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