'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { MainMenuItems } from './config/main-header-menu-items';
import { useTabBarStore } from '@/shared/model/tab-bar/store';

export function Header() {
    const { addTab } = useTabBarStore();

    const handleMenuClick = (item: typeof MainMenuItems[0]) => {
        // 메뉴 클릭 시 탭 추가
        addTab({
            id: item.id,
            label: item.name,
            path: `/${item.id.toLowerCase()}`, // 적절한 경로로 변경하세요
            closable: true,
        });

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
                        <Link href="#" className="flex h-5 w-5 items-center justify-center rounded-sm border border-white/30 text-white hover:bg-white/10">
                            <Settings size={12} />
                        </Link>
                    </div>
                </div>
            </header>

            {/* 메인 메뉴 */}
            <div className="bg-white border-b">
                <div className="flex items-center overflow-x-auto px-3 py-1.5">
                    <div className="flex flex-1 justify-start space-x-3">
                        {MainMenuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.id}
                                    className="group flex flex-col items-center justify-between h-14 px-2 py-1.5 border border-dashed border-transparent hover:border-gray-300 rounded-sm transition-colors relative"
                                    onClick={() => handleMenuClick(item)}
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-gray-50 group-hover:bg-gray-100">
                                        <Icon
                                            size={16}
                                            className="text-gray-600 group-hover:text-teal-500"
                                        />
                                    </div>
                                    <span className="text-xs mt-1 text-gray-600 group-hover:text-teal-500">
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Header