"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Harap isi semua bidang kata sandi.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok.', 'warning');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Kata sandi berhasil diperbarui!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.error || 'Gagal memperbarui kata sandi.', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      showToast('Terjadi kesalahan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Apakah Anda benar-benar yakin? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data Anda secara permanen.')) {
        try {
            const res = await fetch('/api/user/delete', { method: 'POST' });
            if (res.ok) {
                showToast('Akun berhasil dihapus. Mengalihkan...', 'success');
                setTimeout(() => {
                    router.push('/');
                    router.refresh();
                }, 2000);
            } else {
                showToast('Gagal menghapus akun.', 'error');
            }
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Terjadi kesalahan.', 'error');
        }
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
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group" href="/dashboard/profile">
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">person</span>
              <span className="text-sm font-medium">Profile</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard/settings">
              <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
              <span className="text-sm font-bold">Settings</span>
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
            <h2 className="text-slate-900 text-lg font-bold">Settings</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full relative dash-scrollbar bg-dash-background-light">
          <div className="max-w-2xl mx-auto px-6 py-10 md:py-14 space-y-8 pb-32">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Account Settings</h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">Manage your login details, subscription, and account preferences.</p>
            </div>

            {/* Email Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-900 text-lg font-black">Email Address</h3>
                  <p className="text-slate-500 text-sm mt-1 font-medium">The email address associated with your LinkinAja account.</p>
                </div>
                <button className="text-dash-primary hover:text-slate-900 text-sm font-black transition-colors uppercase tracking-widest">Edit</button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-black">{user?.email || 'email@example.com'}</p>
                  <p className="text-[10px] text-dash-primary flex items-center gap-1 mt-0.5 font-black uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[14px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                <h3 className="text-slate-900 text-lg font-black border-b border-slate-50 pb-4">Change Password</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="current-password">Current Password</label>
                        <input 
                            className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base transition-all outline-none font-bold" 
                            id="current-password" 
                            placeholder="Enter current password" 
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="new-password">New Password</label>
                            <input 
                                className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base transition-all outline-none font-bold" 
                                id="new-password" 
                                placeholder="Enter new password" 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" htmlFor="confirm-password">Confirm New Password</label>
                            <input 
                                className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-2 focus:ring-dash-primary/20 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 text-base transition-all outline-none font-bold" 
                                id="confirm-password" 
                                placeholder="Confirm new password" 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-2">
                    <button 
                        onClick={handleUpdatePassword}
                        disabled={saving}
                        className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-black rounded-xl transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                    >
                        {saving ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>

            {/* Subscription Section */}
            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-sm">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-dash-primary/10 rounded-full blur-3xl group-hover:bg-dash-primary/20 transition-all duration-700"></div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 mb-6 font-display">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-slate-900 text-lg font-black">Subscription Plan</h3>
                            <span className="px-3 py-1 rounded-full bg-dash-primary text-black text-[10px] font-black uppercase tracking-widest shadow-sm">Pro</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Supercharge your link-in-bio.</p>
                    </div>
                    <button className="text-slate-400 hover:text-dash-primary text-[10px] font-black uppercase tracking-widest underline decoration-slate-200 hover:decoration-dash-primary underline-offset-8 transition-all">
                        Billing History
                    </button>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Current Plan Cost</span>
                        <span className="text-slate-900 font-black text-xl">Rp 49.000<span className="text-slate-400 font-bold text-xs">/month</span></span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Next Billing Date</span>
                        <span className="text-slate-900 font-black text-sm">October 24, 2023</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                        <div className="bg-dash-primary h-full w-3/4 rounded-full shadow-sm"></div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-8">21 days remaining in this cycle</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 px-4 py-4 bg-slate-900 text-white hover:bg-slate-800 text-sm font-black rounded-2xl transition-all active:scale-95 shadow-xl shadow-slate-100 uppercase tracking-widest">
                            Upgrade Plan
                        </button>
                        <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-sm font-black rounded-2xl transition-all uppercase tracking-widest">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-500/20 bg-red-50/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                <h3 className="text-red-500 text-lg font-black flex items-center gap-2">
                    <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                    Danger Zone
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-slate-900 text-sm font-black">Delete Account</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Permanently delete your account and all data</span>
                    </div>
                    <button 
                        onClick={handleDeleteAccount}
                        className="w-full sm:w-auto px-8 py-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/10 text-[10px] font-black rounded-xl transition-all uppercase tracking-[0.2em]"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
          </div>

          {/* Bottom Bar Mobile-ish */}
          <div className="fixed bottom-0 md:left-64 left-0 right-0 lg:right-[420px] bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 z-10 transition-all">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest"><span className="text-dash-primary font-black">*</span> Some changes may require re-login</span>
                <button 
                    onClick={handleUpdatePassword}
                    className="px-10 py-3.5 rounded-2xl text-xs font-black text-black bg-dash-primary hover:bg-[#0fd650] shadow-[0_8px_20px_rgba(19,236,91,0.3)] transition-all transform active:scale-95 uppercase tracking-[0.2em]"
                >
                    Save Changes
                </button>
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
          <div className="relative w-[300px] h-[600px] bg-white rounded-[4rem] border-8 border-slate-900 shadow-2xl overflow-hidden transform scale-90 xl:scale-100 transition-transform">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
            <div className="w-full h-full bg-white overflow-y-auto no-scrollbar relative flex flex-col items-center">
              <div className="w-full h-32 bg-gradient-to-b from-dash-primary/20 to-transparent"></div>
              <div className="relative -mt-12 px-6 pb-10 flex flex-col items-center w-full">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl mb-4 overflow-hidden bg-slate-50">
                   <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-slate-900 font-black text-xl mb-1 text-center truncate w-full">{user?.name || 'Your Name'}</h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center leading-relaxed max-w-[200px] mb-8 line-clamp-2">{user?.bio || 'Bio goes here...'}</p>
                <div className="w-full space-y-3 px-2">
                  {links.filter(l => l.is_active).map((link) => (
                    <div key={link.id} className="block w-full p-4 rounded-2xl bg-slate-900 text-white hover:scale-[1.02] transition-transform cursor-default border border-slate-800 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-dash-primary shrink-0">
                          <span className="material-symbols-outlined text-lg">{link.icon || 'link'}</span>
                        </div>
                        <span className="text-white font-black text-xs truncate">{link.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 flex flex-col items-center gap-1.5 opacity-30">
                  <span className="material-symbols-outlined text-slate-900 text-xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
                  <p className="text-[10px] text-slate-900 font-black tracking-widest uppercase">LinkinAja</p>
                </div>
              </div>
            </div>
          </div>
          <p className="absolute bottom-6 text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">visibility</span>
            Updates automatically
          </p>
        </div>
      </main>
    </div>
  );
}
