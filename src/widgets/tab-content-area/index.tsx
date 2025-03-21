// src/widgets/tab-content-area/index.tsx
'use client';

import { useTabBarStore } from '@/shared/model/tab-bar/store';
import { MainMenuItems } from '@/widgets/header/config/main-header-menu-items';

export default function TabContentArea() {
    const { activeTabId } = useTabBarStore();

    // 활성화된 탭이 없는 경우 (초기 상태)
    if (!activeTabId) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <p className="text-xl">환영합니다</p>
                    <p className="mt-2">좌측 메뉴에서 원하는 기능을 선택하세요</p>
                </div>
            </div>
        );
    }

    // 활성화된 탭 ID에 해당하는 컴포넌트 찾기
    const menuItem = MainMenuItems.find(item => item.id === activeTabId);
    if (!menuItem) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <p className="text-xl">오류가 발생했습니다</p>
                    <p className="mt-2">해당 메뉴를 찾을 수 없습니다 (ID: {activeTabId})</p>
                </div>
            </div>
        );
    }

    // 컴포넌트 렌더링
    const PanelComponent = menuItem.component;
    return (
        <div className="h-full w-full overflow-auto">
            <PanelComponent />
        </div>
    );
}