'use client';

import React from 'react';
import { Resizable } from 're-resizable';
import { PanelState } from '@/shared/model/tab-admin/store';
import { TabBarWithDndKit } from './TabBarWithDndKit';
import { GripVertical } from 'lucide-react';

interface IPanelForTabBarAndTabContentWithResizeProps {
    panel: PanelState;
    panelSize: { width?: string | number; height?: string | number };
    screenCount: number;
    isLastPanel: boolean;
    isPanelHovered: boolean;
    handleResizeStop: (panelId: string, size: { width: number; height: number }) => void;
    setHoveredPanel: (panelId: string | null) => void;
    onRemovePanel: () => void;
    dragHandleListeners?: any;
    dragHandleAttributes?: any;
}

const IPanelForTabBarAndTabContentWithResize: React.FC<IPanelForTabBarAndTabContentWithResizeProps> = ({
    panel,
    panelSize,
    screenCount,
    isLastPanel,
    isPanelHovered,
    handleResizeStop,
    setHoveredPanel,
    onRemovePanel,
    dragHandleListeners,
    dragHandleAttributes,
}) => {
    const ActiveTabContent = panel.activeTabId
        ? panel.tabs.find((tab) => tab.id === panel.activeTabId)?.component
        : null;

    // 1분할일 때는 100% 너비 사용
    const isSinglePanel = screenCount === 1;

    return (
        <Resizable
            size={{
                width: isSinglePanel ? "100%" : (panelSize.width || "600px"),
                height: panelSize.height || "100%",
            }}
            minWidth={isSinglePanel ? window.innerWidth : 200}
            maxWidth={3000}
            enable={{
                top: false,
                bottom: false,
                left: false,
                // 1분할일 때는 리사이즈 비활성화
                right: !isSinglePanel && !isLastPanel,
                topLeft: false,
                topRight: false,
                bottomLeft: false,
                bottomRight: false,
            }}
            onResizeStop={(e, direction, ref, d) => {
                handleResizeStop(panel.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
            }}
            handleClasses={{
                right: `w-1 absolute top-0 bottom-0 right-0 transition-opacity duration-200 ${isPanelHovered && !isSinglePanel && !isLastPanel ? 'opacity-100' : 'opacity-0'
                    }`,
            }}
            handleStyles={{
                right: {
                    width: '8px',
                    right: '-4px',
                    cursor: 'col-resize',
                    zIndex: 10,
                },
            }}
        >
            <div
                className="bg-white rounded-lg h-full p-1 relative"
                id={panel.id}
                data-panel-id={panel.id}
                onMouseEnter={() => setHoveredPanel(panel.id)}
                onMouseLeave={() => setHoveredPanel(null)}
            >
                {/* 내부 패널 콘텐츠 */}
                <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="flex h-10 bg-gray-50 border-b border-gray-200">
                        {/* Drag Handle for Panel Reordering */}
                        {screenCount > 1 && (
                            <div
                                className="flex items-center justify-center w-8 cursor-grab hover:bg-gray-200 active:cursor-grabbing"
                                {...dragHandleListeners}
                                {...dragHandleAttributes}
                            >
                                <GripVertical size={16} className="text-gray-500" />
                            </div>
                        )}

                        {/* Tab Bar */}
                        <div className="flex-1">
                            <TabBarWithDndKit
                                panel={panel}
                                onRemovePanel={onRemovePanel}
                                showRemoveButton={screenCount > 1}
                            />
                        </div>
                    </div>
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
            </div>
        </Resizable>
    );
};

export default IPanelForTabBarAndTabContentWithResize;