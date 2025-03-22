'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
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
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { TabBarWithDndKit } from './ui/TabBarWithDndKit';

// 올바른 방식으로 드롭 애니메이션 구성
const dropAnimation = {
    ...defaultDropAnimation,
    sideEffects: ({ active }: { active: { node: HTMLElement } }) => {
        active.node.style.opacity = '0.5';
        return () => {
            active.node.style.opacity = '';
        };
    }
};

// 초기 패널 크기 (로컬 스토리지에 저장됨)
const getPanelSizes = () => {
    if (typeof window === 'undefined') return {};

    try {
        const saved = localStorage.getItem('panel-sizes');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        console.error('Failed to parse panel sizes:', e);
        return {};
    }
};

// 리사이즈 가능한 패널 컴포넌트
const ResizablePanel = memo(({
    panel,
    index,
    totalPanels,
    onRemovePanel,
    onResizeComplete,
    initialWidth,
    containerRef
}: {
    panel: PanelState;
    index: number;
    totalPanels: number;
    onRemovePanel: (panelId: string) => void;
    onResizeComplete: (panelId: string, width: number) => void;
    initialWidth: string | number;
    containerRef: React.RefObject<HTMLDivElement>;
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const resizeHandleRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [isHandleHovered, setIsHandleHovered] = useState(false);
    const startPosRef = useRef(0);
    const startWidthRef = useRef(0);
    const currentWidthRef = useRef<number>(0);
    const isLastPanel = index === totalPanels - 1;

    // 컴포넌트 마운트 시 초기 너비 설정
    useEffect(() => {
        if (panelRef.current && initialWidth) {
            if (typeof initialWidth === 'number') {
                panelRef.current.style.width = `${initialWidth}px`;
                currentWidthRef.current = initialWidth;
            } else {
                panelRef.current.style.width = initialWidth;
                // initialWidth가 퍼센트일 경우, 실제 픽셀 값으로 변환
                const computedWidth = window.getComputedStyle(panelRef.current).width;
                currentWidthRef.current = parseInt(computedWidth, 10);
            }
        } else if (panelRef.current) {
            panelRef.current.style.width = `${100 / totalPanels}%`;
            // 초기 너비를 계산하여 ref에 저장
            const computedWidth = window.getComputedStyle(panelRef.current).width;
            currentWidthRef.current = parseInt(computedWidth, 10);
        }
    }, [initialWidth, totalPanels]);

    // 리사이징 시작 핸들러
    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        if (isLastPanel) return;

        e.preventDefault();

        if (panelRef.current) {
            // 트랜지션 효과 일시 중단
            panelRef.current.style.transition = 'none';

            // 시작 위치와 너비 저장
            startPosRef.current = e.clientX;

            // 현재 너비 계산 (getComputedStyle은 렌더링된 실제 픽셀 값을 반환)
            const computedWidth = window.getComputedStyle(panelRef.current).width;
            startWidthRef.current = parseInt(computedWidth, 10);
            currentWidthRef.current = startWidthRef.current;
        }

        setIsResizing(true);
        document.body.style.cursor = 'col-resize';

        // 텍스트 선택 방지
        document.body.style.userSelect = 'none';
    }, [isLastPanel]);

    // 리사이징 핸들러
    const handleResize = useCallback((e: MouseEvent) => {
        if (!isResizing || !panelRef.current || !containerRef.current) return;

        // 마우스 이동 거리 계산
        const delta = e.clientX - startPosRef.current;

        // 새 너비 계산 (최소값 200px)
        const containerWidth = containerRef.current.offsetWidth;
        const newWidth = Math.max(200, Math.min(containerWidth * 0.8, startWidthRef.current + delta));

        // 직접 DOM 조작으로 너비 변경 (상태 업데이트 없음)
        panelRef.current.style.width = `${newWidth}px`;
        currentWidthRef.current = newWidth;

        // 필요한 경우 컨테이너 스크롤 조정
        if (newWidth + panelRef.current.offsetLeft > containerWidth) {
            containerRef.current.scrollLeft = newWidth + panelRef.current.offsetLeft - containerWidth + 20;
        }
    }, [isResizing, containerRef]);

    // 리사이징 종료 핸들러
    const handleResizeEnd = useCallback(() => {
        if (!isResizing) return;

        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        if (panelRef.current) {
            // 트랜지션 효과 복원
            panelRef.current.style.transition = '';

            // 최종 너비를 부모 컴포넌트에 전달
            onResizeComplete(panel.id, currentWidthRef.current);
        }
    }, [isResizing, panel.id, onResizeComplete]);

    // 이벤트 리스너 설정
    useEffect(() => {
        window.addEventListener('mousemove', handleResize);
        window.addEventListener('mouseup', handleResizeEnd);

        return () => {
            window.removeEventListener('mousemove', handleResize);
            window.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [handleResize, handleResizeEnd]);

    const ActiveTabContent = panel.activeTabId
        ? panel.tabs.find(tab => tab.id === panel.activeTabId)?.component
        : null;

    return (
        <div
            ref={panelRef}
            className={`h-full relative ${isResizing ? '' : 'transition-width duration-150'}`}
            id={panel.id}
            data-panel-id={panel.id}
        >
            <div className="bg-white rounded-lg h-full p-1 relative">
                <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <TabBarWithDndKit
                        panel={panel}
                        onRemovePanel={() => onRemovePanel(panel.id)}
                        showRemoveButton={totalPanels > 1}
                    />

                    <div className="flex-1 overflow-auto p-4" data-panel-id={panel.id}>
                        {ActiveTabContent ? <ActiveTabContent /> : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                <p>콘텐츠를 선택해주세요</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 오른쪽 리사이즈 핸들 - 마지막 패널이 아닐 때만 표시 */}
                {!isLastPanel && (
                    <div
                        ref={resizeHandleRef}
                        className="absolute top-0 bottom-0 right-0 w-4 z-20 cursor-col-resize"
                        style={{ right: '-2px' }}
                        onMouseDown={handleResizeStart}
                        onMouseEnter={() => setIsHandleHovered(true)}
                        onMouseLeave={() => setIsHandleHovered(false)}
                    >
                        {/* 실제 보이는 핸들 UI */}
                        <div
                            className={`absolute top-0 bottom-0 left-1/2 w-1 -ml-0.5 transition-opacity duration-150 ${isHandleHovered || isResizing ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

ResizablePanel.displayName = 'ResizablePanel';

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
    const [panelSizes, setPanelSizes] = useState<Record<string, number>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    // 로컬 스토리지에서 패널 크기 로드
    useEffect(() => {
        const savedSizes = getPanelSizes();
        setPanelSizes(savedSizes);
    }, []);

    // 패널 크기 변경 완료 핸들러
    const handleResizeComplete = useCallback((panelId: string, width: number) => {
        setPanelSizes(prev => {
            const newSizes = {
                ...prev,
                [panelId]: width
            };

            // 로컬 스토리지 저장 작업을 requestAnimationFrame으로 지연
            requestAnimationFrame(() => {
                try {
                    localStorage.setItem('panel-sizes', JSON.stringify(newSizes));
                } catch (e) {
                    console.error('Failed to save panel sizes:', e);
                }
            });

            return newSizes;
        });
    }, []);

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

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const { tab, panelId } = active.data.current || {};

        if (tab && panelId) {
            setActiveDragTab(tab);
            setActivePanel(panelId);
        }
    }, []);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        // 드래그 오버 핸들러 (필요 시 구현)
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !active.data.current) {
            setActiveDragTab(null);
            setActivePanel(null);
            return;
        }

        const sourceTabId = active.id as string;
        const sourcePanelId = active.data.current.panelId;

        // 드롭 영역에서 패널 ID 추출
        let targetPanelId = sourcePanelId;

        if (over.data.current?.panelId) {
            targetPanelId = over.data.current.panelId;
        } else if (over.data.current?.type === 'panel-area') {
            const match = (over.id as string).match(/droppable-(.+)/);
            if (match && match[1]) {
                targetPanelId = match[1];
            }
        }

        // 패널 간 이동이 있을 경우만 처리
        if (sourcePanelId !== targetPanelId) {
            moveTab(sourceTabId, sourcePanelId, targetPanelId);
        }

        setActiveDragTab(null);
        setActivePanel(null);
    }, [moveTab]);

    const handleRemovePanel = useCallback((panelId: string) => {
        const newScreenCount = screenCount - 1;
        updateSplitScreenCount((newScreenCount > 0 ? newScreenCount : 1) as 1 | 2 | 3 | 4 | 5);
    }, [screenCount, updateSplitScreenCount]);

    // 단일 패널 렌더링
    const renderSinglePanel = useCallback(() => {
        if (panels.length === 0) return null;

        const panel = panels[0];
        const ActiveTabContent = panel.activeTabId
            ? panel.tabs.find(tab => tab.id === panel.activeTabId)?.component
            : null;

        return (
            <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <TabBarWithDndKit
                    panel={panel}
                    onRemovePanel={() => handleRemovePanel(panel.id)}
                    showRemoveButton={false}
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
    }, [panels, handleRemovePanel]);

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
                renderSinglePanel()
            ) : (
                <div className="overflow-x-auto h-full">
                    <div
                        ref={containerRef}
                        className="flex h-full"
                        style={{ minWidth: 'fit-content' }}
                    >
                        {panels.map((panel, index) => (
                            <ResizablePanel
                                key={panel.id}
                                panel={panel}
                                index={index}
                                totalPanels={panels.length}
                                onRemovePanel={handleRemovePanel}
                                onResizeComplete={handleResizeComplete}
                                initialWidth={panelSizes[panel.id] || `${100 / screenCount}%`}
                                containerRef={containerRef}
                            />
                        ))}
                    </div>
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