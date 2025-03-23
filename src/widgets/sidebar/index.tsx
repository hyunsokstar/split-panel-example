// File: /components/Sidebar.tsx
"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Phone, Users, ListTree } from 'lucide-react';
import { campaignConfig, groupConfig, userConfig } from './config/sidebar-menu-items';
import { Resizable } from 're-resizable';
import TreeMenusForSideBar from './components/TreeMenusForSideBar';
import TenantContextMenu from '@/shared/ContextMenu';
import TestDialog from './components/TestDialog';

interface SidebarProps {
    className?: string;
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
}

type SidebarTab = 'campaign' | 'user' | 'group';

const Sidebar = ({
    className,
    defaultWidth = 256,
    minWidth = 220,
    maxWidth = 420
}: SidebarProps) => {
    const [activeTab, setActiveTab] = useState<SidebarTab>('campaign');

    // 각 탭별로 독립적인 확장 상태 관리
    const [campaignExpandedItems, setCampaignExpandedItems] = useState<Record<string, boolean>>({
        'nexus-cc': true,
        'sk-telecom': true,
        'lg-uplus': true,
        'kt': true
    });
    const [userExpandedItems, setUserExpandedItems] = useState<Record<string, boolean>>({
        'user-management': true,
        'active-users': true,
        'user-performance': true
    });
    const [groupExpandedItems, setGroupExpandedItems] = useState<Record<string, boolean>>({
        'campaign-groups': true,
        'telecom-groups': true,
        'finance-groups': true
    });

    // 활성 탭에 따른 확장 상태 및 setter 가져오기
    const getExpandedItemsState = () => {
        switch (activeTab) {
            case 'campaign':
                return {
                    expandedItems: campaignExpandedItems,
                    setExpandedItems: setCampaignExpandedItems
                };
            case 'user':
                return {
                    expandedItems: userExpandedItems,
                    setExpandedItems: setUserExpandedItems
                };
            case 'group':
                return {
                    expandedItems: groupExpandedItems,
                    setExpandedItems: setGroupExpandedItems
                };
        }
    };

    const { expandedItems, setExpandedItems } = getExpandedItemsState();

    // 활성 탭에 따른 설정 및 제목 결정
    const getTabConfig = () => {
        switch (activeTab) {
            case 'campaign':
                return {
                    config: campaignConfig,
                    title: '캠페인 관리',
                    icon: <Phone size={16} />
                };
            case 'user':
                return {
                    config: userConfig,
                    title: '상담원 관리',
                    icon: <Users size={16} />
                };
            case 'group':
                return {
                    config: groupConfig,
                    title: '캠페인 그룹 관리',
                    icon: <ListTree size={16} />
                };
        }
    };

    const { config, title, icon } = getTabConfig();

    // 테스트 다이어로그 제어 상태
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const openTestDialog = () => {
        setIsDialogOpen(true);
    };

    // 리사이즈 핸들 스타일
    const resizeHandleStyles = {
        right: {
            position: 'absolute' as const,
            top: 0,
            right: 0,
            width: '3px',
            height: '100%',
            cursor: 'col-resize',
            zIndex: 1
        }
    };

    return (
        <Resizable
            defaultSize={{
                width: defaultWidth,
                height: '100%'
            }}
            minWidth={minWidth}
            maxWidth={maxWidth}
            enable={{
                top: false,
                right: true,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false
            }}
            handleStyles={resizeHandleStyles}
            handleClasses={{
                right: 'hover:bg-gray-300 active:bg-gray-400 transition-colors'
            }}
        >
            <div className={cn("bg-white border-r flex flex-col h-full w-full", className)}>
                {/* 사이드바 헤더 */}
                <div className="bg-gray-100 text-gray-700 px-3 py-3 flex items-center border-b">
                    {icon}
                    <span className="text-sm font-medium ml-2">{title}</span>
                </div>

                {/* 트리 메뉴 영역 */}
                <div className="flex-1 overflow-auto px-2 py-2">
                    <TreeMenusForSideBar
                        config={config}
                        expandedItems={expandedItems}
                        setExpandedItems={setExpandedItems}
                    />
                </div>

                {/* 하단 세로 탭 */}
                <div className="border-t">
                    <div className="flex flex-col divide-y">
                        <button
                            className={cn(
                                "py-2 text-xs flex items-center justify-center",
                                activeTab === 'campaign' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                            )}
                            onClick={() => setActiveTab('campaign')}
                        >
                            <Phone size={14} className="mr-1.5" />
                            <span>캠페인</span>
                        </button>
                        <button
                            className={cn(
                                "py-2 text-xs flex items-center justify-center",
                                activeTab === 'user' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                            )}
                            onClick={() => setActiveTab('user')}
                        >
                            <Users size={14} className="mr-1.5" />
                            <span>상담원</span>
                        </button>
                        <button
                            className={cn(
                                "py-2 text-xs flex items-center justify-center",
                                activeTab === 'group' ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                            )}
                            onClick={() => setActiveTab('group')}
                        >
                            <ListTree size={14} className="mr-1.5" />
                            <span>그룹</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* tenant 항목용 컨텍스트 메뉴 */}
            <TenantContextMenu openTestDialog={openTestDialog} />

            {/* 테스트 다이어로그 */}
            <TestDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        </Resizable>
    );
};

export default Sidebar;
