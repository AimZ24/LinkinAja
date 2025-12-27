"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function LinksPage() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { showToast } = useToast();
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

  const addLink = async (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, url: newUrl }),
      });
      if (res.ok) {
        setNewTitle('');
        setNewUrl('');
        const updatedLinksRes = await fetch('/api/links');
        const updatedLinks = await updatedLinksRes.json();
        setLinks(updatedLinks);
        showToast('Link berhasil ditambahkan!', 'success');
      } else {
        showToast('Gagal menambahkan link.', 'error');
      }
    } catch (err) {
      console.error('Add link error:', err);
      showToast('Terjadi kesalahan.', 'error');
    }
  };

  const deleteLink = async (id) => {
    if (!confirm('Yakin ingin menghapus link ini?')) return;
    try {
      const res = await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks(prev => prev.filter(link => link.id !== id));
        showToast('Link berhasil dihapus.', 'success');
      } else {
        showToast('Gagal menghapus link.', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Terjadi kesalahan.', 'error');
    }
  };

  const toggleLinkActive = async (id, currentStatus) => {
    try {
      const res = await fetch('/api/links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });
      if (res.ok) {
        setLinks(prev => prev.map(link => 
          link.id === id ? { ...link, is_active: !currentStatus } : link
        ));
        showToast(currentStatus ? 'Link disembunyikan.' : 'Link diaktifkan.', 'info');
      }
    } catch (err) {
      console.error('Toggle error:', err);
      showToast('Gagal mengubah status link.', 'error');
    }
  };

  const startEditing = (link) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditUrl('');
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch('/api/links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: editTitle, url: editUrl }),
      });
      if (res.ok) {
        setLinks(prev => prev.map(link => 
          link.id === id ? { ...link, title: editTitle, url: editUrl } : link
        ));
        setEditingId(null);
        showToast('Link berhasil diperbarui!', 'success');
      } else {
        showToast('Gagal memperbarui link.', 'error');
      }
    } catch (err) {
      console.error('Save edit error:', err);
      showToast('Terjadi kesalahan.', 'error');
    }
  };

  const moveLink = async (id, direction) => {
    const index = links.findIndex(l => l.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const newLinks = [...links];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newLinks[index], newLinks[swapIndex]] = [newLinks[swapIndex], newLinks[index]];
    
    setLinks(newLinks);

    // Persist to backend
    try {
      await fetch('/api/links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newLinks.map((l, i) => ({ id: l.id, sort_order: i })) }),
      });
    } catch (err) {
       console.error('Reorder error:', err);
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
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard/links">
            <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            <span className="text-sm font-bold">Links</span>
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
            <h2 className="text-slate-900 text-lg font-bold">Links</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto w-full relative dash-scrollbar bg-dash-background-light">
          <div className="max-w-3xl mx-auto px-6 py-10 md:py-14 space-y-10 pb-32">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Links Manager</h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">Organize and manage your links shown on your profile.</p>
            </div>

            {/* Add Link Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm transition-all group/card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-dash-primary/5 rounded-bl-[100px] transition-all group-hover/card:bg-dash-primary/10"></div>
              <form onSubmit={addLink} className="flex flex-col space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Link Title</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-4 focus:ring-dash-primary/10 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 transition-all outline-none font-black" 
                      placeholder="e.g. My Website" 
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Destination URL</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-4 focus:ring-dash-primary/10 rounded-2xl px-5 py-3.5 text-slate-900 placeholder-slate-400 transition-all outline-none font-black" 
                      placeholder="https://..." 
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full h-[60px] bg-dash-primary hover:bg-[#0fd650] text-black font-black rounded-2xl shadow-[0_8px_25px_rgba(19,236,91,0.2)] transition-all flex items-center justify-center gap-3 transform active:scale-95 uppercase tracking-[0.2em] text-xs"
                >
                  <span className="material-symbols-outlined font-black">add_circle</span>
                  Add New Link
                </button>
              </form>
            </div>

            {/* Links List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Your Links ({links.length})</h2>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-save: ON</span>
                    <div className="w-2 h-2 rounded-full bg-dash-primary animate-pulse"></div>
                 </div>
              </div>
              {links.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">link_off</span>
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No links yet. Add your first one above!</p>
                </div>
              ) : links.map((link, index) => (
                <div key={link.id} className={`bg-white border border-slate-200 rounded-3xl p-5 md:p-6 flex flex-col items-stretch gap-6 group hover:border-dash-primary/30 transition-all shadow-sm ${!link.is_active && 'opacity-60 grayscale-[0.5]'}`}>
                  {editingId === link.id ? (
                    <div className="flex flex-col gap-4 w-full">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Edit Title</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:border-dash-primary outline-none" 
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Edit URL</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:border-dash-primary outline-none" 
                                    value={editUrl}
                                    onChange={(e) => setEditUrl(e.target.value)}
                                />
                            </div>
                         </div>
                         <div className="flex gap-2 justify-end">
                            <button onClick={cancelEditing} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                            <button onClick={() => saveEdit(link.id)} className="px-6 py-2 rounded-xl text-[10px] font-black uppercase bg-dash-primary text-black hover:bg-[#0fd650] transition-all shadow-sm">Save Changes</button>
                         </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                        <div className="flex flex-col items-center gap-1 shrink-0">
                            <button onClick={() => moveLink(link.id, 'up')} disabled={index === 0} className="text-slate-300 hover:text-dash-primary disabled:opacity-30 transition-colors">
                                <span className="material-symbols-outlined text-xl">expand_less</span>
                            </button>
                            <span className="material-symbols-outlined text-xl text-slate-200">drag_indicator</span>
                            <button onClick={() => moveLink(link.id, 'down')} disabled={index === links.length - 1} className="text-slate-300 hover:text-dash-primary disabled:opacity-30 transition-colors">
                                <span className="material-symbols-outlined text-xl">expand_more</span>
                            </button>
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-1">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-dash-primary group-hover:text-black transition-colors">
                                    <span className="material-symbols-outlined text-2xl">{link.icon || 'link'}</span>
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-slate-900 font-black text-lg leading-tight truncate">{link.title}</h3>
                                    <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest truncate">{link.url}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                            <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end gap-1 mr-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{link.is_active ? 'Active' : 'Hidden'}</span>
                                <button 
                                    onClick={() => toggleLinkActive(link.id, link.is_active)}
                                    className={`relative inline-block w-12 h-6 align-middle select-none transition duration-300 ease-in-out rounded-full shadow-inner ${link.is_active ? 'bg-dash-primary' : 'bg-slate-200'}`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${link.is_active ? 'translate-x-6' : 'translate-x-0'}`}></span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => startEditing(link)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                                <span className="material-symbols-outlined text-xl font-bold">edit_note</span>
                                </button>
                                <button 
                                onClick={() => deleteLink(link.id)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                <span className="material-symbols-outlined text-xl font-bold">delete_forever</span>
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                  )}
                </div>
              ))}
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
            
            {/* Inner Phone Content */}
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
