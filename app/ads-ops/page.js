import GoogleAdsAutomationTab from '../../components/GoogleAdsAutomationTab';

export const metadata = {
  title: 'Ads Ops | Global Marketing AI Dashboard',
  description: 'Google Ads insight-based automatic setup workflow'
};

export default function AdsOpsPage() {
  return (
    <>
      <header className="bg-secondary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-12">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">hub</span>
                </div>
                <span className="text-lg font-bold tracking-tight">LGE Digital Marketing</span>
              </div>
              <nav className="hidden md:flex space-x-8 text-sm font-medium">
                <a className="nav-link flex items-center gap-2" href="/">
                  <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
                </a>
                <a className="nav-link flex items-center gap-2" href="#">
                  <span className="material-symbols-outlined text-[18px]">analytics</span> Analytics
                </a>
                <a className="nav-link flex items-center gap-2" href="#">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span> Insight
                </a>
                <a className="nav-link flex items-center gap-2" href="#">
                  <span className="material-symbols-outlined text-[18px]">campaign</span> Campaigns
                </a>
                <a className="nav-link active flex items-center gap-2" href="/ads-ops">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span> Ads Ops
                </a>
                <a className="nav-link flex items-center gap-2" href="#">
                  <span className="material-symbols-outlined text-[18px]">group</span> Audience
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <GoogleAdsAutomationTab />
    </>
  );
}
