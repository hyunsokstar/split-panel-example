'use client';

import React, { useState } from 'react';
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
    DropAnimation,
    defaultDropAnimation,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { TabBarWithDndKit } from './ui/TabBarWithDndKit';

const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
    dragSourceOpacity: 0.5,
};

export function TabContentWithTabBar() {
    const {
        panels,
        screenCount,
        isSplitScreen,
        moveTab,
        updateSplitScreenCount
    } = useTabBarStore();

    const [activeTab, setActiveDragTab] = useState<Tab | null>(null);
    const [activePanel, setActivePanel] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const { tab, panelId } = active.data.current || {};

        if (tab && panelId) {
            console.log('Drag started:', { tab, panelId });
            setActiveDragTab(tab);
            setActivePanel(panelId);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        // 필요한 경우 여기에 드래그 오버 로직 추가
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !active.data.current) {
            setActiveDragTab(null);
            setActivePanel(null);
            return;
        }

        console.log('Drag ended:', {
            activeId: active.id,
            activeData: active.data.current,
            overId: over.id,
            overData: over.data.current
        });

        const sourceTabId = active.id as string;
        const sourcePanelId = active.data.current.panelId;

        // 드롭 영역에서 패널 ID 추출
        let targetPanelId = sourcePanelId;

        if (over.data.current?.panelId) {
            targetPanelId = over.data.current.panelId;
            console.log(`Moving tab to panel: ${targetPanelId} (from data)`);
        } else if (over.data.current?.type === 'panel-area') {
            // droppable-panel-1 형식에서 panel-1 추출
            const match = (over.id as string).match(/droppable-(.+)/);
            if (match && match[1]) {
                targetPanelId = match[1];
                console.log(`Moving tab to panel: ${targetPanelId} (from id)`);
            }
        }

        // 패널 간 이동이 있을 경우만 처리
        if (sourcePanelId !== targetPanelId) {
            console.log(`Moving tab ${sourceTabId} from ${sourcePanelId} to ${targetPanelId}`);
            moveTab(sourceTabId, sourcePanelId, targetPanelId);
        }

        setActiveDragTab(null);
        setActivePanel(null);
    };

    const getGridClass = () => {
        const gridClasses = {
            1: 'grid-cols-1',
            2: 'grid-cols-2',
            3: 'grid-cols-3',
            4: 'grid-cols-4',
            5: 'grid-cols-5'
        };
        return gridClasses[screenCount] || 'grid-cols-1';
    };

    const handleRemovePanel = (panelId: string) => {
        const newScreenCount = screenCount - 1;
        updateSplitScreenCount((newScreenCount > 0 ? newScreenCount : 1) as 1 | 2 | 3 | 4 | 5);
    };

    const renderPanel = (panel: PanelState) => {
        const ActiveTabContent = panel.activeTabId
            ? panel.tabs.find(tab => tab.id === panel.activeTabId)?.component
            : null;

        return (
            <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <TabBarWithDndKit
                    panel={panel}
                    onRemovePanel={() => handleRemovePanel(panel.id)}
                    showRemoveButton={screenCount > 1}
                />

                <div className="flex-1 overflow-auto p-4" data-panel-id={panel.id}>
                    {ActiveTabContent ? <ActiveTabContent /> : (
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
                <div className={`grid ${getGridClass()} gap-2 p-2 h-full`}>
                    {panels.map(panel => (
                        <div
                            key={panel.id}
                            className="bg-white rounded-lg"
                            id={panel.id}
                            data-panel-id={panel.id}
                        >
                            {renderPanel(panel)}
                        </div>
                    ))}
                </div>
            )}

            <DragOverlay dropAnimation={dropAnimation}>
                {activeTab ? (
                    <div className="flex items-center px-3 py-1.5 h-8 border border-blue-400 bg-blue-50 rounded-md min-w-[120px] shadow-lg">
                        <span className="text-xs font-medium truncate flex-1">
                            {activeTab.label}
                        </span>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default TabContentWithTabBar;