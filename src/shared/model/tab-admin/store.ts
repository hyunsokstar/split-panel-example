import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type screenCountType = 1 | 2 | 3 | 4 | 5;
export type SplitDirection = 'horizontal' | 'vertical';

export type Tab = {
    id: string;
    label: string;
    path: string;
    component: React.ComponentType;
    closable?: boolean;
    panelId: string;
};

type PanelState = {
    id: string;
    tabs: Tab[];
    activeTabId: string | null;
};

type TabBarState = {
    panels: PanelState[];
    screenCount: screenCountType;
    isSplitScreen: boolean;
    splitDirection: SplitDirection;

    // 탭 관련 액션
    addTab: (tab: Tab) => void;
    removeTab: (tabId: string, panelId: string) => void;
    setActiveTab: (tabId: string, panelId: string) => void;
    moveTab: (tabId: string, sourcePanelId: string, targetPanelId: string) => void;

    // 분할 화면 관련 액션
    updateSplitScreenCount: (count: screenCountType) => void;
    updateSplitDirection: (direction: SplitDirection) => void;
};

export const useTabBarStore = create<TabBarState>()(
    persist(
        (set, get) => ({
            panels: [],
            screenCount: 1,
            isSplitScreen: false,
            splitDirection: 'horizontal',

            updateSplitScreenCount: (screenCount) => {
                set((state) => {
                    const existingTabs = state.panels[0]?.tabs || [];

                    const newPanels = Array.from({ length: screenCount }, (_, index) => ({
                        id: `panel-${index + 1}`,
                        tabs: index === 0 ? existingTabs : [],
                        activeTabId: index === 0 && existingTabs.length > 0
                            ? existingTabs[existingTabs.length - 1].id
                            : null
                    }));

                    return {
                        screenCount,
                        isSplitScreen: screenCount > 1,
                        panels: newPanels
                    };
                });
            },

            updateSplitDirection: (direction) => {
                set({ splitDirection: direction });
            },

            addTab: (tab) => {
                set((state) => {
                    console.log('Adding tab:', tab);
                    console.log('Current panels:', state.panels);

                    // 이미 존재하는 탭인지 확인
                    const existingPanel = state.panels.find(panel =>
                        panel.tabs.some(existingTab => existingTab.id === tab.id)
                    );

                    // 이미 존재하는 탭이 있는 경우 해당 패널의 활성 탭을 변경
                    if (existingPanel) {
                        console.log('Tab already exists in panel:', existingPanel);
                        return {
                            panels: state.panels.map(panel =>
                                panel.id === existingPanel.id
                                    ? { ...panel, activeTabId: tab.id }
                                    : panel
                            )
                        };
                    }

                    // 첫 번째 패널에 탭 추가
                    const updatedPanels = state.panels.map((panel, index) =>
                        index === 0
                            ? {
                                ...panel,
                                tabs: [...panel.tabs, {
                                    ...tab,
                                    panelId: panel.id,
                                    closable: true // 명시적으로 closable 설정
                                }],
                                activeTabId: tab.id
                            }
                            : panel
                    );

                    console.log('Updated panels:', updatedPanels);

                    return { panels: updatedPanels };
                });
            },

            removeTab: (tabId, panelId) => {
                set((state) => ({
                    panels: state.panels.map(panel => {
                        if (panel.id !== panelId) return panel;

                        const filteredTabs = panel.tabs.filter(tab => tab.id !== tabId);

                        const newActiveTabId = panel.activeTabId === tabId && filteredTabs.length > 0
                            ? filteredTabs[filteredTabs.length - 1].id
                            : panel.activeTabId;

                        return {
                            ...panel,
                            tabs: filteredTabs,
                            activeTabId: newActiveTabId
                        };
                    })
                }));
            },

            setActiveTab: (tabId, panelId) => {
                set((state) => ({
                    panels: state.panels.map(panel =>
                        panel.id === panelId
                            ? { ...panel, activeTabId: tabId }
                            : panel
                    )
                }));
            },

            moveTab: (tabId, sourcePanelId, targetPanelId) => {
                set((state) => {
                    const tabToMove = state.panels
                        .find(panel => panel.id === sourcePanelId)
                        ?.tabs.find(tab => tab.id === tabId);

                    if (!tabToMove) return state;

                    return {
                        panels: state.panels.map(panel => {
                            if (panel.id === sourcePanelId) {
                                const filteredTabs = panel.tabs.filter(tab => tab.id !== tabId);
                                return {
                                    ...panel,
                                    tabs: filteredTabs,
                                    activeTabId: filteredTabs.length > 0
                                        ? filteredTabs[filteredTabs.length - 1].id
                                        : null
                                };
                            }

                            if (panel.id === targetPanelId) {
                                const updatedTab = { ...tabToMove, panelId: targetPanelId };
                                return {
                                    ...panel,
                                    tabs: [...panel.tabs, updatedTab],
                                    activeTabId: updatedTab.id
                                };
                            }

                            return panel;
                        })
                    };
                });
            },
        }),
        {
            name: 'tabbar-storage',
            partialize: (state) => ({
                panels: state.panels,
                screenCount: state.screenCount,
                isSplitScreen: state.isSplitScreen,
                splitDirection: state.splitDirection
            })
        }
    )
);