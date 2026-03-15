'use client';

import { useMemo, useState } from 'react';
import { googleAdsDemoData } from '../app/data/googleAdsDemoData';

const flowTabs = [
  { id: 'insight', label: '1) 최근 인사이트' },
  { id: 'recommendation', label: '2) 추천 설정' },
  { id: 'automation', label: '3) API 자동 적용' }
];

function formatKrw(value) {
  return `${Number(value).toLocaleString('ko-KR')}원`;
}

function formatPct(value, digits = 1) {
  if (value === null || value === undefined) return '-';
  return `${Number(value).toFixed(digits)}%`;
}

function formatDiffPct(value, digits = 1) {
  if (value === null || value === undefined) return '-';
  const fixed = Number(value).toFixed(digits);
  return `${Number(value) > 0 ? '+' : ''}${fixed}%`;
}

function toRoundedBudget(value) {
  return Math.round(value / 10000) * 10000;
}

function buildRecommendation(insight, currentSetting, cases) {
  if (!insight || !currentSetting || !cases.length) {
    return null;
  }

  const sortedCases = [...cases].sort(
    (a, b) => b.after14d.revenueLiftPct - a.after14d.revenueLiftPct
  );
  const topCases = sortedCases.slice(0, 2);

  const avgBudgetMultiplier =
    topCases.reduce((acc, item) => acc + item.appliedSettings.dailyBudgetKrw / item.before.dailyBudgetKrw, 0) /
    topCases.length;

  const nextBudget = toRoundedBudget(currentSetting.dailyBudgetKrw * avgBudgetMultiplier);

  const avgTargetRoas =
    topCases.reduce((acc, item) => acc + item.appliedSettings.targetRoas, 0) / topCases.length;

  const pickedSchedule = topCases[0].appliedSettings.adSchedule;
  const pickedGeoAdjustments = topCases[0].appliedSettings.geoBidAdjustments;

  const mergedNegativeKeywords = Array.from(
    new Set([
      ...currentSetting.negativeKeywords,
      ...topCases.flatMap((item) => item.appliedSettings.negativeKeywords)
    ])
  ).slice(0, 8);

  return {
    sourceCaseIds: topCases.map((item) => item.caseId),
    confidence: Math.min(
      0.99,
      Number(
        (
          insight.confidence *
          (1 + topCases.reduce((acc, item) => acc + item.after14d.revenueLiftPct, 0) / 200)
        ).toFixed(2)
      )
    ),
    settings: {
      biddingStrategy: topCases[0].appliedSettings.biddingStrategy,
      targetRoas:
        currentSetting.targetRoas > 0 ? Math.round(avgTargetRoas / 10) * 10 : currentSetting.targetRoas,
      dailyBudgetKrw: nextBudget,
      adSchedule: pickedSchedule,
      geoBidAdjustments: pickedGeoAdjustments,
      negativeKeywords: mergedNegativeKeywords
    }
  };
}

function runPreflightChecks(currentSetting, recommendation, guardrails) {
  if (!currentSetting || !recommendation) {
    return { passAll: false, checks: [] };
  }

  const budgetChangeRatio =
    Math.abs(recommendation.settings.dailyBudgetKrw - currentSetting.dailyBudgetKrw) /
    currentSetting.dailyBudgetKrw;

  const targetRoasCheckRequired = recommendation.settings.targetRoas > 0;
  const checks = [
    {
      code: 'BUDGET_CHANGE_RATIO',
      name: '예산 변경폭 제한',
      pass: budgetChangeRatio <= guardrails.maxBudgetChangeRatio,
      detail: `현재 ${formatKrw(currentSetting.dailyBudgetKrw)} -> 추천 ${formatKrw(
        recommendation.settings.dailyBudgetKrw
      )} (${formatDiffPct((recommendation.settings.dailyBudgetKrw / currentSetting.dailyBudgetKrw - 1) * 100, 1)})`
    },
    {
      code: 'TARGET_ROAS_RANGE',
      name: 'Target ROAS 허용 범위',
      pass:
        !targetRoasCheckRequired ||
        (recommendation.settings.targetRoas >= guardrails.minTargetRoas &&
          recommendation.settings.targetRoas <= guardrails.maxTargetRoas),
      detail: targetRoasCheckRequired
        ? `추천값 ${recommendation.settings.targetRoas}% (허용 ${guardrails.minTargetRoas}%~${guardrails.maxTargetRoas}%)`
        : 'ROAS 기반 입찰이 아닌 캠페인으로 검사 제외'
    },
    {
      code: 'NEGATIVE_KEYWORD_MINIMUM',
      name: '제외키워드 최소 개수',
      pass: recommendation.settings.negativeKeywords.length >= guardrails.requiredNegativeKeywordCount,
      detail: `추천 제외키워드 ${recommendation.settings.negativeKeywords.length}개 (최소 ${guardrails.requiredNegativeKeywordCount}개)`
    },
    {
      code: 'CAMPAIGN_LOCK_STATUS',
      name: '캠페인 잠금 상태',
      pass: !currentSetting.isLocked,
      detail: currentSetting.isLocked ? '현재 캠페인이 잠금 상태입니다.' : '잠금 없음'
    }
  ];

  return {
    passAll: checks.every((item) => item.pass),
    checks
  };
}

export default function GoogleAdsAutomationTab() {
  const [activeTab, setActiveTab] = useState('insight');
  const [selectedInsightId, setSelectedInsightId] = useState(googleAdsDemoData.insights[0].insightId);
  const [applyState, setApplyState] = useState('idle');
  const [lastPayload, setLastPayload] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  const selectedInsight = useMemo(
    () => googleAdsDemoData.insights.find((item) => item.insightId === selectedInsightId),
    [selectedInsightId]
  );

  const currentPerformance = useMemo(() => {
    if (!selectedInsight) return null;
    return googleAdsDemoData.recentPerformanceByCampaign[selectedInsight.campaignId];
  }, [selectedInsight]);

  const currentSetting = useMemo(() => {
    if (!selectedInsight) return null;
    return googleAdsDemoData.campaignSettings[selectedInsight.campaignId];
  }, [selectedInsight]);

  const matchedCases = useMemo(() => {
    if (!selectedInsight) return [];
    return googleAdsDemoData.historicalCases.filter((item) => item.signalKey === selectedInsight.signalKey);
  }, [selectedInsight]);

  const recommendation = useMemo(
    () => buildRecommendation(selectedInsight, currentSetting, matchedCases),
    [selectedInsight, currentSetting, matchedCases]
  );

  const preflight = useMemo(
    () => runPreflightChecks(currentSetting, recommendation, googleAdsDemoData.guardrails),
    [currentSetting, recommendation]
  );

  async function handleApplySettings() {
    if (!selectedInsight || !currentSetting || !recommendation || !preflight.passAll) {
      return;
    }

    setApplyState('running');

    const requestedAt = new Date().toISOString();
    const requestId = `req_${Date.now()}`;
    const payload = {
      requestId,
      requestedAt,
      accountId: googleAdsDemoData.account.accountId,
      customerId: googleAdsDemoData.account.customerId,
      insightId: selectedInsight.insightId,
      campaignId: currentSetting.campaignId,
      operation: 'UPDATE_CAMPAIGN_SETTING',
      dryRun: false,
      settings: recommendation.settings
    };

    setLastPayload(payload);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const response = {
      status: 'SUCCESS',
      requestId,
      changeSetId: `chg_${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0')}`,
      appliedAt: new Date().toISOString(),
      endpoint: googleAdsDemoData.apiBlueprint.endpointTemplate.replace(
        '{customerId}',
        googleAdsDemoData.account.customerId
      )
    };

    setApiResult(response);
    setApplyState('success');
    setAuditLogs((prev) => [
      {
        timestamp: response.appliedAt,
        requestId: response.requestId,
        campaignId: currentSetting.campaignId,
        insightId: selectedInsight.insightId,
        status: response.status
      },
      ...prev
    ]);
  }

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-6 py-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-blue-700">New Tab · Google Ads AI Ops</p>
            <h2 className="text-2xl font-bold text-slate-900">Google Ads 인사이트 기반 자동 셋팅</h2>
            <p className="text-sm text-slate-500 mt-1">
              최근 성과 인사이트 선택 → 과거 유사사례 기반 추천 → 사전검증 통과 시 API 자동 적용
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600">
            <p>기준 시각: {googleAdsDemoData.generatedAt}</p>
            <p>계정: {googleAdsDemoData.account.accountId}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {flowTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'insight' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {googleAdsDemoData.insights.map((insight) => {
              const selected = insight.insightId === selectedInsightId;
              return (
                <article
                  key={insight.insightId}
                  className={`rounded-xl border p-4 space-y-3 ${
                    selected ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-900">{insight.title}</h3>
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      신뢰도 {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{insight.summary}</p>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
                      <p className="text-slate-500">전환</p>
                      <p className="font-semibold text-slate-900">{formatDiffPct(insight.expectedImpact.conversionLiftPct)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
                      <p className="text-slate-500">매출</p>
                      <p className="font-semibold text-slate-900">{formatDiffPct(insight.expectedImpact.revenueLiftPct)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-2">
                      <p className="text-slate-500">CPA</p>
                      <p className="font-semibold text-slate-900">{formatDiffPct(insight.expectedImpact.cpaChangePct)}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-500">
                    {insight.topEvidence.map((evidence) => (
                      <p key={evidence}>- {evidence}</p>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInsightId(insight.insightId);
                      setApplyState('idle');
                      setApiResult(null);
                      setLastPayload(null);
                      setActiveTab('recommendation');
                    }}
                    className={`w-full text-sm font-medium py-2 rounded-lg ${
                      selected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    이 인사이트 채택
                  </button>
                </article>
              );
            })}
          </div>
        )}

        {activeTab === 'recommendation' && selectedInsight && currentSetting && currentPerformance && recommendation && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">현재 설정/성과</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500">캠페인</p>
                    <p className="font-semibold text-slate-900">{currentSetting.campaignName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">입찰전략</p>
                    <p className="font-semibold text-slate-900">{currentSetting.biddingStrategy}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">일일 예산</p>
                    <p className="font-semibold text-slate-900">{formatKrw(currentSetting.dailyBudgetKrw)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Target ROAS</p>
                    <p className="font-semibold text-slate-900">
                      {currentSetting.targetRoas > 0 ? `${currentSetting.targetRoas}%` : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">최근 ROAS</p>
                    <p className="font-semibold text-slate-900">{currentPerformance.roas.toFixed(2)}x</p>
                  </div>
                  <div>
                    <p className="text-slate-500">예산 손실률</p>
                    <p className="font-semibold text-slate-900">
                      {formatPct(currentPerformance.impressionShareLostBudgetPct)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 p-4 bg-blue-50/40">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">추천 설정 (과거 유사사례 기반)</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500">입찰전략</p>
                    <p className="font-semibold text-slate-900">{recommendation.settings.biddingStrategy}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">추천 신뢰도</p>
                    <p className="font-semibold text-slate-900">{Math.round(recommendation.confidence * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500">일일 예산</p>
                    <p className="font-semibold text-slate-900">{formatKrw(recommendation.settings.dailyBudgetKrw)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Target ROAS</p>
                    <p className="font-semibold text-slate-900">
                      {recommendation.settings.targetRoas > 0 ? `${recommendation.settings.targetRoas}%` : '-'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 mb-1">광고 스케줄</p>
                    <p className="font-semibold text-slate-900">{recommendation.settings.adSchedule.join(', ')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 mb-1">제외 키워드</p>
                    <p className="font-semibold text-slate-900">{recommendation.settings.negativeKeywords.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-white">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">사전 정합성 검증 (Pre-flight)</h4>
              <div className="space-y-2">
                {preflight.checks.map((check) => (
                  <div
                    key={check.code}
                    className={`text-xs border rounded-lg px-3 py-2 ${
                      check.pass ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'
                    }`}
                  >
                    <p className="font-semibold">{check.name}</p>
                    <p className="mt-0.5">{check.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p
                  className={`text-sm font-semibold ${
                    preflight.passAll ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {preflight.passAll ? '검증 통과: 자동 적용 가능' : '검증 실패: 자동 적용 차단'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('automation')}
                  className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                >
                  API 적용 단계 이동
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">추천 근거 사례</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="text-left py-2">Case ID</th>
                      <th className="text-left py-2">시장/유형</th>
                      <th className="text-right py-2">ROAS 전</th>
                      <th className="text-right py-2">ROAS 후</th>
                      <th className="text-right py-2">매출 상승</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchedCases.map((item) => (
                      <tr key={item.caseId} className="border-b border-slate-100 text-slate-700">
                        <td className="py-2 font-medium">{item.caseId}</td>
                        <td className="py-2">{item.market} / {item.campaignType}</td>
                        <td className="py-2 text-right">{item.before.roas.toFixed(2)}x</td>
                        <td className="py-2 text-right">{item.after14d.roas.toFixed(2)}x</td>
                        <td className="py-2 text-right text-emerald-700 font-semibold">
                          {formatDiffPct(item.after14d.revenueLiftPct)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automation' && selectedInsight && currentSetting && recommendation && (
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">자동 적용 실행</h3>
              <p className="text-xs text-slate-600 mb-3">
                검증 통과 항목만 API에 반영됩니다. 실패 항목이 있으면 자동 적용이 차단됩니다.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplySettings}
                  disabled={!preflight.passAll || applyState === 'running'}
                  className={`text-sm font-medium px-4 py-2 rounded-lg ${
                    !preflight.passAll || applyState === 'running'
                      ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {applyState === 'running' ? '적용 중...' : 'Google Ads API 자동 셋팅 실행'}
                </button>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    preflight.passAll ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {preflight.passAll ? 'PRECHECK PASS' : 'PRECHECK BLOCK'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">API Payload Preview</h4>
                <p className="text-[11px] text-slate-500 mb-2">
                  Endpoint: {googleAdsDemoData.apiBlueprint.endpointTemplate.replace('{customerId}', googleAdsDemoData.account.customerId)}
                </p>
                <pre className="text-[11px] leading-relaxed bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto">
                  {JSON.stringify(
                    lastPayload || {
                      campaignId: currentSetting.campaignId,
                      insightId: selectedInsight.insightId,
                      settings: recommendation.settings
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">결과 / 감사 로그</h4>
                {apiResult ? (
                  <div className="text-xs space-y-1 mb-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <p className="font-semibold text-emerald-800">상태: {apiResult.status}</p>
                    <p className="text-emerald-800">요청 ID: {apiResult.requestId}</p>
                    <p className="text-emerald-800">변경셋 ID: {apiResult.changeSetId}</p>
                    <p className="text-emerald-800">적용 시각: {apiResult.appliedAt}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 mb-3">아직 적용 이력이 없습니다.</p>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="text-left py-2">Timestamp</th>
                        <th className="text-left py-2">Request ID</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.length === 0 && (
                        <tr>
                          <td className="py-2 text-slate-400" colSpan={3}>
                            로그 없음
                          </td>
                        </tr>
                      )}
                      {auditLogs.map((item) => (
                        <tr key={`${item.requestId}_${item.timestamp}`} className="border-b border-slate-100 text-slate-700">
                          <td className="py-2">{item.timestamp}</td>
                          <td className="py-2 font-medium">{item.requestId}</td>
                          <td className="py-2">
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
