export const googleAdsDemoData = {
  generatedAt: '2026-03-05T09:30:00+09:00',
  account: {
    accountId: '123-456-7890',
    customerId: '9988776655',
    currency: 'KRW',
    timezone: 'Asia/Seoul'
  },
  guardrails: {
    maxBudgetChangeRatio: 0.3,
    minTargetRoas: 250,
    maxTargetRoas: 650,
    requiredNegativeKeywordCount: 3
  },
  campaignSettings: {
    cmp_kr_oled_search: {
      campaignId: 'cmp_kr_oled_search',
      campaignName: 'KR | OLED TV | Search | Core',
      campaignType: 'SEARCH',
      biddingStrategy: 'TARGET_ROAS',
      targetRoas: 430,
      dailyBudgetKrw: 1200000,
      network: ['SEARCH'],
      adSchedule: ['Mon-Fri 08:00-23:00'],
      geoBidAdjustments: [
        { region: 'Seoul', adjustmentPct: 0 },
        { region: 'Busan', adjustmentPct: 0 }
      ],
      negativeKeywords: ['free', 'manual pdf', 'used'],
      isLocked: false
    },
    cmp_kr_aircon_pmax: {
      campaignId: 'cmp_kr_aircon_pmax',
      campaignName: 'KR | Aircon | PMax | Scale',
      campaignType: 'PERFORMANCE_MAX',
      biddingStrategy: 'MAXIMIZE_CONVERSION_VALUE',
      targetRoas: 320,
      dailyBudgetKrw: 950000,
      network: ['PMax'],
      adSchedule: ['All days 00:00-24:00'],
      geoBidAdjustments: [
        { region: 'Seoul', adjustmentPct: 0 },
        { region: 'Gyeonggi', adjustmentPct: 0 }
      ],
      negativeKeywords: ['install guide'],
      isLocked: false
    },
    cmp_kr_washer_video: {
      campaignId: 'cmp_kr_washer_video',
      campaignName: 'KR | Washer | Video | Reach',
      campaignType: 'VIDEO',
      biddingStrategy: 'TARGET_CPM',
      targetRoas: 0,
      dailyBudgetKrw: 600000,
      network: ['YOUTUBE_VIDEO'],
      adSchedule: ['Mon-Sun 09:00-23:00'],
      geoBidAdjustments: [
        { region: 'Seoul', adjustmentPct: 0 },
        { region: 'Daegu', adjustmentPct: 0 }
      ],
      negativeKeywords: ['kids toy', 'game'],
      isLocked: true
    }
  },
  recentPerformanceByCampaign: {
    cmp_kr_oled_search: {
      period: '최근 14일',
      impressions: 892110,
      clicks: 26145,
      costKrw: 15980000,
      conversions: 1521,
      conversionValueKrw: 75420000,
      ctrPct: 2.93,
      cvrPct: 5.82,
      cpaKrw: 10506,
      roas: 4.72,
      impressionShareLostBudgetPct: 26.2
    },
    cmp_kr_aircon_pmax: {
      period: '최근 14일',
      impressions: 1241120,
      clicks: 18950,
      costKrw: 14240000,
      conversions: 742,
      conversionValueKrw: 42200000,
      ctrPct: 1.53,
      cvrPct: 3.91,
      cpaKrw: 19191,
      roas: 2.96,
      impressionShareLostBudgetPct: 9.1
    },
    cmp_kr_washer_video: {
      period: '최근 14일',
      impressions: 3102500,
      clicks: 21472,
      costKrw: 9020000,
      conversions: 133,
      conversionValueKrw: 11650000,
      ctrPct: 0.69,
      cvrPct: 0.62,
      cpaKrw: 67820,
      roas: 1.29,
      impressionShareLostBudgetPct: 4.8
    }
  },
  insights: [
    {
      insightId: 'ins_kr_search_budget_ceiling',
      campaignId: 'cmp_kr_oled_search',
      signalKey: 'HIGH_ROAS_BUDGET_LIMIT',
      title: 'KR OLED Search: 고ROAS 대비 예산 손실률이 높음',
      summary:
        '최근 14일 ROAS 4.72x를 유지하지만 예산 손실률이 26.2%로 높습니다. 성과 구간을 충분히 커버하지 못하고 있습니다.',
      confidence: 0.92,
      expectedImpact: {
        conversionLiftPct: 11.4,
        revenueLiftPct: 15.8,
        cpaChangePct: -6.1
      },
      topEvidence: [
        '요일별 오전 10시-13시 구간에서 전환단가 13% 우수',
        '브랜드+제품 키워드군에서 ROAS 5.1x',
        '검색 상단 노출 손실 중 67%가 예산 제한으로 발생'
      ]
    },
    {
      insightId: 'ins_kr_pmax_cpa_rise',
      campaignId: 'cmp_kr_aircon_pmax',
      signalKey: 'CPA_RISING_BROAD_AUDIENCE',
      title: 'KR Aircon PMax: CPA 상승, 저효율 검색어 유입 증가',
      summary:
        'PMax에서 비용 증가 대비 전환이 둔화되었습니다. 저의도 검색어 노출 비중이 높아지고 있습니다.',
      confidence: 0.86,
      expectedImpact: {
        conversionLiftPct: 6.3,
        revenueLiftPct: 9.7,
        cpaChangePct: -12.4
      },
      topEvidence: [
        '지난 7일 CPA가 직전 7일 대비 +18.9%',
        '신규 유입 검색어 중 비브랜드 비중 74%',
        '장바구니 이탈 후 리마케팅 전환율은 +9.2%'
      ]
    },
    {
      insightId: 'ins_kr_video_ctr_drop',
      campaignId: 'cmp_kr_washer_video',
      signalKey: 'CTR_DROP_CREATIVE_FATIGUE',
      title: 'KR Washer Video: CTR 하락, 크리에이티브 피로도 의심',
      summary:
        '동일 소재 반복 노출로 CTR이 하락하고 있습니다. 교체 주기와 타게팅 범위 조정이 필요합니다.',
      confidence: 0.81,
      expectedImpact: {
        conversionLiftPct: 4.2,
        revenueLiftPct: 6.6,
        cpaChangePct: -7.8
      },
      topEvidence: [
        '동일 썸네일의 빈도 상위 3개 소재 CTR 평균 0.52%',
        '재생 완료율은 유지되나 클릭 전환은 감소',
        '광고 회상 상승 대비 유입 품질 저하'
      ]
    }
  ],
  historicalCases: [
    {
      caseId: 'case_jp_oled_search_2025_q4',
      signalKey: 'HIGH_ROAS_BUDGET_LIMIT',
      market: 'JP',
      product: 'OLED TV',
      campaignType: 'SEARCH',
      period: '2025-10-01 ~ 2025-10-28',
      before: {
        dailyBudgetKrw: 980000,
        targetRoas: 410,
        roas: 4.11,
        cpaKrw: 42800,
        impressionShareLostBudgetPct: 31.4
      },
      appliedSettings: {
        dailyBudgetKrw: 1260000,
        targetRoas: 450,
        biddingStrategy: 'TARGET_ROAS',
        adSchedule: ['Mon-Fri 08:00-23:00', 'Sat-Sun 10:00-22:00'],
        geoBidAdjustments: [
          { region: 'Tokyo', adjustmentPct: 12 },
          { region: 'Osaka', adjustmentPct: 8 }
        ],
        negativeKeywords: ['free', 'repair', 'used', 'manual pdf']
      },
      after14d: {
        roas: 4.63,
        cpaKrw: 38500,
        impressionShareLostBudgetPct: 13.1,
        conversionLiftPct: 17.8,
        revenueLiftPct: 21.2
      }
    },
    {
      caseId: 'case_de_oled_search_2025_q3',
      signalKey: 'HIGH_ROAS_BUDGET_LIMIT',
      market: 'DE',
      product: 'OLED TV',
      campaignType: 'SEARCH',
      period: '2025-07-14 ~ 2025-08-10',
      before: {
        dailyBudgetKrw: 1100000,
        targetRoas: 430,
        roas: 3.92,
        cpaKrw: 43900,
        impressionShareLostBudgetPct: 24.7
      },
      appliedSettings: {
        dailyBudgetKrw: 1350000,
        targetRoas: 470,
        biddingStrategy: 'TARGET_ROAS',
        adSchedule: ['Mon-Fri 09:00-23:00'],
        geoBidAdjustments: [
          { region: 'Berlin', adjustmentPct: 10 },
          { region: 'Munich', adjustmentPct: 7 }
        ],
        negativeKeywords: ['free', 'forum', 'used']
      },
      after14d: {
        roas: 4.44,
        cpaKrw: 40100,
        impressionShareLostBudgetPct: 11.8,
        conversionLiftPct: 13.9,
        revenueLiftPct: 16.7
      }
    },
    {
      caseId: 'case_uk_aircon_pmax_2025_q4',
      signalKey: 'CPA_RISING_BROAD_AUDIENCE',
      market: 'UK',
      product: 'Air Conditioner',
      campaignType: 'PERFORMANCE_MAX',
      period: '2025-11-03 ~ 2025-11-30',
      before: {
        dailyBudgetKrw: 930000,
        targetRoas: 300,
        roas: 2.61,
        cpaKrw: 24800,
        impressionShareLostBudgetPct: 8.2
      },
      appliedSettings: {
        dailyBudgetKrw: 1020000,
        targetRoas: 340,
        biddingStrategy: 'MAXIMIZE_CONVERSION_VALUE',
        adSchedule: ['All days 06:00-24:00'],
        geoBidAdjustments: [
          { region: 'London', adjustmentPct: 9 },
          { region: 'Birmingham', adjustmentPct: 4 }
        ],
        negativeKeywords: ['cheap parts', 'repair', 'remote only']
      },
      after14d: {
        roas: 3.14,
        cpaKrw: 21000,
        impressionShareLostBudgetPct: 7.3,
        conversionLiftPct: 9.2,
        revenueLiftPct: 14.3
      }
    },
    {
      caseId: 'case_us_washer_video_2025_q2',
      signalKey: 'CTR_DROP_CREATIVE_FATIGUE',
      market: 'US',
      product: 'Washer',
      campaignType: 'VIDEO',
      period: '2025-04-07 ~ 2025-05-05',
      before: {
        dailyBudgetKrw: 670000,
        targetRoas: 0,
        roas: 1.18,
        cpaKrw: 72100,
        impressionShareLostBudgetPct: 5.9
      },
      appliedSettings: {
        dailyBudgetKrw: 640000,
        targetRoas: 0,
        biddingStrategy: 'TARGET_CPM',
        adSchedule: ['Mon-Sun 10:00-24:00'],
        geoBidAdjustments: [
          { region: 'California', adjustmentPct: 8 },
          { region: 'Texas', adjustmentPct: 5 }
        ],
        negativeKeywords: ['kids toy', 'game', 'funny clip']
      },
      after14d: {
        roas: 1.36,
        cpaKrw: 66200,
        impressionShareLostBudgetPct: 5.1,
        conversionLiftPct: 5.7,
        revenueLiftPct: 7.4
      }
    }
  ],
  apiBlueprint: {
    method: 'POST',
    endpointTemplate:
      'https://googleads.googleapis.com/v18/customers/{customerId}/campaignBudgets:mutate',
    requiredScopes: ['https://www.googleapis.com/auth/adwords'],
    validationMode: 'DRY_RUN_THEN_COMMIT'
  }
};
