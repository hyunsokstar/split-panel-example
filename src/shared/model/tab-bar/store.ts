// src\shared\model\tab-bar\store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Tab = {
    id: string;
    label: string;
    path: string;
    closable?: boolean;
};

type TabBarState = {
    tabs: Tab[];
    activeTabId: string | null;
    addTab: (tab: Tab) => void;
    removeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;
    getTabById: (tabId: string) => Tab | undefined;
};

export const useTabBarStore = create<TabBarState>()(
    persist(
        (set, get) => ({
            tabs: [],
            activeTabId: null,

            addTab: (tab: Tab) => {
                const { tabs } = get();
                const existingTab = tabs.find((t) => t.id === tab.id);

                if (!existingTab) {
                    set((state) => ({
                        tabs: [...state.tabs, tab],
                        activeTabId: tab.id,
                    }));
                } else {
                    set({ activeTabId: tab.id });
                }
            },

            removeTab: (tabId: string) => {
                const { tabs, activeTabId } = get();
                const filteredTabs = tabs.filter((tab) => tab.id !== tabId);

                // 활성 탭이 삭제되는 경우 다른 탭으로 활성화
                let newActiveTabId = activeTabId;
                if (tabId === activeTabId && filteredTabs.length > 0) {
                    newActiveTabId = filteredTabs[filteredTabs.length - 1].id;
                } else if (filteredTabs.length === 0) {
                    newActiveTabId = null;
                }

                set({
                    tabs: filteredTabs,
                    activeTabId: newActiveTabId,
                });
            },

            setActiveTab: (tabId: string) => {
                set({ activeTabId: tabId });
            },

            getTabById: (tabId: string) => {
                const { tabs } = get();
                return tabs.find((tab) => tab.id === tabId);
            },
        }),
        {
            name: 'tabbar-storage',
        }
    )
);