'use client';

import React from 'react';
import { Minus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useTabBarStore, type PanelState, Tab } from '@/shared/model/tab-admin/store';
import {
    DragOverlay,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { MovingTab } from './MovingTab';

// 패널 드롭 영역 컴포넌트
function PanelDropArea({ panelId, children }: { panelId: string, children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `droppable-${panelId}`,
        data: {
            panelId,
            type: 'panel-area',
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-1 overflow-x-auto space-x-1 min-h-8 ${isOver ? 'bg-blue-50 border border-dashed border-blue-300 rounded' : ''}`}
            data-panel-id={panelId}
        >
            {children}
        </div>
    );
}

interface TabBarWithDndKitProps {
    panel: PanelState;
    onRemovePanel?: () => void;
    showRemoveButton?: boolean;
}

export function TabBarWithDndKit({
    panel,
    onRemovePanel,
    showRemoveButton = false
}: TabBarWithDndKitProps) {
    const { removeTab, setActiveTab } = useTabBarStore();

    return (
        <div
            className="h-10 flex items-center bg-gray-50 border-b border-gray-200 px-1 justify-between"
            data-panel-id={panel.id}
        >
            <SortableContext
                id={`${panel.id}-sortable-context`}
                items={panel.tabs.map(tab => tab.id)}
                strategy={horizontalListSortingStrategy}
            >
                <PanelDropArea panelId={panel.id}>
                    {panel.tabs.map((tab) => (
                        <MovingTab
                            key={tab.id}
                            tab={tab}
                            panelId={panel.id}
                            isActive={panel.activeTabId === tab.id}
                        />
                    ))}

                    {/* 빈 패널에도 드롭 가능하도록 빈 영역 추가 */}
                    {panel.tabs.length === 0 && (
                        <div className="flex-1 h-8 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
                            <span className="text-xs text-gray-400">탭을 여기로 드래그하세요</span>
                        </div>
                    )}
                </PanelDropArea>
            </SortableContext>

            {showRemoveButton && onRemovePanel && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500 w-6 h-6 border border-dashed border-gray-300 rounded-md ml-2"
                    onClick={onRemovePanel}
                >
                    <Minus size={14} />
                </Button>
            )}
        </div>
    );
}

export default TabBarWithDndKit;