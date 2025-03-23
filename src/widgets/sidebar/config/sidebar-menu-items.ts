export type ItemType = 'organization' | 'tenant' | 'campaign';
export type ItemStatus = 'active' | 'inactive' | 'warning';

export interface SidebarItem {
  id: string;
  label: string;
  type: ItemType;
  status?: ItemStatus;
  href?: string;
  children?: SidebarItem[];
}

// 캠페인 관리 사이드바 설정
export const campaignConfig: SidebarItem[] = [
  {
    id: 'nexus-cc',
    label: 'NEXUS Call Center',
    type: 'organization',
    children: [
      {
        id: 'sk-telecom',
        label: 'SK Telecom',
        type: 'tenant',
        children: [
          {
            id: 'sk-mobile-support',
            label: '모바일 상품 지원',
            type: 'campaign',
            status: 'active',
            href: '/campaign/sk-mobile'
          },
          {
            id: 'sk-internet-support',
            label: '인터넷 장애 상담',
            type: 'campaign',
            status: 'active',
            href: '/campaign/sk-internet'
          },
          {
            id: 'sk-bill-inquiry',
            label: '요금 문의',
            type: 'campaign',
            status: 'inactive',
            href: '/campaign/sk-bill'
          },
          {
            id: 'sk-new-services',
            label: '신규 서비스 안내',
            type: 'campaign',
            status: 'active',
            href: '/campaign/sk-new'
          }
        ]
      },
      {
        id: 'lg-uplus',
        label: 'LG U+',
        type: 'tenant',
        children: [
          {
            id: 'lg-tech-support',
            label: '기술 지원',
            type: 'campaign',
            status: 'active',
            href: '/campaign/lg-tech'
          },
          {
            id: 'lg-customer-complaints',
            label: '고객 불만 접수',
            type: 'campaign',
            status: 'warning',
            href: '/campaign/lg-complaints'
          },
          {
            id: 'lg-sales-inquiry',
            label: '상품 구매 문의',
            type: 'campaign',
            status: 'active',
            href: '/campaign/lg-sales'
          }
        ]
      },
      {
        id: 'kt',
        label: 'KT',
        type: 'tenant',
        children: [
          {
            id: 'kt-residential',
            label: '가정용 서비스',
            type: 'campaign',
            status: 'active',
            href: '/campaign/kt-residential'
          },
          {
            id: 'kt-business',
            label: '기업 고객 관리',
            type: 'campaign',
            status: 'active',
            href: '/campaign/kt-business'
          },
          {
            id: 'kt-retention',
            label: '해지 방어',
            type: 'campaign',
            status: 'warning',
            href: '/campaign/kt-retention'
          }
        ]
      }
    ]
  }
];

// 상담원 관리 사이드바 설정
export const userConfig: SidebarItem[] = [
  {
    id: 'user-management',
    label: '상담원 관리 센터',
    type: 'organization',
    children: [
      {
        id: 'active-users',
        label: '활성 상담원',
        type: 'tenant',
        children: [
          {
            id: 'full-time',
            label: '정규직 상담원',
            type: 'campaign',
            status: 'active',
            href: '/users/full-time'
          },
          {
            id: 'part-time',
            label: '파트타임 상담원',
            type: 'campaign',
            status: 'active',
            href: '/users/part-time'
          }
        ]
      },
      {
        id: 'user-performance',
        label: '상담원 성과',
        type: 'tenant',
        children: [
          {
            id: 'weekly-reports',
            label: '주간 리포트',
            type: 'campaign',
            status: 'active',
            href: '/users/weekly-reports'
          },
          {
            id: 'monthly-reports',
            label: '월간 리포트',
            type: 'campaign',
            status: 'active',
            href: '/users/monthly-reports'
          },
          {
            id: 'performance-issues',
            label: '성과 이슈',
            type: 'campaign',
            status: 'warning',
            href: '/users/performance-issues'
          }
        ]
      }
    ]
  }
];

// 캠페인 그룹 관리 사이드바 설정
export const groupConfig: SidebarItem[] = [
  {
    id: 'campaign-groups',
    label: '캠페인 그룹 센터',
    type: 'organization',
    children: [
      {
        id: 'telecom-groups',
        label: '통신사 그룹',
        type: 'tenant',
        children: [
          {
            id: 'mobile-group',
            label: '모바일 캠페인',
            type: 'campaign',
            status: 'active',
            href: '/groups/mobile'
          },
          {
            id: 'internet-group',
            label: '인터넷 캠페인',
            type: 'campaign',
            status: 'active',
            href: '/groups/internet'
          }
        ]
      },
      {
        id: 'finance-groups',
        label: '금융 그룹',
        type: 'tenant',
        children: [
          {
            id: 'insurance-group',
            label: '보험 캠페인',
            type: 'campaign',
            status: 'warning',
            href: '/groups/insurance'
          },
          {
            id: 'loan-group',
            label: '대출 캠페인',
            type: 'campaign',
            status: 'active',
            href: '/groups/loan'
          }
        ]
      }
    ]
  }
];