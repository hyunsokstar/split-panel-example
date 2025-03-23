'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Minus, ChevronLeft, ChevronRight } from 'lucide-react';
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
            className={`flex flex-1 overflow-hidden min-h-8 ${isOver ? 'bg-blue-50 border border-dashed border-blue-300 rounded' : ''}`}
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
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(false);

    // Check if scroll buttons should be visible
    const checkScrollButtons = () => {
        if (tabsContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
            setShowLeftScroll(scrollLeft > 0);
            setShowRightScroll(scrollLeft + clientWidth < scrollWidth);
        }
    };

    // Initialize and update scroll buttons on tab changes
    useEffect(() => {
        checkScrollButtons();
        // Use ResizeObserver to detect changes in container size
        const resizeObserver = new ResizeObserver(() => {
            checkScrollButtons();
        });

        if (tabsContainerRef.current) {
            resizeObserver.observe(tabsContainerRef.current);
        }

        return () => {
            if (tabsContainerRef.current) {
                resizeObserver.unobserve(tabsContainerRef.current);
            }
        };
    }, [panel.tabs]);

    // Scroll handlers
    const scrollLeft = () => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollLeft -= 100;
            setTimeout(checkScrollButtons, 100);
        }
    };

    const scrollRight = () => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollLeft += 100;
            setTimeout(checkScrollButtons, 100);
        }
    };

    return (
        <div className="flex items-center bg-gray-50 border-b border-gray-200 px-1 justify-between h-full">
            {/* Left scroll button */}
            <Button
                variant="outline"
                size="icon"
                className={`h-6 w-6 rounded-full flex-shrink-0 mr-1 ${!showLeftScroll ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={scrollLeft}
                disabled={!showLeftScroll}
            >
                <ChevronLeft size={14} />
            </Button>

            <SortableContext
                id={`${panel.id}-sortable-context`}
                items={panel.tabs.map(tab => tab.id)}
                strategy={horizontalListSortingStrategy}
            >
                <PanelDropArea panelId={panel.id}>
                    <div
                        ref={tabsContainerRef}
                        className="flex space-x-1 overflow-hidden scroll-smooth"
                        onScroll={checkScrollButtons}
                    >
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
                            <div className="w-full h-8 flex items-center justify-center">
                                <span className="text-xs text-gray-400">탭을 여기로 드래그하세요</span>
                            </div>
                        )}
                    </div>
                </PanelDropArea>
            </SortableContext>

            {/* Right scroll button */}
            <Button
                variant="outline"
                size="icon"
                className={`h-6 w-6 rounded-full flex-shrink-0 ml-1 ${!showRightScroll ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={scrollRight}
                disabled={!showRightScroll}
            >
                <ChevronRight size={14} />
            </Button>

            {/* Close button - conditionally rendered */}
            {showRemoveButton && (
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