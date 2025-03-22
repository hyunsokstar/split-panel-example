'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Button } from '@/shared/ui/button';
import { useTabBarStore } from '@/shared/model/tab-admin/store';

export const SplitScreenButton = () => {
    const { screenCount, updateSplitScreenCount } = useTabBarStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleLayoutChange = (newScreenCount: 1 | 2 | 3 | 4 | 5) => {
        updateSplitScreenCount(newScreenCount);
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-teal-500"
                    title="화면 분할"
                >
                    <span className="text-xs font-semibold">{screenCount}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="end"
                className="flex gap-2 p-2 w-auto"
            >
                {([1, 2, 3, 4, 5] as const).map((screenCountOption) => (
                    <Button
                        key={screenCountOption}
                        variant={screenCount === screenCountOption ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handleLayoutChange(screenCountOption)}
                        className="hover:bg-gray-100 text-sm font-medium w-8 h-8 flex items-center justify-center"
                        title={`${screenCountOption}분할 화면`}
                    >
                        {screenCountOption}
                    </Button>
                ))}
            </PopoverContent>
        </Popover>
    );
};