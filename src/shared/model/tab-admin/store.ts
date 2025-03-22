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
                    // 패널이 비어 있다면 초기화
                    const existingPanels = state.panels.length > 0 ? state.panels : [{
                        id: 'panel-1',
                        tabs: [],
                        activeTabId: null
                    }];

                    const existingTabs = existingPanels[0]?.tabs || [];

                    const newPanels = Array.from({ length: screenCount }, (_, index) => {
                        // 기존 패널 정보 유지
                        if (index < existingPanels.length) {
                            return existingPanels[index];
                        }

                        // 새 패널 추가
                        return {
                            id: `panel-${index + 1}`,
                            tabs: [],
                            activeTabId: null
                        };
                    });

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

                    // Initialize panels if they don't exist
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

                    // 이미 존재하는 탭인지 확인 (전체 패널에서)
                    const existingPanelWithTab = state.panels.find(panel =>
                        panel.tabs.some(existingTab => existingTab.id === tab.id)
                    );

                    // 이미 존재하는 탭이 있는 경우 해당 패널의 활성 탭을 변경
                    if (existingPanelWithTab) {
                        console.log('Tab already exists in panel:', existingPanelWithTab);
                        return {
                            panels: state.panels.map(panel =>
                                panel.id === existingPanelWithTab.id
                                    ? { ...panel, activeTabId: tab.id }
                                    : panel
                            )
                        };
                    }

                    // 타겟 패널 ID 결정 (전달된 panelId 사용 또는 기본값 사용)
                    const targetPanelId = tab.panelId || 'panel-1';

                    // 해당 패널에 탭 추가
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
                console.log(`Setting active tab: ${tabId} in panel: ${panelId}`);
                set((state) => ({
                    panels: state.panels.map(panel =>
                        panel.id === panelId
                            ? { ...panel, activeTabId: tabId }
                            : panel
                    )
                }));
            },

            moveTab: (tabId, sourcePanelId, targetPanelId) => {
                console.log(`Moving tab ${tabId} from ${sourcePanelId} to ${targetPanelId}`);

                set((state) => {
                    // 패널이 같으면 아무것도 하지 않음
                    if (sourcePanelId === targetPanelId) {
                        return state;
                    }

                    // 소스 패널에서 탭 찾기
                    const sourcePanel = state.panels.find(panel => panel.id === sourcePanelId);
                    if (!sourcePanel) {
                        console.error('Source panel not found:', sourcePanelId);
                        return state;
                    }

                    const tabToMove = sourcePanel.tabs.find(tab => tab.id === tabId);
                    if (!tabToMove) {
                        console.error('Tab to move not found:', tabId);
                        return state;
                    }

                    // 타겟 패널에 이미 같은 ID의 탭이 있는지 확인
                    const targetPanel = state.panels.find(panel => panel.id === targetPanelId);
                    if (!targetPanel) {
                        console.error('Target panel not found:', targetPanelId);
                        return state;
                    }

                    const tabAlreadyExists = targetPanel.tabs.some(tab => tab.id === tabId);
                    if (tabAlreadyExists) {
                        console.log('Tab already exists in target panel');
                        // 이미 존재하면 타겟 패널에서 활성화만 처리
                        return {
                            panels: state.panels.map(panel => {
                                if (panel.id === targetPanelId) {
                                    return { ...panel, activeTabId: tabId };
                                }
                                return panel;
                            })
                        };
                    }

                    // 새 패널 상태 계산
                    const newPanels = state.panels.map(panel => {
                        if (panel.id === sourcePanelId) {
                            // 소스 패널에서 탭 제거
                            const filteredTabs = panel.tabs.filter(tab => tab.id !== tabId);
                            const newActiveTabId = panel.activeTabId === tabId && filteredTabs.length > 0
                                ? filteredTabs[filteredTabs.length - 1].id
                                : panel.activeTabId === tabId ? null : panel.activeTabId;

                            return {
                                ...panel,
                                tabs: filteredTabs,
                                activeTabId: newActiveTabId
                            };
                        }

                        if (panel.id === targetPanelId) {
                            // 타겟 패널에 탭 추가
                            const updatedTab = {
                                ...tabToMove,
                                panelId: targetPanelId  // 패널 ID 업데이트
                            };

                            return {
                                ...panel,
                                tabs: [...panel.tabs, updatedTab],
                                activeTabId: updatedTab.id // 새로 추가된 탭을 활성 탭으로 설정
                            };
                        }

                        return panel;
                    });

                    console.log('New panels after move:', newPanels);
                    return { panels: newPanels };
                });
            },

            reorderTabs: (panelId, newOrder) => {
                set((state) => {
                    const panel = state.panels.find(p => p.id === panelId);
                    if (!panel) return state;

                    // Create a map for quick lookup
                    const tabMap = new Map(panel.tabs.map(tab => [tab.id, tab]));

                    // Reorder tabs based on newOrder
                    const reorderedTabs = newOrder
                        .filter(id => tabMap.has(id))
                        .map(id => tabMap.get(id)!);

                    return {
                        panels: state.panels.map(p =>
                            p.id === panelId
                                ? { ...p, tabs: reorderedTabs }
                                : p
                        )
                    };
                });
            }
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