'use client';

import React from 'react';
import { Resizable } from 're-resizable';
import { PanelState } from '@/shared/model/tab-admin/store';
import { TabBarWithDndKit } from './TabBarWithDndKit';

interface IPanelForTabBarAndTabContentWithResizeProps {
    panel: PanelState;
    panelSize: { width?: string | number; height?: string | number };
    screenCount: number;
    isLastPanel: boolean;
    isPanelHovered: boolean;
    handleResizeStop: (panelId: string, size: { width: number; height: number }) => void;
    setHoveredPanel: (panelId: string | null) => void;
    onRemovePanel: () => void;
}

/**
 * 리사이즈 래퍼 및 내부 패널 콘텐츠 렌더링
 * 기본 폭이 panelSize.width가 없으면 "600px"을 사용하며, 내부에서 TabBar와 콘텐츠 영역을 렌더링합니다.
 */
const IPanelForTabBarAndTabContentWithResize: React.FC<IPanelForTabBarAndTabContentWithResizeProps> = ({
    panel,
    panelSize,
    screenCount,
    isLastPanel,
    isPanelHovered,
    handleResizeStop,
    setHoveredPanel,
    onRemovePanel,
}) => {
    const ActiveTabContent = panel.activeTabId
        ? panel.tabs.find((tab) => tab.id === panel.activeTabId)?.component
        : null;

    return (
        <Resizable
            size={{
                width: panelSize.width || "600px",
                height: panelSize.height || "100%",
            }}
            minWidth={200}
            maxWidth={3000}
            enable={{
                top: false,
                bottom: false,
                left: false,
                // 제일 오른쪽 패널도 리사이즈 가능하도록 right: true 로 설정
                right: true,
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
                right: `w-1 absolute top-0 bottom-0 right-0 transition-opacity duration-200 ${isPanelHovered ? 'opacity-100' : 'opacity-0'
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
                    <TabBarWithDndKit
                        panel={panel}
                        onRemovePanel={onRemovePanel}
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
            </div>
        </Resizable>
    );
};

export default IPanelForTabBarAndTabContentWithResize;
