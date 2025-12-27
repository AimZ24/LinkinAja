"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function AppearancePage() {
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  
  // Appearance states
  const [profileTitle, setProfileTitle] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [activeTheme, setActiveTheme] = useState('Classic Dark');
  const [bgType, setBgType] = useState('Flat Color');
  const [bgColor, setBgColor] = useState('#f8fafc');
  const [buttonShape, setButtonShape] = useState('Rect');
  const [buttonStyle, setButtonStyle] = useState('Fill');
  const [buttonColor, setButtonColor] = useState('#000000');
  const [titleColor, setTitleColor] = useState('#000000');
  const [bioColor, setBioColor] = useState('#666666');
  const [textAlign, setTextAlign] = useState('center');

  // Gradient helper states (Internal only, not saved directly to DB)
  const [gradColor1, setGradColor1] = useState('#13ec5b');
  const [gradColor2, setGradColor2] = useState('#000000');

  const fileInputRef = React.useRef(null);
  const bgFileInputRef = React.useRef(null);
  const router = useRouter();

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
          setProfileTitle(sessionData.user.name || '');
          setBio(sessionData.user.bio || '');
        } else {
          router.push('/login');
          return;
        }

        if (Array.isArray(linksData)) {
          setLinks(linksData);
        }

        if (appearanceData && !appearanceData.error) {
          setProfileTitle(appearanceData.name || '');
          setBio(appearanceData.bio || '');
          setProfileImage(appearanceData.profile_image || '');
          setActiveTheme(appearanceData.theme || 'Classic Dark');
          setBgType(appearanceData.bg_type || 'Flat Color');
          setBgColor(appearanceData.bg_color || '#ffffff');
          setButtonShape(appearanceData.button_shape || 'Rounded');
          setButtonStyle(appearanceData.button_style || 'Fill');
          setButtonColor(appearanceData.button_color || '#000000');
          setTitleColor(appearanceData.title_color || '#000000');
          setBioColor(appearanceData.bio_color || '#666666');

          // Parse gradient if exists
          if (appearanceData.bg_type === 'Gradient' && appearanceData.bg_color.includes('linear-gradient')) {
            const colors = appearanceData.bg_color.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g);
            if (colors && colors.length >= 2) {
              setGradColor1(colors[0]);
              setGradColor2(colors[1]);
            }
          }
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

  // Auto-generate gradient string
  useEffect(() => {
    if (bgType === 'Gradient') {
      setBgColor(`linear-gradient(to bottom, ${gradColor1}, ${gradColor2})`);
    }
  }, [gradColor1, gradColor2, bgType]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileTitle,
          bio: bio,
          profile_image: profileImage,
          theme: activeTheme,
          bg_type: bgType,
          bg_color: bgColor,
          button_shape: buttonShape,
          button_style: buttonStyle,
          button_color: buttonColor,
          font_family: 'Plus Jakarta Sans',
          title_color: titleColor,
          bio_color: bioColor
        }),
      });
      
      if (res.ok) {
        showToast('Profil berhasil dipublikasikan!', 'success');
      } else {
        showToast('Gagal mempublikasikan profil.', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      showToast('Terjadi kesalahan saat menyimpan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handlePickBgFile = () => {
    bgFileInputRef.current?.click();
  };

  const onFileChange = (e, type = 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'profile' && file.size > 1024 * 1024) {
        showToast('Gambar terlalu besar. Maksimal 1MB.', 'warning');
        return;
      }
      
      // Allow slightly larger for backgrounds (up to 5MB for images/videos)
      if (type === 'background' && file.size > 5 * 1024 * 1024) {
        showToast('File terlalu besar. Maksimal 5MB.', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfileImage(reader.result);
        } else {
          setBgColor(reader.result);
          setActiveTheme('Custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const themes = [
    { name: 'Classic Dark', colors: 'from-slate-900 to-black', text: 'white', btn: 'bg-white/10' },
    { name: 'Midnight', colors: 'from-indigo-900 to-purple-900', text: 'white', btn: 'bg-white/10' },
    { name: 'Minimal Light', colors: 'bg-[#f6f8f6]', text: 'slate-900', btn: 'bg-white border border-gray-200' },
    { name: 'Tropical', colors: 'from-emerald-500 to-teal-800', text: 'white', btn: 'bg-white/20' },
  ];

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
          <a className="flex items-center gap-3 px-3 py-3 rounded-lg bg-dash-primary/10 text-dash-primary border border-dash-primary/5 shadow-sm" href="/dashboard/appearance">
            <span className="material-symbols-outlined text-2xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
            <span className="text-sm font-bold">Appearance</span>
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
            <h2 className="text-slate-900 text-lg font-bold">Appearance</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <img src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto w-full relative dash-scrollbar bg-dash-background-light">

          <header className="hidden md:flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md px-8 py-4 sticky top-0 z-20">
            <div className="flex items-center gap-4 lg:hidden">
              <button onClick={() => setIsSidebarOpen(true)} className="text-slate-900"><span className="material-symbols-outlined">menu</span></button>
              <h2 className="text-slate-900 text-lg font-bold">Appearance</h2>
            </div>
            {/* Desktop Breadcrumbs */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Dashboard</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900 font-black">Appearance</span>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center rounded-xl size-10 bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">
                <span className="material-symbols-outlined text-lg">notifications</span>
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`linkinaja.id/${user?.username}`);
                  showToast('Link disalin!', 'success');
                }}
                className="flex items-center gap-2 rounded-xl h-10 bg-dash-primary hover:bg-[#0fd650] text-black px-5 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span className="hidden sm:inline">Share Link</span>
              </button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto px-6 py-10 md:py-14 space-y-10 pb-32">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-[-0.033em]">Profile Appearance</h1>
                <p className="text-slate-500 text-sm md:text-base font-medium">Customize how your audience sees you on LinkinAja.</p>
              </div>
              <button className="flex-none flex items-center gap-2 rounded-xl h-10 bg-white border border-slate-200 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                 <span className="material-symbols-outlined text-[18px]">visibility</span>
                 Preview Live
              </button>
            </div>

            {/* Profile Section */}
            <section className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                <span className="material-symbols-outlined text-dash-primary">account_circle</span>
                Profile
              </h3>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group cursor-pointer">
                      <div className="size-24 rounded-full bg-slate-50 border-4 border-white shadow-xl ring-1 ring-slate-100 overflow-hidden">
                        <img 
                          src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                          className="w-full h-full object-cover" 
                          alt="Avatar"
                        />
                      </div>
                      <div onClick={handlePickImage} className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-overlay">
                        <span className="material-symbols-outlined text-white">edit</span>
                      </div>
                    </div>
                    <button 
                         onClick={handlePickImage}
                         className="text-[10px] font-black text-dash-primary hover:text-slate-900 uppercase tracking-[0.2em] transition-colors"
                    >
                        Pick Image
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => onFileChange(e, 'profile')} 
                        className="hidden" 
                        accept="image/*"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile Title</label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-4 focus:ring-dash-primary/10 rounded-2xl h-12 px-5 text-slate-900 font-black transition-all outline-none" 
                        placeholder="@username" 
                        type="text" 
                        value={profileTitle}
                        onChange={(e) => setProfileTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-end mr-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio Description</label>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bio.length}/150</span>
                      </div>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-dash-primary focus:ring-4 focus:ring-dash-primary/10 rounded-2xl min-h-[100px] p-5 text-slate-900 font-medium transition-all resize-none outline-none" 
                        placeholder="Tell your audience about yourself..."
                        maxLength={150}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title Color</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={titleColor} 
                                    onChange={(e) => {
                                        setTitleColor(e.target.value);
                                        setActiveTheme('Custom');
                                    }}
                                    className="h-10 w-10 rounded-xl cursor-pointer bg-white border border-slate-200 p-1"
                                />
                                <input 
                                    type="text" 
                                    value={titleColor} 
                                    onChange={(e) => {
                                        setTitleColor(e.target.value);
                                        setActiveTheme('Custom');
                                    }}
                                    className="bg-slate-50 border border-slate-200 rounded-xl h-10 px-4 text-slate-900 font-black flex-1 text-xs uppercase outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio Color</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={bioColor} 
                                    onChange={(e) => {
                                        setBioColor(e.target.value);
                                        setActiveTheme('Custom');
                                    }}
                                    className="h-10 w-10 rounded-xl cursor-pointer bg-white border border-slate-200 p-1"
                                />
                                <input 
                                    type="text" 
                                    value={bioColor} 
                                    onChange={(e) => {
                                        setBioColor(e.target.value);
                                        setActiveTheme('Custom');
                                    }}
                                    className="bg-slate-50 border border-slate-200 rounded-xl h-10 px-4 text-slate-900 font-black flex-1 text-xs uppercase outline-none"
                                />
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Themes Section */}
            <section className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                <span className="material-symbols-outlined text-dash-primary">grid_view</span>
                Themes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themes.map((theme, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveTheme(theme.name)}
                    className="group relative flex flex-col gap-3 text-left transition-transform hover:-translate-y-1"
                  >
                    <div className={`aspect-[9/16] w-full rounded-2xl ${theme.colors === 'bg-[#f6f8f6]' ? 'bg-[#f6f8f6] border border-slate-200' : 'bg-gradient-to-br ' + theme.colors} ${activeTheme === theme.name ? 'ring-4 ring-dash-primary ring-offset-2' : 'border border-slate-200'} overflow-hidden p-3 shadow-sm`}>
                      <div className="flex flex-col items-center gap-2 pt-4">
                        <div className={`size-6 rounded-full ${theme.text === 'white' ? 'bg-white/20' : 'bg-slate-200'}`}></div>
                        <div className={`w-12 h-1.5 rounded-full ${theme.text === 'white' ? 'bg-white/20' : 'bg-slate-200'}`}></div>
                        <div className={`w-full h-8 rounded-lg mt-2 ${theme.btn}`}></div>
                        <div className={`w-full h-8 rounded-lg ${theme.btn}`}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full px-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${activeTheme === theme.name ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>{theme.name}</span>
                      {activeTheme === theme.name && (
                        <span className="size-4 rounded-full bg-dash-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-black text-[12px] font-black">check</span>
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Customization Section */}
            <section className="space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                <span className="material-symbols-outlined text-dash-primary">tune</span>
                Customization
              </h3>
              
              {/* Background Accordion */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left group">
                  <span className="font-black text-sm uppercase tracking-widest text-slate-900">Background</span>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-900 transition-colors">expand_more</span>
                </button>
                <div className="p-6 pt-0 border-t border-slate-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                      { type: 'Flat Color', icon: 'palette', style: 'bg-slate-100' },
                      { type: 'Gradient', icon: 'gradient', style: 'bg-gradient-to-r from-slate-200 to-slate-400' },
                      { type: 'Image', icon: 'image', style: 'bg-slate-50 border-dashed border-2 border-slate-200' },
                      { type: 'Video', icon: 'movie', style: 'bg-slate-900 text-white' }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div 
                          onClick={() => {
                            setBgType(item.type);
                            setActiveTheme('Custom');
                          }}
                          className={`h-12 rounded-2xl ${item.style} flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${bgType === item.type ? 'ring-4 ring-dash-primary/20 border-2 border-dash-primary' : 'border border-slate-200'}`}
                        >
                          {bgType === item.type ? (
                            <span className="material-symbols-outlined text-dash-primary text-sm font-black">check</span>
                          ) : (
                            <span className="material-symbols-outlined text-slate-400 text-sm">{item.icon}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 space-y-6">
                    {bgType === 'Flat Color' && (
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Background Color</label>
                            <div className="flex items-center gap-4">
                            <input 
                                className="h-12 w-12 rounded-xl cursor-pointer bg-white border-2 border-slate-200 p-1" 
                                type="color" 
                                value={bgColor}
                                onChange={(e) => {
                                    setBgColor(e.target.value);
                                    setActiveTheme('Custom');
                                }}
                            />
                            <input 
                                className="bg-slate-50 border border-slate-200 rounded-xl h-12 px-5 text-slate-900 font-black w-32 text-sm uppercase outline-none focus:border-dash-primary transition-all" 
                                type="text" 
                                value={bgColor}
                                onChange={(e) => {
                                    setBgColor(e.target.value);
                                    setActiveTheme('Custom');
                                }}
                            />
                            </div>
                        </div>
                    )}

                    {bgType === 'Gradient' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Choose Colors</label>
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Start</span>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="color" 
                                            value={gradColor1} 
                                            onChange={(e) => {
                                                setGradColor1(e.target.value);
                                                setActiveTheme('Custom');
                                            }}
                                            className="h-12 w-12 rounded-xl cursor-pointer bg-white border border-slate-200 p-1"
                                        />
                                        <input 
                                            type="text" 
                                            value={gradColor1} 
                                            onChange={(e) => {
                                                setGradColor1(e.target.value);
                                                setActiveTheme('Custom');
                                            }}
                                            className="bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-slate-900 font-black w-28 text-xs uppercase outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">End</span>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="color" 
                                            value={gradColor2} 
                                            onChange={(e) => {
                                                setGradColor2(e.target.value);
                                                setActiveTheme('Custom');
                                            }}
                                            className="h-12 w-12 rounded-xl cursor-pointer bg-white border border-slate-200 p-1"
                                        />
                                        <input 
                                            type="text" 
                                            value={gradColor2} 
                                            onChange={(e) => {
                                                setGradColor2(e.target.value);
                                                setActiveTheme('Custom');
                                            }}
                                            className="bg-slate-50 border border-slate-200 rounded-xl h-12 px-4 text-slate-900 font-black w-28 text-xs uppercase outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Gradient CSS:</span>
                                <code className="text-[10px] text-dash-primary font-bold bg-white p-2 rounded-lg border border-slate-100 break-all">{bgColor}</code>
                            </div>
                        </div>
                    )}

                    {bgType === 'Image' && (
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Upload Background Image</label>
                            <div 
                                onClick={handlePickBgFile}
                                className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 transition-all overflow-hidden group"
                            >
                                {bgColor && bgColor.startsWith('data:image') ? (
                                    <img src={bgColor} className="w-full h-full object-cover opacity-50" alt="Preview"/>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:scale-110 transition-transform">cloud_upload</span>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Click to upload image<br/><span className="lowercase font-medium opacity-60">(Max 5MB)</span></p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {bgType === 'Video' && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Upload Background Video</label>
                            <div 
                                onClick={handlePickBgFile}
                                className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 transition-all overflow-hidden group"
                            >
                                {bgColor && bgColor.startsWith('data:video') ? (
                                    <video src={bgColor} className="w-full h-full object-cover opacity-50" muted />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:scale-110 transition-transform">movie</span>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Click to upload MP4 video<br/><span className="lowercase font-medium opacity-60">(Max 5MB)</span></p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <input 
                        type="file" 
                        ref={bgFileInputRef} 
                        onChange={(e) => onFileChange(e, 'background')} 
                        className="hidden" 
                        accept={bgType === 'Image' ? 'image/*' : 'video/mp4'}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons Accordion */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left group">
                  <span className="font-black text-sm uppercase tracking-widest text-slate-900">Buttons</span>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-900 transition-colors">expand_more</span>
                </button>
                <div className="p-6 pt-0 border-t border-slate-50">
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Shape</label>
                      <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-200 w-fit gap-1">
                        {['Rect', 'Rounded', 'Pill'].map((shape) => (
                           <button 
                            key={shape}
                            onClick={() => setButtonShape(shape)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${buttonShape === shape ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                            {shape}
                           </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Style</label>
                      <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-200 w-fit gap-1 flex-wrap">
                        {['Fill', 'Outline', 'Soft', 'Shadow'].map((style) => (
                           <button 
                            key={style}
                            onClick={() => setButtonStyle(style)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${buttonStyle === style ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                            {style}
                           </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Button Color</label>
                      <div className="flex items-center gap-4">
                        <input 
                          className="h-12 w-12 rounded-xl cursor-pointer bg-white border-2 border-slate-200 p-1" 
                          type="color" 
                          value={buttonColor}
                          onChange={(e) => setButtonColor(e.target.value)}
                        />
                        <input 
                          className="bg-slate-50 border border-slate-200 rounded-xl h-12 px-5 text-slate-900 font-black w-32 text-sm uppercase outline-none focus:border-dash-primary transition-all" 
                          type="text" 
                          value={buttonColor}
                          onChange={(e) => setButtonColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fonts Accordion */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left group">
                  <span className="font-black text-sm uppercase tracking-widest text-slate-900">Typography</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plus Jakarta Sans</span>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-900 transition-colors">expand_more</span>
                  </div>
                </button>
              </div>
            </section>

            {/* Bottom Bar Mobile-ish Style Floating */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col text-center sm:text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Appearance Config</p>
                    <p className="text-xs font-bold text-slate-500">Preview sounds good? Push it live.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-[0.2em]">Reset</button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-10 py-3.5 rounded-2xl text-[10px] font-black text-black bg-dash-primary hover:bg-[#0fd650] shadow-[0_8px_20px_rgba(19,236,91,0.2)] transition-all transform active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em]"
                    >
                        {saving ? 'Syncing...' : 'Publish Profile'}
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="hidden lg:flex w-[420px] xl:w-[480px] bg-slate-50 border-l border-slate-200 flex-col items-center justify-center p-8 shrink-0 relative">
          <div className="absolute top-8 left-0 right-0 text-center">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Live Preview</p>
            <div className="flex items-center justify-center gap-2 text-dash-primary text-sm font-black bg-white py-1.5 px-4 rounded-full mx-auto w-fit shadow-sm border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-dash-primary animate-pulse shadow-[0_0_10px_#13ec5b]"></span>
              linkinaja.id/{user?.username}
            </div>
          </div>
          
          {/* Phone Mockup */}
          <div className="relative w-[300px] h-[600px] bg-white rounded-[4rem] border-8 border-slate-900 shadow-2xl overflow-hidden transform scale-90 xl:scale-100 transition-transform">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
            
            {/* Dynamic Content Inside Phone */}
            <div 
              className={`h-full w-full overflow-y-auto no-scrollbar relative flex flex-col items-center
                ${activeTheme === 'Classic Dark' ? 'bg-black text-white' : ''}
                ${activeTheme === 'Midnight' ? 'bg-gradient-to-br from-indigo-950 to-purple-950 text-white' : ''}
                ${activeTheme === 'Minimal Light' ? 'bg-[#f6f8f6] text-slate-900' : ''}
                ${activeTheme === 'Tropical' ? 'bg-emerald-600 text-white' : ''}
                ${activeTheme === 'Custom' ? 'bg-white text-slate-900' : ''}
              `} 
              style={{ 
                backgroundColor: bgType === 'Flat Color' ? bgColor : undefined,
                backgroundImage: bgType === 'Gradient' ? bgColor : bgType === 'Image' ? `url(${bgColor})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {bgType === 'Video' && (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  src={bgColor}
                />
              )}
              
              <div className="w-full h-24 shrink-0 z-10"></div>
              
              <div className="relative -mt-12 px-6 pb-10 flex flex-col items-center w-full z-10">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl mb-4 overflow-hidden bg-slate-50">
                   <img 
                    src={profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                    alt="Preview Avatar" 
                    className="w-full h-full object-cover"
                   />
                </div>
                <div className={`w-full mb-8`} style={{ textAlign: textAlign }}>
                  <h2 className="font-black text-base leading-tight truncate px-2" style={{ color: activeTheme === 'Custom' ? titleColor : undefined }}>{profileTitle || 'Your Name'}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 leading-relaxed opacity-60 line-clamp-3 px-2" style={{ color: activeTheme === 'Custom' ? bioColor : undefined }}>{bio || 'Bio goes here...'}</p>
                </div>

                {/* Links List Preview */}
                <div className="flex flex-col gap-3 w-full px-1">
                  {links.filter(l => l.is_active).map((link, i) => {
                    const radius = buttonShape === 'Rect' ? 'rounded-none' : buttonShape === 'Pill' ? 'rounded-full' : 'rounded-xl';
                    const isOutline = buttonStyle === 'Outline';
                    const isSoft = buttonStyle === 'Soft';
                    const isShadow = buttonStyle === 'Shadow';

                    return (
                        <div 
                          key={link.id}
                          className={`w-full p-3.5 ${radius} flex items-center gap-3 transition-transform cursor-pointer border shadow-sm`}
                          style={{
                             backgroundColor: isOutline ? 'transparent' : isSoft ? `${buttonColor}22` : buttonColor,
                             borderColor: (isOutline || isShadow) ? buttonColor : 'transparent',
                             color: (isOutline || isSoft) ? buttonColor : '#fff',
                             boxShadow: isShadow ? `3px 3px 0px ${activeTheme === 'Minimal Light' ? '#000' : 'rgba(255,255,255,0.2)'}` : undefined
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
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="mt-8 w-full max-w-[300px] bg-dash-primary hover:bg-[#0fd650] text-black font-black py-4 px-6 rounded-2xl shadow-[0_8px_20px_rgba(19,236,91,0.2)] transition-all transform hover:scale-[1.02] uppercase tracking-[0.2em] text-xs"
          >
            {saving ? 'Saving...' : 'Publish Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
