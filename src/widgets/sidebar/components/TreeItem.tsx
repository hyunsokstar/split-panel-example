// File: /components/TreeItem.tsx
"use client";

import React from 'react';
import { ChevronRight, ChevronDown, AlertTriangleIcon, CircleIcon, FolderIcon, BuildingIcon } from 'lucide-react';
import { useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export type ItemType = 'organization' | 'tenant' | 'campaign';

export interface SidebarItem {
  id: string;
  label: string;
  type: ItemType;
  status?: string;
  href?: string;
  children?: SidebarItem[];
}

interface TreeItemProps {
  item: SidebarItem;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  level: number;
  expandedItems: Record<string, boolean>;
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

// 클래스 이름을 조합하는 유틸리티 함수
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

// 아이템 타입에 따른 아이콘 반환 함수
const getIconForType = (type: ItemType, status?: string) => {
  switch (type) {
    case 'organization':
      return <BuildingIcon size={16} className="text-blue-500" />;
    case 'tenant':
      return <FolderIcon size={16} className="text-amber-500" />;
    case 'campaign':
      if (status === 'warning') {
        return <CircleIcon
          size={14}
          className="text-orange-500"
          fill="rgb(249, 115, 22)"
        />;
      }
      return <CircleIcon
        size={14}
        className={status === 'active' ? 'text-green-500' : 'text-gray-400'}
        fill={status === 'active' ? 'rgb(34, 197, 94)' : 'transparent'}
      />;
    default:
      return <CircleIcon size={14} />;
  }
};

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  level,
  expandedItems,
  selectedItemId,
  onSelectItem
}) => {
  const isSelected = selectedItemId === item.id;
  const hasChildren = item.children && item.children.length > 0;
  const indent = level * 16;

  // react-contexify의 useContextMenu 훅 사용 (tenant 항목에 한해서)
  const { show } = useContextMenu({
    id: "tenant_context_menu"
  });

  // 아이템 클릭 시 처리 함수
  const handleItemClick = () => {
    onSelectItem(item.id);
    if (hasChildren) {
      onToggleExpand(item.id);
    }
  };

  // 더블 클릭 처리 (예시)
  const handleDoubleClick = () => {
    console.log('Double clicked on item:', item.id);
  };

  // 모든 항목에 대해 동일한 함수를 제공하되, 내부에서 조건 체크
  const handleContextMenu = (e: React.MouseEvent) => {
    if (item.type === 'tenant') {
      e.preventDefault();
      show({ event: e, props: { item } });
    }
  };

  return (
    <div onContextMenu={handleContextMenu}>
      <div
        className={cn(
          "flex items-center py-1.5 text-sm cursor-pointer rounded hover:bg-gray-50",
          isSelected ? "bg-blue-50 text-blue-600 font-medium" : ""
        )}
        onClick={handleItemClick}
        onDoubleClick={handleDoubleClick}
        style={{ paddingLeft: `${indent}px` }}
      >
        {/* 자식 존재 시 토글 아이콘 */}
        {hasChildren && (
          <span className="text-gray-400 mr-1">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}

        {/* 아이콘 및 라벨 */}
        <span className="mr-2">{getIconForType(item.type, item.status)}</span>
        <span>{item.label}</span>

        {/* 상태가 warning일 경우 경고 아이콘 */}
        {item.status === 'warning' && (
          <AlertTriangleIcon size={14} className="ml-2 text-orange-500" />
        )}
      </div>

      {/* 자식 항목 렌더링 */}
      {isExpanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              isExpanded={!!expandedItems[child.id]}
              onToggleExpand={onToggleExpand}
              level={level + 1}
              expandedItems={expandedItems}
              selectedItemId={selectedItemId}
              onSelectItem={onSelectItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeItem;