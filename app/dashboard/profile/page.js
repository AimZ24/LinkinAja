"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, profile_image: profileImage }),
      });
      
      if (res.ok) {
        // Update local user state
        setUser(prev => ({ ...prev, name, bio, profile_image: profileImage }));
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('An error occurred.');
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
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/links">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">link</span>
            <span className="text-sm font-medium">Links</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-3 rounded-xl bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard/profile">
            <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            <span className="text-sm font-bold">Profile</span>
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
              <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Profile Settings</h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">Customize how your audience sees you on LinkinAja.</p>
            </div>

            {/* Profile Image Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-xl ring-1 ring-slate-100">
                    <img 
                      src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] cursor-pointer">
                    <span className="material-symbols-outlined text-white font-bold">edit</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1 text-center sm:text-left pt-2">
                  <div>
                    <h3 className="text-slate-900 text-lg font-bold">Profile Image</h3>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Accepts URL to JPG, PNG or WEBP.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="text"
                      className="flex-1 bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none font-medium transition-all"
                      placeholder="Paste image URL here..."
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                    />
                    <button 
                      onClick={() => setProfileImage('')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* General Information */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm transition-all">
              <h3 className="text-slate-900 text-lg font-bold border-b border-slate-100 pb-4">General Information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">LinkinAja URL</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50 ring-0 focus-within:ring-2 focus-within:ring-dash-primary/50 transition-all">
                  <span className="px-4 py-3 bg-slate-100 text-slate-500 text-sm font-bold border-r border-slate-200 flex items-center select-none uppercase tracking-wider">linkinaja.id/</span>
                  <input 
                    className="flex-1 bg-transparent border-none text-slate-500 text-sm px-4 py-3 focus:ring-0 cursor-not-allowed select-none font-bold" 
                    disabled 
                    type="text" 
                    value={user?.username || ''}
                  />
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(`linkinaja.id/${user?.username}`);
                        alert('Copied to clipboard!');
                    }}
                    className="px-4 text-slate-400 hover:text-dash-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Display Name</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base font-bold transition-all outline-none" 
                  placeholder="e.g. My Awesome Brand" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-700">Bio</label>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{bio.length}/150</span>
                </div>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base font-medium transition-all resize-none outline-none" 
                  placeholder="Tell your audience who you are..." 
                  rows="4"
                  maxLength={150}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Save Button Bar */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unsaved Changes</p>
                    <p className="text-sm font-medium text-slate-600">Don't forget to save your profile.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            setName(user?.name || '');
                            setBio(user?.bio || '');
                            setProfileImage(user?.profile_image || '');
                        }}
                        className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 rounded-xl text-sm font-black text-black bg-dash-primary hover:bg-[#0fd650] shadow-[0_4px_15px_rgba(19,236,91,0.2)] transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="w-[420px] border-l border-slate-200 bg-slate-50 hidden lg:flex flex-col items-center justify-center relative p-8 z-10">
          <div className="absolute top-8 left-0 right-0 text-center">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Live Preview</p>
            <div className="flex items-center justify-center gap-2 text-dash-primary text-sm font-black text-sm font-semibold bg-white py-1.5 px-4 rounded-full mx-auto w-fit shadow-sm border border-slate-100">
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
                    src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                    alt="User avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <h2 className="text-slate-900 font-black text-xl mb-1 text-center truncate w-full">{name || 'Your Name'}</h2>
                <p className="text-slate-500 text-xs text-center leading-relaxed font-medium mb-8 max-w-[200px] break-words">{bio || 'Bio goes here...'}</p>
                
                <div className="w-full space-y-3 px-2">
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
                    <div className="text-slate-300 text-[10px] font-black uppercase text-center mt-10 tracking-widest">No active links</div>
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
