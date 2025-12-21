"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LinksPage() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, linksRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/links')
        ]);

        const sessionData = await sessionRes.json();
        const linksData = await linksRes.json();

        if (sessionData.authenticated) {
          setUser(sessionData.user);
        } else {
          router.push('/login');
          return;
        }

        if (Array.isArray(linksData)) {
          setLinks(linksData);
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
      }
    } catch (err) {
      console.error('Add link error:', err);
    }
  };

  const deleteLink = async (id) => {
    if (!confirm('Yakin ingin menghapus link ini?')) return;
    try {
      const res = await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks(prev => prev.filter(link => link.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
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
      }
    } catch (err) {
      console.error('Toggle error:', err);
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
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 hidden md:flex flex-col bg-white z-20 shrink-0">
        <div className="p-6 mb-2">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2 select-none cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-dash-primary material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            LinkinAja
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">dashboard</span>
            <span className="text-sm font-medium">Overview</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard/links">
            <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            <span className="text-sm font-bold">Links</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="#">
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
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto w-full relative dash-scrollbar bg-dash-background-light">
          <div className="max-w-3xl mx-auto px-6 py-10 md:py-14 space-y-8 pb-32">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Links Manager</h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">Organize and manage your links shown on your profile.</p>
            </div>

            {/* Add Link Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <form onSubmit={addLink} className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Link Title</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 transition-all outline-none font-bold" 
                      placeholder="e.g. My Website" 
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">URL</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 transition-all outline-none font-bold" 
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
                  className="w-full h-[54px] bg-dash-primary hover:bg-[#0fd650] text-black font-black rounded-2xl shadow-[0_4px_15px_rgba(19,236,91,0.2)] hover:shadow-[0_8px_20px_rgba(19,236,91,0.3)] transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <span className="material-symbols-outlined font-bold">add</span>
                  Add New Link
                </button>
              </form>
            </div>

            {/* Links List */}
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className={`bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 group hover:border-dash-primary/30 transition-all shadow-sm ${!link.is_active && 'opacity-60'}`}>
                  <div className="cursor-grab text-slate-300 hover:text-slate-600 transition-colors p-1 hidden md:block">
                    <span className="material-symbols-outlined text-2xl">drag_indicator</span>
                  </div>
                  <div className="flex-1 w-full flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <span className="material-symbols-outlined">{link.icon || 'link'}</span>
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-slate-900 font-black text-base leading-tight truncate">{link.title}</h3>
                          <p className="text-slate-400 text-xs mt-0.5 font-bold truncate">{link.url}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleLinkActive(link.id, link.is_active)}
                        className={`relative inline-block w-11 h-6 align-middle select-none transition duration-200 ease-in rounded-full ${link.is_active ? 'bg-dash-primary' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${link.is_active ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                          <span className="material-symbols-outlined text-lg font-bold">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteLink(link.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg font-bold">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="w-[420px] border-l border-slate-200 bg-slate-50 hidden lg:flex flex-col items-center justify-center relative p-8 z-10">
          <div className="absolute top-8 left-0 right-0 text-center">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Live Preview</p>
            <div className="flex items-center justify-center gap-2 text-dash-primary text-sm font-black">
              <span className="w-2 h-2 rounded-full bg-dash-primary animate-pulse shadow-[0_0_10px_#13ec5b]"></span>
              linkinaja.id/{user?.username}
            </div>
          </div>
          <div className="relative w-[300px] h-[600px] bg-white rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden transform scale-90 xl:scale-100 transition-transform">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
            <div className="w-full h-full bg-white overflow-y-auto no-scrollbar relative flex flex-col items-center">
              <div className="w-full h-32 bg-gradient-to-b from-dash-primary/20 to-transparent"></div>
              <div className="relative -mt-12 px-6 pb-10 flex flex-col items-center w-full">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 overflow-hidden bg-slate-50">
                  <img 
                    src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                    alt="User avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h2 className="text-slate-900 font-black text-xl mb-1 text-center">{user?.name || 'Your Name'}</h2>
                <p className="text-slate-500 text-xs text-center leading-relaxed font-medium mb-8 max-w-[200px]">{user?.bio || 'Bio goes here...'}</p>
                
                <div className="w-full space-y-3">
                  {links.filter(l => l.is_active).map((link) => (
                    <div 
                      key={link.id}
                      className="w-full p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-3 transition-transform cursor-pointer hover:scale-[1.02] border border-slate-800 shadow-md"
                    >
                      <span className="material-symbols-outlined text-lg text-dash-primary">{link.icon || 'link'}</span>
                      <span className="font-bold text-sm truncate">{link.title}</span>
                    </div>
                  ))}
                  {links.filter(l => l.is_active).length === 0 && (
                    <div className="text-slate-300 text-[10px] font-black uppercase text-center mt-10">No active links</div>
                  )}
                </div>
                
                <div className="mt-12 flex flex-col items-center gap-1.5 opacity-30">
                  <span className="material-symbols-outlined text-slate-900 text-xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
                  <p className="text-[10px] text-slate-900 font-black tracking-widest uppercase">LinkinAja</p>
                </div>
              </div>
            </div>
          </div>
          <p className="absolute bottom-6 text-xs text-slate-400 flex items-center gap-1 font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">visibility</span>
            Updates automatically
          </p>
        </div>
      </main>
    </div>
  );
}
