"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({
    todayClicks: 0,
    weekClicks: 0,
    activeLinks: 0,
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const [appearance, setAppearance] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, statsRes, linksRes, appearanceRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/stats'),
          fetch('/api/links'),
          fetch('/api/user/appearance')
        ]);

        const sessionData = await sessionRes.json();
        const statsData = await statsRes.json();
        const linksData = await linksRes.json();
        const appearanceData = await appearanceRes.json();

        if (sessionData.authenticated) {
          setUser(sessionData.user);
        } else {
          router.push('/login');
          return;
        }

        if (!statsData.error) {
          setStats(statsData);
        }

        if (Array.isArray(linksData)) {
          setLinks(linksData);
        }

        if (appearanceData && !appearanceData.error) {
          setAppearance(appearanceData);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        showToast('Gagal memuat data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, showToast]);

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
    showToast('Link disalin!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dash-background-light flex items-center justify-center">
        <div className="size-12 border-4 border-dash-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const maxClicks = Math.max(...stats.dailyStats.map(s => s.count), 1);

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
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard">
            <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="text-sm font-bold">Overview</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/links">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">link</span>
            <span className="text-sm font-medium">Links</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/appearance">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">palette</span>
            <span className="text-sm font-medium">Appearance</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/analytics">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">bar_chart</span>
            <span className="text-sm font-medium">Analytics</span>
          </a>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
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
            <h2 className="text-slate-900 text-lg font-bold">Overview</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto w-full relative dash-scrollbar bg-dash-background-light">
            <div className="max-w-4xl mx-auto px-6 py-10 md:py-14 space-y-8 pb-32">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Overview</h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">Welcome back! Here's what's happening with your LinkinAja.</p>
            </div>

            <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-dash-primary/20 flex items-center justify-center text-dash-primary shrink-0 transition-transform hover:scale-110">
                  <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Your Public Link</span>
                  <a className="text-lg md:text-xl font-black text-slate-900 hover:text-dash-primary transition-colors hover:underline decoration-dash-primary decoration-4 underline-offset-4" href={`/${user?.username}`} target="_blank">
                    linkinaja.id/{user?.username}
                  </a>
                </div>
              </div>
              <button 
                onClick={copyToClipboard}
                className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>

            {/* Admin Stats Section */}
            {stats.isAdmin && stats.adminStats && (
              <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                 {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-dash-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-dash-primary backdrop-blur-md border border-white/10">
                      <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black tracking-tight">Admin Dashboard</h2>
                      <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mt-0.5">Global Platform Insights</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all group">
                       <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-dash-primary/20 flex items-center justify-center text-dash-primary group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined">group</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black">{stats.adminStats.totalUsers.toLocaleString()}</h3>
                        <span className="text-sm font-bold text-dash-primary">Registered</span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all group">
                       <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined">link</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Links</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black">{stats.adminStats.totalLinks.toLocaleString()}</h3>
                        <span className="text-sm font-bold text-purple-400">Total Created</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-dash-primary/30 transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-dash-primary group-hover:bg-dash-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">ads_click</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded-full bg-dash-primary/10 text-dash-primary uppercase tracking-widest">
                    Today
                  </span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.todayClicks.toLocaleString()}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Clicks Today</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-dash-primary/30 transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">calendar_view_week</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 uppercase tracking-widest">Weekly</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.weekClicks.toLocaleString()}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Clicks This Week</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-dash-primary/30 transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">link</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded-full bg-purple-500/10 text-purple-500 uppercase tracking-widest">Active</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stats.activeLinks}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Links</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-slate-900 text-lg font-black">Performance</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Clicks over the last 7 days</p>
                </div>
                <button className="text-[10px] font-black text-dash-primary hover:text-white transition-colors bg-dash-primary/10 hover:bg-dash-primary px-3 py-2 rounded-lg border border-dash-primary/20 uppercase tracking-widest">
                  View Full Report
                </button>
              </div>
              <div className="relative h-64 w-full flex items-end gap-2 md:gap-4 justify-between pt-10 px-2 lg:px-4">
                <div className="absolute inset-x-0 inset-y-10 flex flex-col justify-between pointer-events-none pb-8 opacity-10">
                  <div className="w-full h-px bg-slate-900 border-t border-dashed"></div>
                  <div className="w-full h-px bg-slate-900 border-t border-dashed"></div>
                  <div className="w-full h-px bg-slate-900 border-t border-dashed"></div>
                  <div className="w-full h-px bg-slate-900 border-t border-dashed"></div>
                </div>
                {stats.dailyStats.map((s, i) => {
                    const height = maxClicks > 0 ? (s.count / maxClicks) * 100 : 0;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-pointer relative z-10 transition-transform hover:-translate-y-1">
                            <div 
                                className="w-full bg-slate-100 rounded-t-xl relative group-hover:bg-dash-primary/20 transition-all duration-500"
                                style={{ height: '100%' }}
                            >
                                <div 
                                    className="absolute bottom-0 left-0 right-0 bg-dash-primary rounded-t-xl transition-all duration-700 shadow-sm"
                                    style={{ height: `${Math.max(height, 5)}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 pointer-events-none">
                                        {s.count} Clicks
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.day}</span>
                        </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="w-[420px] border-l border-slate-100 bg-slate-50 hidden lg:flex flex-col items-center justify-center relative p-8 z-10 shadow-sm shrink-0">
          <div className="absolute top-8 left-0 right-0 text-center">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Live Preview</p>
            <div className="flex items-center justify-center gap-2 text-dash-primary text-sm font-black bg-white py-1.5 px-4 rounded-full mx-auto w-fit shadow-sm border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-dash-primary animate-pulse shadow-[0_0_10px_#13ec5b]"></span>
              linkinaja.id/{user?.username}
            </div>
          </div>
          <div className="relative w-[300px] h-[600px] bg-white rounded-[4rem] border-8 border-slate-900 shadow-2xl overflow-hidden transform scale-90 xl:scale-100 translate-y-8 transition-transform">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
            
            <div 
              className={`w-full h-full overflow-y-auto no-scrollbar relative flex flex-col items-center
                ${appearance?.theme === 'Classic Dark' ? 'bg-black text-white' : ''}
                ${appearance?.theme === 'Midnight' ? 'bg-gradient-to-br from-indigo-950 to-purple-950 text-white' : ''}
                ${appearance?.theme === 'Minimal Light' ? 'bg-[#f6f8f6] text-slate-900' : ''}
                ${appearance?.theme === 'Tropical' ? 'bg-emerald-600 text-white' : ''}
                ${!appearance?.theme || appearance?.theme === 'Custom' ? 'bg-white text-slate-900' : ''}
              `}
              style={{ 
                backgroundColor: appearance?.bg_type === 'Flat Color' ? appearance?.bg_color : undefined,
                fontFamily: appearance?.font_family || 'Plus Jakarta Sans'
              }}
            >
              {appearance?.bg_type === 'Video' && (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  src={appearance?.bg_color}
                />
              )}
              
              <div className="w-full h-24 shrink-0 z-10"></div>
              <div className="relative -mt-12 px-6 pb-10 flex flex-col items-center w-full z-10">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl mb-4 overflow-hidden bg-slate-50">
                  <img 
                    src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                    alt="User avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="w-full mb-8" style={{ textAlign: appearance?.text_align || 'center' }}>
                  <h2 
                    className="font-black text-base mb-1 truncate w-full px-2"
                    style={{ color: appearance?.theme === 'Custom' ? appearance?.title_color : undefined }}
                  >
                    {user?.name || 'Your Name'}
                  </h2>
                  <p 
                    className="text-[9px] font-bold uppercase tracking-widest leading-relaxed opacity-60 line-clamp-2 px-2"
                    style={{ color: appearance?.theme === 'Custom' ? appearance?.bio_color : undefined }}
                  >
                    {user?.bio || 'Bio goes here...'}
                  </p>
                </div>
                
                <div className="w-full space-y-3 px-1">
                  {links.filter(l => l.is_active).map((link) => {
                    const radius = appearance?.button_shape === 'Rect' ? 'rounded-none' : appearance?.button_shape === 'Pill' ? 'rounded-full' : 'rounded-xl';
                    const isOutline = appearance?.button_style === 'Outline';
                    const isSoft = appearance?.button_style === 'Soft';
                    const isShadow = appearance?.button_style === 'Shadow';

                    return (
                        <div 
                          key={link.id}
                          className={`w-full p-3.5 ${radius} flex items-center gap-3 transition-transform cursor-pointer border shadow-sm`}
                          style={{
                             backgroundColor: isOutline ? 'transparent' : isSoft ? `${appearance?.button_color}22` : (appearance?.button_color || '#000'),
                             borderColor: (isOutline || isShadow) ? appearance?.button_color : 'transparent',
                             color: (isOutline || isSoft) ? appearance?.button_color : '#fff',
                             boxShadow: isShadow ? `3px 3px 0px ${appearance?.theme === 'Minimal Light' ? '#000' : 'rgba(255,255,255,0.2)'}` : undefined
                          }}
                        >
                          <span className="material-symbols-outlined text-sm opacity-80">{link.icon || 'link'}</span>
                          <span className="font-black text-[9px] uppercase tracking-wider truncate">{link.title}</span>
                        </div>
                    );
                  })}
                  {links.filter(l => l.is_active).length === 0 && (
                    <div className="text-[9px] font-black uppercase text-center mt-10 tracking-[0.2em] opacity-30">No active links</div>
                  )}
                </div>
              </div>
            </div>
            {/* Fixed Footer at the bottom of phone frame */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white pointer-events-none z-20">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
              <p className="text-[8px] font-black tracking-widest uppercase">LinkinAja</p>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
