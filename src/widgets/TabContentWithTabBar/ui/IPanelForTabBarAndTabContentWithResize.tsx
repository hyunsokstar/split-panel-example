'use client';

import React from 'react';
import { Resizable } from 're-resizable';
import { PanelState } from '@/shared/model/tab-admin/store';

interface IPanelForTabBarAndTabContentWithResizeProps {
    panel: PanelState;
    panelSize: { width?: string | number; height?: string | number };
    screenCount: number;
    isLastPanel: boolean;
    isPanelHovered: boolean;
    handleResizeStop: (panelId: string, size: { width: number; height: number }) => void;
    setHoveredPanel: (panelId: string | null) => void;
    children: React.ReactNode;
}

/**
 * 패널의 기본 너비를 600px로 설정:
 * panelSize.width가 없으면 "600px" 사용
 */
const IPanelForTabBarAndTabContentWithResize: React.FC<IPanelForTabBarAndTabContentWithResizeProps> = ({
    panel,
    panelSize,
    screenCount,
    isLastPanel,
    isPanelHovered,
    handleResizeStop,
    setHoveredPanel,
    children,
}) => {
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
                right: !isLastPanel, // 마지막 패널이 아니면 오른쪽 핸들 활성
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
                {children}
            </div>
        </Resizable>
    );
};

export default IPanelForTabBarAndTabContentWithResize;
