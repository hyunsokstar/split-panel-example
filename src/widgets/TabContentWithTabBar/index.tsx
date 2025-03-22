'use client';

import React from 'react';
import { X, Minus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useTabBarStore } from '@/shared/model/tab-admin/store';

const TabContentWithTabBar = () => {
    const {
        panels,
        screenCount,
        isSplitScreen,
        setActiveTab,
        removeTab,
        updateSplitScreenCount
    } = useTabBarStore();

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

    const renderPanel = (panel: { id: string, tabs: any[], activeTabId: string | null }) => {
        const ActiveTabContent = panel.activeTabId
            ? panel.tabs.find(tab => tab.id === panel.activeTabId)?.component
            : null;

        return (
            <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="h-10 flex items-center bg-gray-50 border-b border-gray-200 px-1 justify-between">
                    <div className="flex flex-1 overflow-x-auto space-x-1">
                        {panel.tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`
                                    flex items-center 
                                    px-3 py-1.5 h-8 
                                    border border-gray-300
                                    ${panel.activeTabId === tab.id
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }
                                    rounded-md cursor-pointer 
                                    flex items-center justify-between
                                    min-w-[120px] transition-all duration-200
                                `}
                                onClick={() => setActiveTab(tab.id, panel.id)}
                            >
                                <span className="text-xs font-medium truncate flex-1 mr-2">
                                    {tab.label}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="
                                        w-4 h-4 
                                        text-gray-400 hover:text-red-500 
                                        ml-auto
                                    "
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTab(tab.id, panel.id);
                                    }}
                                >
                                    <X size={12} />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {screenCount > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                                text-gray-400 hover:text-red-500 
                                w-6 h-6 
                                border border-dashed border-gray-300 
                                rounded-md ml-2
                            "
                            onClick={() => handleRemovePanel(panel.id)}
                        >
                            <Minus size={14} />
                        </Button>
                    )}
                </div>

                <div className="flex-1 overflow-auto p-4">
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
        <>
            {!isSplitScreen ? (
                renderPanel(panels[0])
            ) : (
                <div className={`grid ${getGridClass()} gap-2 p-2 h-full`}>
                    {panels.map(panel => (
                        <div
                            key={panel.id}
                            className="bg-white rounded-lg"
                        >
                            {renderPanel(panel)}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default TabContentWithTabBar;