'use client';

import { useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function VisitorChartClient() {
  useEffect(() => {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) {
      return;
    }

    Chart.defaults.font.family = 'Inter';
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#94A3B8';

    const ctx = canvas.getContext('2d');

    const gradientRoas = ctx.createLinearGradient(0, 0, 0, 300);
    gradientRoas.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    gradientRoas.addColorStop(1, 'rgba(99, 102, 241, 0.02)');

    const gradientCtr = ctx.createLinearGradient(0, 0, 0, 300);
    gradientCtr.addColorStop(0, 'rgba(16, 185, 129, 0.30)');
    gradientCtr.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

    const performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
          {
            label: 'ROAS',
            data: [1.18, 1.24, 1.31, 1.42, 1.36, 1.51],
            borderColor: '#6366F1',
            backgroundColor: gradientRoas,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#4338CA',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            borderWidth: 2,
            yAxisID: 'yRoas'
          },
          {
            label: 'CTR',
            data: [1.8, 2.0, 2.3, 2.1, 2.4, 2.6],
            borderColor: '#10B981',
            backgroundColor: gradientCtr,
            tension: 0.35,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#059669',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            borderWidth: 2,
            yAxisID: 'yCtr'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label(context) {
                if (context.dataset.label === 'ROAS') {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}x`;
                }
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
              }
            }
          }
        },
        scales: {
          yRoas: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            border: { display: false },
            grid: {
              color: '#F1F5F9',
              drawBorder: false
            },
            ticks: {
              callback(value) {
                return `${Number(value).toFixed(1)}x`;
              }
            }
          },
          yCtr: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            border: { display: false },
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              callback(value) {
                return `${Number(value).toFixed(1)}%`;
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            border: { display: false }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    const chatFabButton = document.getElementById('chatFabButton');
    const chatPanel = document.getElementById('chatPanel');
    const chatCloseButton = document.getElementById('chatCloseButton');
    const chatInput = document.getElementById('chatInput');
    const chatSendButton = document.getElementById('chatSendButton');
    const chatMessages = document.getElementById('chatMessages');

    const openChat = () => {
      if (!chatFabButton || !chatPanel) return;
      chatFabButton.classList.add('hidden');
      chatPanel.classList.remove('hidden');
      if (chatInput) chatInput.focus();
    };

    const closeChat = () => {
      if (!chatFabButton || !chatPanel) return;
      chatPanel.classList.add('hidden');
      chatFabButton.classList.remove('hidden');
    };

    const appendMessage = (text, fromUser) => {
      if (!chatMessages) return;
      const wrapper = document.createElement('div');
      wrapper.className = `flex ${fromUser ? 'justify-end' : 'justify-start'}`;
      const bubble = document.createElement('div');
      bubble.className = fromUser
        ? 'bg-blue-600 text-white rounded-xl p-3 text-xs shadow-sm max-w-[85%]'
        : 'bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-600 shadow-sm max-w-[85%]';
      bubble.textContent = text;
      wrapper.appendChild(bubble);
      chatMessages.appendChild(wrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const getBotReply = (message) => {
      const q = message.toLowerCase();
      if (q.includes('roas')) {
        return '최근 예시 기준으로 ROAS는 Week 6에 1.51x로 가장 높습니다. 검색형 캠페인 예산을 우선 점검해보세요.';
      }
      if (q.includes('ctr')) {
        return 'CTR은 Week 6에 2.6%로 상승 추세입니다. 현재 크리에이티브 메시지 방향을 유지하는 것이 좋습니다.';
      }
      if (q.includes('budget') || q.includes('예산')) {
        return '예시 제안: 저성과 채널 예산 10%를 고ROAS 채널로 이동하고 1주 단위로 성과를 재검증하세요.';
      }
      if (q.includes('channel') || q.includes('채널')) {
        return '예시 데이터 기준으로는 ROAS가 높은 구간에 맞춰 Search 중심 채널 비중을 늘리는 전략이 유효합니다.';
      }
      return '좋은 질문입니다. ROAS, CTR, 예산, 채널 중 하나를 포함해 물어보면 예시 답변을 더 정확히 드릴게요.';
    };

    const sendMessage = () => {
      if (!chatInput) return;
      const message = chatInput.value.trim();
      if (!message) return;
      appendMessage(message, true);
      chatInput.value = '';

      window.setTimeout(() => {
        appendMessage(getBotReply(message), false);
      }, 400);
    };

    const onInputKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
      }
    };

    chatFabButton?.addEventListener('click', openChat);
    chatCloseButton?.addEventListener('click', closeChat);
    chatSendButton?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keydown', onInputKeyDown);

    return () => {
      chatFabButton?.removeEventListener('click', openChat);
      chatCloseButton?.removeEventListener('click', closeChat);
      chatSendButton?.removeEventListener('click', sendMessage);
      chatInput?.removeEventListener('keydown', onInputKeyDown);
      performanceChart.destroy();
    };
  }, []);

  return null;
}
