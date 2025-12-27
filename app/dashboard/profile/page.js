"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  
  // Form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const router = useRouter();

  const [appearance, setAppearance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, linksRes, appearanceRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/links'),
          fetch('/api/user/appearance')
        ]);

        const sessionData = await sessionRes.json();
        const linksData = await linksRes.json();
        const appearanceData = await appearanceRes.json();

        if (sessionData.authenticated) {
          setUser(sessionData.user);
          setName(sessionData.user.name || '');
          setBio(sessionData.user.bio || '');
          setProfileImage(sessionData.user.profile_image || '');
        } else {
          router.push('/login');
          return;
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, profile_image: profileImage }),
      });
      
      if (res.ok) {
        setUser(prev => ({ ...prev, name, bio, profile_image: profileImage }));
        showToast('Profil berhasil diperbarui!', 'success');
      } else {
        showToast('Gagal memperbarui profil.', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Terjadi kesalahan saat menyimpan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dash-background-light flex items-center justify-center">
        <div className="size-12 border-4 border-dash-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/analytics">
                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">bar_chart</span>
                <span className="text-sm font-medium">Analytics</span>
          </a>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Account</p>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard/profile">
              <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <span className="text-sm font-bold">Profile</span>
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
            <h2 className="text-slate-900 text-lg font-bold">Profile</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto w-full relative dash-scrollbar bg-dash-background-light">
          <div className="max-w-3xl mx-auto px-6 py-10 md:py-14 space-y-8 pb-32">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Profile Settings</h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">Customize how your audience sees you on LinkinAja.</p>
            </div>

            {/* Profile Image Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm transition-all overflow-hidden relative group/card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-dash-primary/5 rounded-bl-[100px] transition-all group-hover/card:bg-dash-primary/10"></div>
              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start relative z-10">
                <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-xl ring-1 ring-slate-100 transition-transform group-hover:scale-[1.02]">
                    <img 
                      src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-5 flex-1 text-center sm:text-left pt-2">
                  <div>
                    <h3 className="text-slate-900 text-lg font-black tracking-tight">Profile Image</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Accepts URL to JPG, PNG or WEBP.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input 
                      type="text"
                      className="w-full sm:flex-1 bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none font-bold transition-all"
                      placeholder="Paste image URL here..."
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                    />
                    <button 
                      onClick={() => setProfileImage('')}
                      className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 text-xs font-black rounded-2xl transition-all uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm transition-all">
              <h3 className="text-slate-900 text-lg font-black tracking-tight border-b border-slate-50 pb-4">General Information</h3>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">LinkinAja URL</label>
                <div className="flex rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 ring-0 focus-within:ring-4 focus-within:ring-dash-primary/10 transition-all">
                  <span className="px-5 py-3.5 bg-slate-100 text-slate-500 text-[10px] font-black border-r border-slate-200 flex items-center select-none uppercase tracking-[0.2em]">linkinaja.id/</span>
                  <input 
                    className="flex-1 bg-transparent border-none text-slate-500 text-sm px-4 py-3.5 focus:ring-0 cursor-not-allowed select-none font-bold" 
                    disabled 
                    type="text" 
                    value={user?.username || ''}
                  />
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(`linkinaja.id/${user?.username}`);
                        showToast('Link disalin ke clipboard!', 'success');
                    }}
                    className="px-5 text-slate-400 hover:text-dash-primary transition-colors flex items-center justify-center group/copy"
                  >
                    <span className="material-symbols-outlined text-lg group-hover/copy:scale-110 transition-transform">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Display Name</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-4 focus:ring-dash-primary/10 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 text-base font-black transition-all outline-none" 
                  placeholder="e.g. My Awesome Brand" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end mr-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Bio</label>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bio.length} / 150</span>
                </div>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-4 focus:ring-dash-primary/10 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 text-base font-medium transition-all resize-none outline-none min-h-[120px]" 
                  placeholder="Tell your audience who you are..." 
                  rows="4"
                  maxLength={150}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Bottom Bar Mobile-ish style floating */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col text-center sm:text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unsaved Changes</p>
                    <p className="text-xs font-bold text-slate-500">Don't forget to push your changes live!</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => {
                            setName(user?.name || '');
                            setBio(user?.bio || '');
                            setProfileImage(user?.profile_image || '');
                        }}
                        className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-[0.2em]"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-10 py-3.5 rounded-2xl text-[10px] font-black text-black bg-dash-primary hover:bg-[#0fd650] shadow-[0_8px_20px_rgba(19,236,91,0.2)] transition-all transform active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em]"
                    >
                        {saving ? 'Syncing...' : 'Push Updates'}
                    </button>
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
                    src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                    alt="User avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="w-full mb-8" style={{ textAlign: appearance?.text_align || 'center' }}>
                  <h2 
                    className="font-black text-base mb-1 truncate w-full px-2"
                    style={{ color: appearance?.theme === 'Custom' ? appearance?.title_color : undefined }}
                  >
                    {name || 'Your Name'}
                  </h2>
                  <p 
                    className="text-[9px] font-bold uppercase tracking-widest leading-relaxed opacity-60 line-clamp-2 px-2"
                    style={{ color: appearance?.theme === 'Custom' ? appearance?.bio_color : undefined }}
                  >
                    {bio || 'Bio goes here...'}
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
