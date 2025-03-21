// src/widgets/tabbar/index.tsx
'use client';

import { useTabBarStore } from '@/shared/model/tab-bar/store';
import { X } from 'lucide-react';

const TabBar = () => {
    const { tabs, activeTabId, setActiveTab, removeTab } = useTabBarStore();

    if (tabs.length === 0) {
        return (
            <div className="w-full bg-blue-100 border-b border-blue-200 min-h-[40px]">
                {/* 탭이 없을 때는 빈 탭바 표시 */}
            </div>
        );
    }

    return (
        <div className="w-full bg-blue-100 border-b border-blue-200">
            <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`flex items-center px-4 py-2 min-w-[120px] cursor-pointer ${activeTabId === tab.id
                                ? 'bg-white border-t-2 border-t-blue-500 border-b-0 border-x border-x-blue-200'
                                : 'border-b border-b-blue-200 text-gray-600 hover:bg-blue-50'
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="truncate flex-1 text-sm">{tab.label}</span>
                        {tab.closable && (
                            <button
                                className="ml-2 text-gray-400 hover:text-gray-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTab(tab.id);
                                }}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabBar;