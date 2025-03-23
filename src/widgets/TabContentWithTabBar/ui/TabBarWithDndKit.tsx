'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useTabBarStore, type PanelState, Tab } from '@/shared/model/tab-admin/store';
import {
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
            setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 10); // 약간의 여유를 두어 정확히 감지
        }
    };

    // Initialize and update scroll buttons on tab changes
    useEffect(() => {
        // 안전하게 panel.tabs 접근
        if (panel && panel.tabs) {
            // 최초 렌더링 후 적절한 시점에 스크롤 버튼 상태 확인
            setTimeout(() => {
                checkScrollButtons();
            }, 100);

            // Use ResizeObserver to detect changes in container size
            const resizeObserver = new ResizeObserver(() => {
                checkScrollButtons();
            });

            if (tabsContainerRef.current) {
                resizeObserver.observe(tabsContainerRef.current);
            }

            // 윈도우 리사이즈 이벤트도 처리
            window.addEventListener('resize', checkScrollButtons);

            return () => {
                if (tabsContainerRef.current) {
                    resizeObserver.unobserve(tabsContainerRef.current);
                }
                window.removeEventListener('resize', checkScrollButtons);
            };
        }
    }, [panel?.tabs]);

    // Scroll handlers
    const scrollLeft = () => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollLeft -= 150;
            setTimeout(checkScrollButtons, 50);
        }
    };

    const scrollRight = () => {
        if (tabsContainerRef.current) {
            tabsContainerRef.current.scrollLeft += 150;
            setTimeout(checkScrollButtons, 50);
        }
    };

    // 탭이 없거나 panel이 유효하지 않으면 빈 탭바 렌더링
    if (!panel || !panel.tabs) {
        return <div className="flex items-center bg-gray-50 border-b border-gray-200 px-1 justify-between h-full"></div>;
    }

    return (
        <div className="flex items-center bg-gray-50 border-b border-gray-200 px-1 justify-between h-full">
            {/* Left scroll button - 항상 렌더링하되 필요에 따라 활성화/비활성화 */}
            <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 rounded-full flex-shrink-0 mr-1 ${showLeftScroll ? 'opacity-100 hover:bg-gray-200' : 'opacity-30 cursor-not-allowed'}`}
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

            {/* Right scroll button - 항상 렌더링하되 필요에 따라 활성화/비활성화 */}
            <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 rounded-full flex-shrink-0 ml-1 ${showRightScroll ? 'opacity-100 hover:bg-gray-200' : 'opacity-30 cursor-not-allowed'}`}
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
                    className="text-gray-400 hover:text-red-500 w-6 h-6 border border-dashed border-gray-300 rounded-md ml-2 flex-shrink-0"
                    onClick={onRemovePanel}
                >
                    <Minus size={14} />
                </Button>
            )}
        </div>
    );
}

export default TabBarWithDndKit;