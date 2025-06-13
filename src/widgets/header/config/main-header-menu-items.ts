// src\widgets\main-layout\header\config\main-header-menu-items.ts

import CallStatus from '@/shared/panels/CallStatus';
import CampaignGroup from '@/shared/panels/CampaignGroup';
import CampaignHistory from '@/shared/panels/CampaignHistory';
import CampaignManage from '@/shared/panels/CampaignManage';
import Dashboard from '@/shared/panels/Dashboard';
import MonitorPanel from '@/shared/panels/MonitorPanel';
import RetryMonitor from '@/shared/panels/RetryMonitor';
import SystemMonitor from '@/shared/panels/SystemMonitor';
import {
    FileText,
    Activity,
    LayoutDashboard,
    Phone,
    Send,
    Repeat,
    ServerCog
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

// 패널 컴포넌트들 import

// React 컴포넌트 타입 (함수형 컴포넌트)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentType = React.ComponentType<any>;

// Define a clear type for menu items
export interface MenuItem {
    id: string;
    name: string;
    icon: LucideIcon;
    component: ComponentType;
}

// Each menu item represents a module that can be opened in a tab
export const MainMenuItems: MenuItem[] = [
    {
        id: 'CampaignGroup',
        name: '캠페인 그룹관리',
        icon: FileText,
        component: CampaignGroup
    },
    {
        id: 'CampaignManage',
        name: '캠페인 관리',
        icon: FileText,
        component: CampaignManage
    },
    {
        id: 'MonitorPanel',
        name: '통합모니터',
        icon: Activity,
        component: MonitorPanel
    },
    {
        id: 'Dashboard',
        name: '종합대시보드',
        icon: LayoutDashboard,
        component: Dashboard
    },
    {
        id: 'CallStatus',
        name: '발신전화상태',
        icon: Phone,
        component: CallStatus
    },
    {
        id: 'CampaignHistory',
        name: '캠페인발송내역',
        icon: Send,
        component: CampaignHistory
    },
    {
        id: 'RetryMonitor',
        name: '재발 모니터',
        icon: Repeat,
        component: RetryMonitor
    },
    {
        id: 'SystemMonitor',
        name: '시스템모니터링',
        icon: ServerCog,
        component: SystemMonitor
    }
]