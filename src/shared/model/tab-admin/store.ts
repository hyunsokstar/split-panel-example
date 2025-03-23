// src/shared/model/tab-admin/store.ts
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

export type PanelState = {
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
    reorderTabs: (panelId: string, newOrder: string[]) => void;

    // 분할 화면 관련 액션
    updateSplitScreenCount: (count: screenCountType) => void;
    updateSplitDirection: (direction: SplitDirection) => void;

    // 패널 자체 제거 액션
    removePanel: (panelId: string) => void;

    // 패널 순서 변경 액션
    reorderPanels: (activeId: string, overId: string) => void;
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
                    // 패널이 비어 있다면 기본 패널 생성
                    const existingPanels = state.panels.length > 0 ? state.panels : [{
                        id: 'panel-1',
                        tabs: [],
                        activeTabId: null
                    }];

                    // 기존 패널 개수가 부족하면 새 패널 생성, 많으면 앞쪽부터 사용하고, 재할당
                    const newPanels = Array.from({ length: screenCount }, (_, index) => {
                        if (index < existingPanels.length) {
                            return {
                                ...existingPanels[index],
                                id: `panel-${index + 1}`,
                            };
                        }
                        return {
                            id: `panel-${index + 1}`,
                            tabs: [],
                            activeTabId: null
                        };
                    });

                    return {
                        screenCount,
                        isSplitScreen: screenCount > 1,
                        panels: newPanels,
                    };
                });
            },

            updateSplitDirection: (direction) => {
                set({ splitDirection: direction });
            },

            addTab: (tab) => {
                set((state) => {
                    if (state.panels.length === 0) {
                        state = {
                            ...state,
                            panels: [{
                                id: 'panel-1',
                                tabs: [],
                                activeTabId: null
                            }]
                        };
                    }

                    const existingPanelWithTab = state.panels.find(panel =>
                        panel.tabs.some(existingTab => existingTab.id === tab.id)
                    );

                    if (existingPanelWithTab) {
                        return {
                            panels: state.panels.map(panel =>
                                panel.id === existingPanelWithTab.id
                                    ? { ...panel, activeTabId: tab.id }
                                    : panel
                            )
                        };
                    }

                    const targetPanelId = tab.panelId || 'panel-1';

                    const updatedPanels = state.panels.map(panel =>
                        panel.id === targetPanelId
                            ? {
                                ...panel,
                                tabs: [...panel.tabs, {
                                    ...tab,
                                    panelId: panel.id,
                                    closable: tab.closable !== undefined ? tab.closable : true
                                }],
                                activeTabId: tab.id
                            }
                            : panel
                    );

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
                            : panel.activeTabId === tabId ? null : panel.activeTabId;

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
                    if (sourcePanelId === targetPanelId) {
                        return state;
                    }

                    const sourcePanel = state.panels.find(panel => panel.id === sourcePanelId);
                    if (!sourcePanel) return state;

                    const tabToMove = sourcePanel.tabs.find(tab => tab.id === tabId);
                    if (!tabToMove) return state;

                    const targetPanel = state.panels.find(panel => panel.id === targetPanelId);
                    if (!targetPanel) return state;

                    const tabAlreadyExists = targetPanel.tabs.some(tab => tab.id === tabId);
                    if (tabAlreadyExists) {
                        return {
                            panels: state.panels.map(panel => {
                                if (panel.id === targetPanelId) {
                                    return { ...panel, activeTabId: tabId };
                                }
                                return panel;
                            })
                        };
                    }

                    const newPanels = state.panels.map(panel => {
                        if (panel.id === sourcePanelId) {
                            const filteredTabs = panel.tabs.filter(tab => tab.id !== tabId);
                            const newActiveTabId = panel.activeTabId === tabId && filteredTabs.length > 0
                                ? filteredTabs[filteredTabs.length - 1].id
                                : panel.activeTabId === tabId ? null : panel.activeTabId;
                            return {
                                ...panel,
                                tabs: filteredTabs,
                                activeTabId: newActiveTabId,
                            };
                        }
                        if (panel.id === targetPanelId) {
                            const updatedTab = { ...tabToMove, panelId: targetPanelId };
                            return {
                                ...panel,
                                tabs: [...panel.tabs, updatedTab],
                                activeTabId: updatedTab.id,
                            };
                        }
                        return panel;
                    });

                    return { panels: newPanels };
                });
            },

            reorderTabs: (panelId, newOrder) => {
                set((state) => {
                    const panel = state.panels.find(p => p.id === panelId);
                    if (!panel) return state;

                    const tabMap = new Map(panel.tabs.map(tab => [tab.id, tab]));
                    const reorderedTabs = newOrder
                        .filter(id => tabMap.has(id))
                        .map(id => tabMap.get(id)!);

                    return {
                        panels: state.panels.map(p =>
                            p.id === panelId ? { ...p, tabs: reorderedTabs } : p
                        )
                    };
                });
            },

            // 패널 제거 액션: 해당 panelId만 제거 후, 남은 패널에 대해 ID를 재할당
            removePanel: (panelId: string) => {
                set((state) => {
                    let newPanels = state.panels.filter(p => p.id !== panelId);

                    // 패널이 모두 사라지면 기본 패널 생성
                    if (newPanels.length === 0) {
                        newPanels = [{
                            id: 'panel-1',
                            tabs: [],
                            activeTabId: null,
                        }];
                    } else {
                        // 남은 패널의 ID를 새로 할당 (예: panel-1, panel-2, ...)
                        newPanels = newPanels.map((panel, index) => ({
                            ...panel,
                            id: `panel-${index + 1}`,
                        }));
                    }

                    const newCount = newPanels.length as screenCountType;
                    return {
                        panels: newPanels,
                        screenCount: newCount,
                        isSplitScreen: newCount > 1,
                        splitDirection: state.splitDirection,
                    };
                });
            },

            // 패널 순서 변경 액션
            // src/shared/model/tab-admin/store.ts

            reorderPanels: (activeId, overId) => {
                set((state) => {
                    const oldIndex = state.panels.findIndex(p => p.id === activeId);
                    const newIndex = state.panels.findIndex(p => p.id === overId);

                    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
                        return state;
                    }

                    const newPanels = [...state.panels];
                    const [removedPanel] = newPanels.splice(oldIndex, 1);
                    newPanels.splice(newIndex, 0, removedPanel);

                    // ID 재할당하지 않고 순서만 업데이트
                    return { ...state, panels: newPanels };
                });
            },

        }),
        {
            name: 'tabbar-storage',
            // 저장에서 splitDirection만 복원하도록 설정
            partialize: (state) => ({
                splitDirection: state.splitDirection,
            }),
        },
    ),
);