'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTabBarStore, Tab } from '@/shared/model/tab-admin/store';
import { cn } from '@/lib/utils';

interface MovingTabProps {
    tab: Tab;
    panelId: string;
    isActive: boolean;
}

export const MovingTab = ({ tab, panelId, isActive }: MovingTabProps) => {
    const { setActiveTab, removeTab } = useTabBarStore();

    // useSortable 훅 사용
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: tab.id,
        data: {
            tab,
            panelId,
            type: 'tab',
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    const handleTabClick = () => {
        setActiveTab(tab.id, panelId);
    };

    const handleRemoveTab = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeTab(tab.id, panelId);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "flex items-center px-3 py-1.5 h-8",
                "border border-gray-300",
                "rounded-md cursor-pointer",
                "flex items-center justify-between",
                "min-w-[120px] transition-all duration-200",
                isActive
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-white text-gray-600 hover:bg-gray-50",
                isDragging && "shadow-md opacity-50"
            )}
            onClick={handleTabClick}
            data-panel-id={panelId}
            data-tab-id={tab.id}
        >
            <span className="text-xs font-medium truncate flex-1 mr-2">
                {tab.label}
            </span>
            {tab.closable !== false && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 text-gray-400 hover:text-red-500 ml-auto"
                    onClick={handleRemoveTab}
                >
                    <X size={12} />
                </Button>
            )}
        </div>
    );
};

export default MovingTab;