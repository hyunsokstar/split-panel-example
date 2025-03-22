'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { MainMenuItems } from './config/main-header-menu-items';
import { useTabBarStore } from '@/shared/model/tab-admin/store';
import ScreenSplitCountSelector from './ui/ScreenSplitCountSelector';

export function Header() {
    const { addTab, panels } = useTabBarStore();

    const handleMenuClick = (item: typeof MainMenuItems[0]) => {
        // Check if the tab is already open in any panel
        const isTabOpen = panels.some(panel =>
            panel.tabs.some(tab => tab.id === item.id)
        );

        // If the tab is already open, just make it active
        if (isTabOpen) {
            // Find which panel has the tab
            const panelWithTab = panels.find(panel =>
                panel.tabs.some(tab => tab.id === item.id)
            );

            if (panelWithTab) {
                // Create a minimal tab object that will be used to activate the existing tab
                addTab({
                    id: item.id,
                    label: item.name,
                    path: `/${item.id.toLowerCase()}`,
                    component: item.component,
                    panelId: panelWithTab.id
                });
            }
        } else {
            // Otherwise, add it to the first panel
            addTab({
                id: item.id,
                label: item.name,
                path: `/${item.id.toLowerCase()}`,
                closable: true,
                component: item.component,
                panelId: 'panel-1' // 기본 패널에 추가
            });
        }
    };

    return (
        <>
            {/* 최상단 회사 이름 및 로그인 정보 설정 */}
            <header className="bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm">
                <div className="flex h-6 items-center justify-between px-3">
                    <div className="flex items-center gap-1">
                        <h1 className="text-xs font-bold tracking-wide">NEXDPS</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center text-white">
                            <span className="text-xs">홍길동(관리자)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ScreenSplitCountSelector />
                            <Link
                                href="#"
                                className="flex h-5 w-5 items-center justify-center rounded-sm border border-white/30 text-white hover:bg-white/10"
                            >
                                <Settings size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* 메인 메뉴 */}
            <div className="bg-white border-b">
                <div className="flex items-center overflow-x-auto px-3 py-1.5">
                    <div className="flex flex-1 justify-start space-x-3">
                        {MainMenuItems.map((item) => {
                            const Icon = item.icon;

                            // Check if this menu item is currently open in any panel
                            const isActive = panels.some(panel =>
                                panel.tabs.some(tab => tab.id === item.id && panel.activeTabId === tab.id)
                            );

                            return (
                                <button
                                    key={item.id}
                                    className={`group flex flex-col items-center justify-between h-14 px-2 py-1.5 border border-dashed ${isActive
                                        ? 'border-teal-300 bg-teal-50'
                                        : 'border-transparent hover:border-gray-300'
                                        } rounded-sm transition-colors relative`}
                                    onClick={() => handleMenuClick(item)}
                                >
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-sm ${isActive ? 'bg-teal-100' : 'bg-gray-50 group-hover:bg-gray-100'
                                        }`}>
                                        <Icon
                                            size={16}
                                            className={`${isActive ? 'text-teal-600' : 'text-gray-600 group-hover:text-teal-500'
                                                }`}
                                        />
                                    </div>
                                    <span className={`text-xs mt-1 ${isActive ? 'text-teal-600 font-medium' : 'text-gray-600 group-hover:text-teal-500'
                                        }`}>
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;