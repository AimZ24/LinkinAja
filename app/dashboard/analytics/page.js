"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    todayClicks: 0,
    todayViews: 0,
    totalViews: 0,
    weekClicks: 0,
    activeLinks: 0,
    dailyStats: [],
    topLinks: [],
    deviceStats: [],
    ctr: 0
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, statsRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/stats')
        ]);

        const sessionData = await sessionRes.json();
        const statsData = await statsRes.json();

        if (sessionData.authenticated) {
          setUser(sessionData.user);
        } else {
          router.push('/login');
          return;
        }

        if (!statsData.error) {
          setStats(statsData);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dash-background-light flex items-center justify-center">
        <div className="size-12 border-4 border-dash-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const maxVal = Math.max(...stats.dailyStats.map(s => s.count), 1);

  return (
    <div className="bg-dash-background-light font-display text-slate-900 min-h-screen flex overflow-hidden selection:bg-dash-primary selection:text-black transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 border-r border-slate-100 flex flex-col bg-white z-40 shrink-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out md:flex`}>
        <div className="p-6 mb-2 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2 select-none cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-dash-primary material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            LinkinAja
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-900">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">dashboard</span>
            <span className="text-sm font-medium">Overview</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/links">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">link</span>
            <span className="text-sm font-medium">Links</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/appearance">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">palette</span>
            <span className="text-sm font-medium">Appearance</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard/analytics">
                <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
                <span className="text-sm font-bold">Analytics</span>
          </a>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Account</p>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/profile">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">person</span>
              <span className="text-sm font-medium">Profile</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/settings">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </a>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all group text-left"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-dash-primary to-blue-500 overflow-hidden shadow-sm">
               <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header Mobile */}
        <header className="flex-none flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 py-4 z-20 md:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-900 p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <h2 className="text-slate-900 text-lg font-bold">Analytics</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full relative dash-scrollbar bg-dash-background-light">
          <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-[10px] font-black tracking-[0.2em] text-dash-primary uppercase">Analytics Dashboard</h2>
                <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Insights & Metrics</h1>
              </div>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-50 rounded-lg shadow-sm border border-slate-100">Last 7 Days</button>
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Last 30 Days</button>
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Year</button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 group hover:border-dash-primary/30 transition-all shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-2.5 bg-dash-primary/10 rounded-xl text-dash-primary group-hover:bg-dash-primary group-hover:text-black transition-all">
                    <span className="material-symbols-outlined text-2xl">visibility</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 relative z-10">{stats.totalViews.toLocaleString()}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 relative z-10">Total profile visits</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-dash-primary/5 rounded-bl-[60px] group-hover:bg-dash-primary/10 transition-all"></div>
              </div>

               <div className="bg-white border border-slate-200 rounded-3xl p-6 group hover:border-dash-primary/30 transition-all shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">ads_click</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clicks</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 relative z-10">{stats.weekClicks.toLocaleString()}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 relative z-10">Total link clicks</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[60px] group-hover:bg-blue-500/10 transition-all"></div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 group hover:border-dash-primary/30 transition-all shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">percent</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CTR</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 relative z-10">{stats.ctr}%</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 relative z-10">Click-through rate</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-[60px] group-hover:bg-purple-500/10 transition-all"></div>
              </div>

               <div className="bg-white border border-slate-200 rounded-3xl p-6 group hover:border-dash-primary/30 transition-all shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-2xl">link</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Links</span>
                </div>
                <h2 className="text-4xl font-black text-slate-900 relative z-10">{stats.activeLinks}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 relative z-10">Live active links</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[60px] group-hover:bg-emerald-500/10 transition-all"></div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h3 className="text-slate-900 text-xl font-black tracking-tight">Activity Traffic</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Daily engagement for the last 7 days</p>
                </div>
                <div className="flex gap-6">
                  <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="w-3 h-3 rounded-full bg-dash-primary shadow-[0_0_10px_rgba(19,236,91,0.3)]"></span> 
                    Clicks
                  </span>
                </div>
              </div>
              <div className="h-72 flex items-end justify-between gap-3 md:gap-6 w-full px-2">
                {stats.dailyStats.map((s, i) => {
                  const clickHeight = maxVal > 0 ? (s.count / maxVal) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer h-full">
                      <div className="relative w-full flex items-end h-full justify-center">
                        <div 
                           className="w-full bg-slate-50 rounded-t-2xl relative transition-all group-hover:bg-slate-100/50"
                           style={{ height: '100%' }}
                        >
                            <div 
                               className="absolute bottom-0 left-0 right-0 bg-dash-primary rounded-t-2xl group-hover:bg-[#0fd650] transition-all duration-700 shadow-sm"
                               style={{ height: `${Math.max(clickHeight, 5)}%` }}
                            >
                               <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 shadow-xl">
                                  {s.count} Clicks
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                               </div>
                            </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top Links */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-slate-900 text-xl font-black tracking-tight">Top Content</h3>
                  <button className="text-[10px] font-black text-dash-primary bg-dash-primary/10 px-4 py-2 rounded-xl transition-all hover:bg-dash-primary hover:text-white uppercase tracking-widest">Full Report</button>
                </div>
                <div className="space-y-4">
                  {stats.topLinks.length > 0 ? stats.topLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-dash-primary group-hover:text-black group-hover:border-dash-primary transition-all shadow-sm">
                        <span className="material-symbols-outlined text-2xl">{link.icon || 'link'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 font-black truncate text-lg leading-tight">{link.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate mt-1">{link.url}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-900 font-black text-2xl tracking-tight">{link.clicks.toLocaleString()}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">clicks</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-16 text-slate-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-slate-100 rounded-3xl">No data available yet</div>
                  )}
                </div>
              </div>

              {/* Devices & Browsers */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
                <h3 className="text-slate-900 text-xl font-black tracking-tight mb-8">System Stats</h3>
                
                <div className="flex-1 space-y-8">
                   <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Device Distribution</p>
                    {stats.deviceStats.map((d, i) => {
                         const total = stats.deviceStats.reduce((acc, curr) => acc + curr.count, 0);
                         const percentage = total > 0 ? Math.round((d.count / total) * 100) : 0;
                         return (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <span className="material-symbols-outlined text-lg">{d.device === 'Mobile' ? 'smartphone' : 'laptop'}</span>
                                        {d.device}
                                    </div>
                                    <span className="text-slate-900">{percentage}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${d.device === 'Mobile' ? 'bg-dash-primary' : 'bg-slate-300'}`} style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                         )
                    })}
                    {stats.deviceStats.length === 0 && (
                         <div className="text-center py-6 text-slate-300 font-black text-[10px] uppercase tracking-widest border border-dashed border-slate-100 rounded-2xl">No device data</div>
                    )}
                   </div>

                   <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-dash-primary uppercase tracking-widest mb-2">Growth Tip</p>
                        <p className="text-xs font-bold leading-relaxed pr-4 opacity-80">Your CTR is {stats.ctr}% {stats.ctr < 5 ? '. Try changing your background and button colors to be more vibrant to catch eye attention!' : '— that is amazing! Keep sharing your link on social media.'}</p>
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[60px] group-hover:scale-110 transition-transform"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
