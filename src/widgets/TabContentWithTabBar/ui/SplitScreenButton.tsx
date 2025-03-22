'use client';

import React from 'react';
import { LayoutGrid, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useTabBarStore, type screenCountType } from '@/shared/model/tab-admin/store';

export function SplitScreenButton() {
    const { updateSplitScreenCount, screenCount } = useTabBarStore();

    const handleSplitChange = (count: screenCountType) => {
        updateSplitScreenCount(count);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex h-5 items-center space-x-1 rounded-sm border border-white/30 px-1.5 text-xs text-white hover:bg-white/10">
                    <LayoutGrid size={12} />
                    <span>{screenCount}</span>
                    <ChevronDown size={10} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => handleSplitChange(1)}>
                    <span className="mr-2">●</span> 1 화면
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSplitChange(2)}>
                    <span className="mr-2">●●</span> 2 화면
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSplitChange(3)}>
                    <span className="mr-2">●●●</span> 3 화면
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSplitChange(4)}>
                    <span className="mr-2">●●●●</span> 4 화면
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSplitChange(5)}>
                    <span className="mr-2">●●●●●</span> 5 화면
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default SplitScreenButton;