// File: /components/TreeMenusForSideBar.tsx
"use client";

import React, { useState } from 'react';
import TreeItem from './TreeItem';
import { SidebarItem } from '../config/sidebar-menu-items';

interface TreeMenusForSideBarProps {
    config: SidebarItem[];  // 현재 활성 탭의 메뉴 구성
    expandedItems: Record<string, boolean>;  // 확장된 아이템 상태
    setExpandedItems: (expandedItems: Record<string, boolean>) => void;  // 확장 상태 설정 함수
}

const TreeMenusForSideBar: React.FC<TreeMenusForSideBarProps> = ({
    config,
    expandedItems,
    setExpandedItems
}) => {
    // 선택된 아이템 ID 상태 추가
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // 아이템 토글 함수 - 아이템 ID를 매개변수로 받음
    const toggleItem = (id: string) => {
        setExpandedItems({
            ...expandedItems,
            [id]: !expandedItems[id]
        });
    };

    // 아이템 선택 함수
    const selectItem = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    return (
        <nav className="space-y-1">
            {config.map((item) => (
                <TreeItem
                    key={item.id}
                    item={item}
                    isExpanded={!!expandedItems[item.id]}
                    onToggleExpand={toggleItem}
                    level={0}
                    expandedItems={expandedItems}
                    selectedItemId={selectedItemId}
                    onSelectItem={selectItem}
                />
            ))}
        </nav>
    );
};

export default TreeMenusForSideBar;
