'use client';

import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useTabBarStore, type screenCountType } from '@/shared/model/tab-admin/store';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/shared/ui/popover';

export function ScreenSplitCountSelector() {
    const { updateSplitScreenCount, screenCount } = useTabBarStore();
    const [open, setOpen] = useState(false);

    const handleSplitChange = (count: screenCountType) => {
        updateSplitScreenCount(count);
        setOpen(false);
    };

    // 로마 숫자로 변환하는 함수
    const toRoman = (num: number): string => {
        const romanNumerals: Record<string, number> = {
            'I': 1,
            'II': 2,
            'III': 3,
            'IV': 4,
            'V': 5
        };

        // Object.entries를 사용하여 키-값 쌍의 배열을 가져옴
        // 값(숫자)으로 키(로마 숫자)를 찾기
        const roman = Object.entries(romanNumerals).find(([_, value]) => value === num);
        return roman ? roman[0] : 'I';
    };

    // 레이아웃 아이콘 생성을 위한 함수
    const renderLayoutIcon = (count: number) => {
        // 1~5 화면 레이아웃을 시각적으로 표현
        switch (count) {
            case 1:
                return (
                    <div className="grid grid-cols-1 gap-0.5 w-6 h-6 bg-gray-100">
                        <div className="bg-teal-500"></div>
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-2 gap-0.5 w-6 h-6 bg-gray-100">
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                    </div>
                );
            case 3:
                return (
                    <div className="grid grid-cols-3 gap-0.5 w-6 h-6 bg-gray-100">
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                    </div>
                );
            case 4:
                return (
                    <div className="grid grid-cols-2 gap-0.5 w-6 h-6 bg-gray-100">
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                    </div>
                );
            case 5:
                return (
                    <div className="grid grid-cols-5 gap-0.5 w-6 h-6 bg-gray-100">
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                        <div className="bg-teal-500"></div>
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-1 gap-0.5 w-6 h-6 bg-gray-100">
                        <div className="bg-teal-500"></div>
                    </div>
                );
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="flex h-5 items-center space-x-1 rounded-sm border border-white/30 px-1.5 text-xs text-white hover:bg-white/10">
                    <LayoutGrid size={12} />
                    <span className="font-medium">{toRoman(screenCount)}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-1">
                <div className="space-y-0.5">
                    {([1, 2, 3, 4, 5] as screenCountType[]).map((count) => (
                        <button
                            key={count}
                            className={`w-full flex items-center gap-2 p-1.5 rounded hover:bg-gray-100 text-sm transition-colors
                ${screenCount === count ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                            onClick={() => handleSplitChange(count)}
                        >
                            {renderLayoutIcon(count)}
                            <span className="font-medium text-xs">
                                {count === 1 ? '단일 화면' : `${count}분할 화면`}
                            </span>
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default ScreenSplitCountSelector;