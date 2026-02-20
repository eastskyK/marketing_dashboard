import fs from 'node:fs';
import path from 'node:path';
import VisitorChartClient from '../components/VisitorChartClient';

function getDashboardMarkup() {
  const htmlPath = path.join(process.cwd(), 'code.html');
  const raw = fs.readFileSync(htmlPath, 'utf8');

  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<script>[\s\S]*?<\/script>\s*<\/body>/i);
  if (!bodyMatch?.[1]) {
    return '<main>Dashboard markup not found.</main>';
  }

  return bodyMatch[1]
    .replace('Visitor from websites', 'ROAS & CTR from websites')
    .replace('Website visitor traffic and analytics', 'Combined trend chart for marketing efficiency')
    .replace(
      /<div class="relative h-80 w-full">\s*<canvas id="visitorChart"><\/canvas>\s*<\/div>/,
      `
      <div class="bg-slate-50 rounded-lg border border-slate-100 p-3 h-80 w-full">
        <p class="text-xs font-semibold text-slate-600 mb-2">ROAS + CTR Trend</p>
        <div class="relative h-[285px]"><canvas id="performanceChart"></canvas></div>
      </div>
      `
    );
}

const dashboardMarkup = getDashboardMarkup();

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: dashboardMarkup }} />
      <VisitorChartClient />
    </>
  );
}
