// C:\Users\terec\boiler-plate\boiler-for-rdd\src\shared\model\tab-admin\store.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type screenCountType = 1 | 2 | 3 | 4 | 5
export type SplitDirection = 'horizontal' | 'vertical'

export type Tab = {
    id: string
    label: string
    path: string
    component: React.ComponentType
    closable?: boolean
    panelId: string
}

export type PanelState = {
    id: string
    tabs: Tab[]
    activeTabId: string | null
}

type TabBarState = {
    panels: PanelState[]
    screenCount: screenCountType
    isSplitScreen: boolean
    splitDirection: SplitDirection

    // 탭 관련 액션
    addTab: (tab: Tab) => void
    removeTab: (tabId: string, panelId: string) => void
    setActiveTab: (tabId: string, panelId: string) => void
    moveTab: (tabId: string, sourcePanelId: string, targetPanelId: string) => void
    reorderTabs: (panelId: string, newOrder: string[]) => void

    // 분할 화면 관련 액션
    updateSplitScreenCount: (count: screenCountType) => void
    updateSplitDirection: (direction: SplitDirection) => void

    // === 새로 추가된 패널 제거 액션 ===
    removePanel: (panelId: string) => void
}

export const useTabBarStore = create<TabBarState>()(
    persist(
        (set, get) => ({
            panels: [],
            screenCount: 1,
            isSplitScreen: false,
            splitDirection: 'horizontal',

            // 기존 로직: 화면 분할 수 변경 (ex: 1->3)
            updateSplitScreenCount: (screenCount) => {
                set((state) => {
                    // 패널이 아예 없으면 기본 패널
                    const existingPanels =
                        state.panels.length > 0
                            ? state.panels
                            : [
                                {
                                    id: 'panel-1',
                                    tabs: [],
                                    activeTabId: null,
                                },
                            ]

                    // 기존 패널이 부족하면 새 패널 생성, 많으면 그대로 둠 (앞쪽부터)
                    const newPanels = Array.from({ length: screenCount }, (_, index) => {
                        if (index < existingPanels.length) {
                            return existingPanels[index]
                        }
                        return {
                            id: `panel-${index + 1}`,
                            tabs: [],
                            activeTabId: null,
                        }
                    })

                    return {
                        screenCount,
                        isSplitScreen: screenCount > 1,
                        panels: newPanels,
                    }
                })
            },

            updateSplitDirection: (direction) => {
                set({ splitDirection: direction })
            },

            addTab: (tab) => {
                set((state) => {
                    if (state.panels.length === 0) {
                        state = {
                            ...state,
                            panels: [
                                {
                                    id: 'panel-1',
                                    tabs: [],
                                    activeTabId: null,
                                },
                            ],
                        }
                    }

                    // 이미 존재하는 탭인지 확인
                    const existingPanelWithTab = state.panels.find((panel) =>
                        panel.tabs.some((existingTab) => existingTab.id === tab.id),
                    )

                    // 이미 있으면 활성화만
                    if (existingPanelWithTab) {
                        return {
                            panels: state.panels.map((panel) =>
                                panel.id === existingPanelWithTab.id
                                    ? { ...panel, activeTabId: tab.id }
                                    : panel,
                            ),
                        }
                    }

                    // 타겟 패널
                    const targetPanelId = tab.panelId || 'panel-1'

                    // 새 탭 추가
                    const updatedPanels = state.panels.map((panel) =>
                        panel.id === targetPanelId
                            ? {
                                ...panel,
                                tabs: [
                                    ...panel.tabs,
                                    {
                                        ...tab,
                                        panelId: panel.id,
                                        closable: tab.closable !== undefined ? tab.closable : true,
                                    },
                                ],
                                activeTabId: tab.id,
                            }
                            : panel,
                    )

                    return { panels: updatedPanels }
                })
            },

            removeTab: (tabId, panelId) => {
                set((state) => ({
                    panels: state.panels.map((panel) => {
                        if (panel.id !== panelId) return panel

                        const filteredTabs = panel.tabs.filter((tab) => tab.id !== tabId)
                        const newActiveTabId =
                            panel.activeTabId === tabId && filteredTabs.length > 0
                                ? filteredTabs[filteredTabs.length - 1].id
                                : panel.activeTabId === tabId
                                    ? null
                                    : panel.activeTabId

                        return {
                            ...panel,
                            tabs: filteredTabs,
                            activeTabId: newActiveTabId,
                        }
                    }),
                }))
            },

            setActiveTab: (tabId, panelId) => {
                set((state) => ({
                    panels: state.panels.map((panel) =>
                        panel.id === panelId
                            ? { ...panel, activeTabId: tabId }
                            : panel,
                    ),
                }))
            },

            moveTab: (tabId, sourcePanelId, targetPanelId) => {
                set((state) => {
                    if (sourcePanelId === targetPanelId) {
                        return state
                    }

                    const sourcePanel = state.panels.find(
                        (panel) => panel.id === sourcePanelId,
                    )
                    if (!sourcePanel) return state

                    const tabToMove = sourcePanel.tabs.find((tab) => tab.id === tabId)
                    if (!tabToMove) return state

                    const targetPanel = state.panels.find(
                        (panel) => panel.id === targetPanelId,
                    )
                    if (!targetPanel) return state

                    const tabAlreadyExists = targetPanel.tabs.some(
                        (t) => t.id === tabId,
                    )
                    if (tabAlreadyExists) {
                        // 이미 존재하면 활성화만
                        return {
                            panels: state.panels.map((panel) =>
                                panel.id === targetPanelId
                                    ? { ...panel, activeTabId: tabId }
                                    : panel,
                            ),
                        }
                    }

                    // 새 상태
                    const newPanels = state.panels.map((panel) => {
                        if (panel.id === sourcePanelId) {
                            const filteredTabs = panel.tabs.filter((t) => t.id !== tabId)
                            const newActiveTabId =
                                panel.activeTabId === tabId && filteredTabs.length > 0
                                    ? filteredTabs[filteredTabs.length - 1].id
                                    : panel.activeTabId === tabId
                                        ? null
                                        : panel.activeTabId
                            return {
                                ...panel,
                                tabs: filteredTabs,
                                activeTabId: newActiveTabId,
                            }
                        }
                        if (panel.id === targetPanelId) {
                            const updatedTab = {
                                ...tabToMove,
                                panelId: targetPanelId,
                            }
                            return {
                                ...panel,
                                tabs: [...panel.tabs, updatedTab],
                                activeTabId: updatedTab.id,
                            }
                        }
                        return panel
                    })

                    return { panels: newPanels }
                })
            },

            reorderTabs: (panelId, newOrder) => {
                set((state) => {
                    const panel = state.panels.find((p) => p.id === panelId)
                    if (!panel) return state

                    const tabMap = new Map(panel.tabs.map((tab) => [tab.id, tab]))
                    const reorderedTabs = newOrder
                        .filter((id) => tabMap.has(id))
                        .map((id) => tabMap.get(id)!)

                    return {
                        panels: state.panels.map((p) =>
                            p.id === panelId
                                ? { ...p, tabs: reorderedTabs }
                                : p,
                        ),
                    }
                })
            },

            // === 패널 자체를 제거하는 로직 ===
            removePanel: (panelId: string) => {
                set((state) => {
                    // 해당 panelId를 제외한 새 패널 배열
                    let newPanels = state.panels.filter((p) => p.id !== panelId)

                    // 패널이 모두 사라지면 기본 패널 1개 생성
                    if (newPanels.length === 0) {
                        newPanels = [
                            {
                                id: 'panel-1',
                                tabs: [],
                                activeTabId: null,
                            },
                        ]
                    }

                    const newCount = newPanels.length as screenCountType
                    return {
                        panels: newPanels,
                        screenCount: newCount,
                        isSplitScreen: newCount > 1,
                        splitDirection: state.splitDirection,
                    }
                })
            },
        }),
        {
            name: 'tabbar-storage',
            // 여기서 panels, screenCount, isSplitScreen은 저장하지 않음 => 새로고침 시 초기화
            partialize: (state) => ({
                splitDirection: state.splitDirection,
            }),
        },
    ),
)
