'use client';

import { useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function VisitorChartClient() {
  useEffect(() => {
    const roasCanvas = document.getElementById('roasChart');
    const ctrCanvas = document.getElementById('ctrChart');
    if (!roasCanvas || !ctrCanvas) {
      return;
    }

    Chart.defaults.font.family = 'Inter';
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#94A3B8';

    const roasCtx = roasCanvas.getContext('2d');
    const ctrCtx = ctrCanvas.getContext('2d');

    const gradientRoas = roasCtx.createLinearGradient(0, 0, 0, 300);
    gradientRoas.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
    gradientRoas.addColorStop(1, 'rgba(99, 102, 241, 0.02)');

    const gradientCtr = ctrCtx.createLinearGradient(0, 0, 0, 300);
    gradientCtr.addColorStop(0, 'rgba(16, 185, 129, 0.30)');
    gradientCtr.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

    const roasChart = new Chart(roasCtx, {
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
            borderWidth: 2
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
                return `${context.parsed.y.toFixed(2)}x`;
              }
            }
          }
        },
        scales: {
          y: {
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

    const ctrChart = new Chart(ctrCtx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
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
            borderWidth: 2
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
                return `${context.parsed.y.toFixed(2)}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: {
              color: '#F1F5F9',
              drawBorder: false
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

    return () => {
      roasChart.destroy();
      ctrChart.destroy();
    };
  }, []);

  return null;
}
