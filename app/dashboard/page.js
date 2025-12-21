"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    todayClicks: 0,
    weekClicks: 0,
    activeLinks: 0,
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
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

  const copyToClipboard = () => {
    const url = `linkinaja.id/${user?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dash-background-light flex items-center justify-center">
        <div className="size-12 border-4 border-dash-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate chart path
  const maxClicks = Math.max(...stats.dailyStats.map(s => s.count), 10);
  const chartPoints = stats.dailyStats.map((s, i) => {
    const x = (i / 6) * 100;
    const y = 100 - (s.count / maxClicks) * 100;
    return { x, y, count: s.count, day: s.day };
  });

  const pathD = chartPoints.length > 0 
    ? `M${chartPoints[0].x},${chartPoints[0].y} ` + chartPoints.slice(1).map(p => `L${p.x},${p.y}`).join(' ')
    : '';
  
  const areaD = chartPoints.length > 0
    ? `${pathD} L100,100 L0,100 Z`
    : '';

  return (
    <div className="bg-dash-background-light font-display text-slate-900 min-h-screen flex overflow-hidden selection:bg-dash-primary selection:text-black transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 hidden md:flex flex-col bg-white z-20 shrink-0">
        <div className="p-6 mb-2">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2 select-none cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-dash-primary material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            LinkinAja
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard">
            <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="text-sm font-bold">Overview</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/links">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">link</span>
            <span className="text-sm font-medium">Links</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/profile">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">person</span>
            <span className="text-sm font-medium">Profile</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="#">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">palette</span>
            <span className="text-sm font-medium">Appearance</span>
          </a>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
            <a className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="#">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </a>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all group text-left"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-dash-primary to-blue-500 overflow-hidden shadow-sm">
               <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Pro Plan</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 ml-auto text-lg">unfold_more</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto w-full relative dash-scrollbar bg-dash-background-light">
          <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Dashboard</h1>
                <p className="text-slate-500 text-sm md:text-base font-medium">Welcome back, here's what's happening with your links.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-dash-primary/10 border border-dash-primary/20 text-dash-primary text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-dash-primary animate-pulse"></span>
                  Live
                </span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Last updated: Just now</span>
              </div>
            </div>

            {/* Public Link Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-96 h-96 bg-dash-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-opacity opacity-50 group-hover:opacity-80"></div>
              <div className="flex items-center gap-5 z-10 w-full md:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                  <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">Your Public Link</p>
                  <a className="text-slate-900 text-xl md:text-2xl font-black hover:text-dash-primary transition-colors flex items-center gap-2" href={`/${user?.username}`} target="_blank">
                    linkinaja.id/{user?.username}
                    <span className="material-symbols-outlined text-lg opacity-50">open_in_new</span>
                  </a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 md:flex-none px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span className="material-symbols-outlined text-lg group-hover/btn:scale-110 transition-transform">
                    {copied ? 'check' : 'content_copy'}
                  </span> 
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button className="flex-1 md:flex-none px-6 py-3 bg-dash-primary hover:bg-[#0fd650] text-black rounded-xl font-bold text-sm transition-all shadow-[0_4px_15px_rgba(19,236,91,0.2)] hover:shadow-[0_8px_20px_rgba(19,236,91,0.3)] flex items-center justify-center gap-2 transform active:scale-95">
                  <span className="material-symbols-outlined text-lg">share</span> Share
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-dash-primary/30 transition-all duration-300 hover:shadow-md group relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-dash-primary/5 rounded-full blur-2xl group-hover:bg-dash-primary/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-dash-primary group-hover:border-dash-primary/20 transition-all">
                    <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>touch_app</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-dash-primary bg-dash-primary/10 px-2.5 py-1 rounded-full border border-dash-primary/10">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +{stats.todayClicks > 0 ? 'Recently' : '0%'}
                  </span>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{stats.todayClicks.toLocaleString()}</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Total clicks today</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-md group relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-blue-500 group-hover:border-blue-500/20 transition-all">
                    <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/10">
                    <span className="material-symbols-outlined text-sm">trending_up</span> Weekly
                  </span>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{stats.weekClicks.toLocaleString()}</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Total clicks this week</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:shadow-md group relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-purple-500 group-hover:border-purple-500/20 transition-all">
                    <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                    Pro Plan
                  </span>
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{stats.activeLinks}</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Active links</p>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-slate-900 text-lg font-bold">Performance</h3>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Clicks over the last 7 days</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-dash-primary focus:ring-1 focus:ring-dash-primary cursor-pointer">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="relative w-full h-64 md:h-80 select-none">
                <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[10px] text-slate-400 font-bold text-right pr-2">
                  <span>{maxClicks}</span>
                  <span>{Math.round(maxClicks * 0.75)}</span>
                  <span>{Math.round(maxClicks * 0.5)}</span>
                  <span>{Math.round(maxClicks * 0.25)}</span>
                  <span>0</span>
                </div>
                <div className="absolute left-10 right-0 top-2 bottom-8">
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="w-full h-px bg-slate-100"></div>
                    <div className="w-full h-px bg-slate-100"></div>
                    <div className="w-full h-px bg-slate-100"></div>
                    <div className="w-full h-px bg-slate-100"></div>
                    <div className="w-full h-px bg-slate-200"></div>
                  </div>
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.2"></stop>
                        <stop offset="100%" stopColor="#13ec5b" stopOpacity="0.02"></stop>
                      </linearGradient>
                    </defs>
                    {pathD && (
                      <>
                        <path d={areaD} fill="url(#gradient)"></path>
                        <polyline fill="none" points={pathD.replace('M', '').trim()} stroke="#13ec5b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></polyline>
                      </>
                    )}
                    {chartPoints.map((p, i) => (
                      <circle 
                        key={i}
                        className="transition-all duration-300 hover:r-5 cursor-pointer" 
                        cx={p.x} 
                        cy={p.y} 
                        fill="white" 
                        r="2" 
                        stroke="#13ec5b" 
                        strokeWidth="2"
                      >
                        <title>{p.day}: {p.count} clicks</title>
                      </circle>
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex justify-between items-end pb-0">
                    {stats.dailyStats.map((s, i) => (
                      <div key={i} className="w-[14%] h-full group relative cursor-crosshair">
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-dash-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-bold translate-y-6 uppercase tracking-wider">{s.day}</div>
                        {/* Tooltip */}
                        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-20 w-max">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{s.day}</p>
                          <p className="text-sm font-black">{s.count} Clicks</p>
                        </div>
                      </div>
                    ))}
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
