import React from 'react';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { ExternalLink, Instagram, Twitter, Github, Globe } from 'lucide-react';
import { headers } from 'next/headers';

export default async function PublicProfilePage({ params }) {
  const { username } = await params;

  // Fetch user with appearance settings
  const user = db.prepare(`
    SELECT id, name, username, bio, profile_image, 
           theme, bg_type, bg_color, button_shape, button_style, button_color, font_family 
    FROM users 
    WHERE username = ?
  `).get(username);

  if (!user) {
    notFound();
  }

  // Log View
  try {
    const headerList = await headers();
    const userAgent = headerList.get('user-agent');
    const forwardedFor = headerList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    db.prepare(`
      INSERT INTO analytics (user_id, link_id, ip_address, user_agent)
      VALUES (?, NULL, ?, ?)
    `).run(user.id, ip, userAgent);
  } catch (e) {
    console.error('View tracking error:', e);
  }

  // Fetch active links
  const links = db.prepare('SELECT * FROM links WHERE user_id = ? AND is_active = 1 ORDER BY sort_order ASC, created_at DESC').all(user.id);

  const getThemeStyles = () => {
    switch (user.theme) {
      case 'Classic Dark':
        return {
          wrapper: 'bg-black text-white selection:bg-primary/30',
          card: 'bg-white/5 border-white/10 text-white hover:border-primary',
          iconContainer: 'bg-white/10 text-primary',
          title: 'text-white',
          bio: 'text-white/60',
          footer: 'text-white'
        };
      case 'Midnight':
        return {
          wrapper: 'bg-gradient-to-br from-indigo-950 to-purple-950 text-white selection:bg-primary/40',
          card: 'bg-white/10 border-white/20 text-white hover:bg-white/15',
          iconContainer: 'bg-white/20 text-primary',
          title: 'text-white',
          bio: 'text-white/60',
          footer: 'text-white'
        };
      case 'Minimal Light':
        return {
          wrapper: 'bg-[#f6f8f6] text-slate-900 selection:bg-primary/20',
          card: 'bg-white border-gray-200 text-slate-900 shadow-sm hover:shadow-xl hover:border-primary',
          iconContainer: 'bg-slate-100 text-slate-600',
          title: 'text-slate-900',
          bio: 'text-slate-500',
          footer: 'text-slate-900'
        };
      case 'Tropical':
        return {
          wrapper: 'bg-gradient-to-b from-emerald-500 to-teal-800 text-white selection:bg-white/30',
          card: 'bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30',
          iconContainer: 'bg-white/10 text-white',
          title: 'text-white',
          bio: 'text-white/80',
          footer: 'text-white'
        };
      default:
        // Custom / Default Light
        return {
          wrapper: 'text-slate-900',
          card: 'bg-white border-slate-200 text-slate-900 hover:border-primary shadow-sm',
          iconContainer: 'bg-slate-100 text-slate-600',
          title: 'text-slate-900',
          bio: 'text-slate-500',
          footer: 'text-slate-900'
        };
    }
  };

  const styles = getThemeStyles();
  
  // Override background if custom
  const customBgStyle = {
    backgroundColor: user.bg_type === 'Flat Color' ? user.bg_color : undefined,
    backgroundImage: user.bg_type === 'Gradient' ? user.bg_color : user.bg_type === 'Image' ? `url(${user.bg_color})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    fontFamily: user.font_family
  };

  const getButtonStyles = () => {
    const radiusMap = { 'Rect': 'rounded-none', 'Rounded': 'rounded-2xl', 'Pill': 'rounded-full' };
    const radius = radiusMap[user.button_shape] || 'rounded-2xl';
    
    let base = `${radius} transition-all duration-300 `;
    let custom = {};

    switch (user.button_style) {
        case 'Outline':
            base += 'bg-transparent border-2 ';
            custom = { borderColor: user.button_color, color: user.button_color };
            break;
        case 'Soft':
            base += 'border-none ';
            custom = { backgroundColor: `${user.button_color}22`, color: user.button_color }; // 22 is ~13% opacity
            break;
        case 'Shadow':
            base += 'border-2 ';
            custom = { 
                backgroundColor: user.button_color, 
                borderColor: user.button_color, 
                color: '#ffffff',
                boxShadow: `4px 4px 0px ${user.theme === 'Minimal Light' ? '#000' : 'rgba(255,255,255,0.2)'}`
            };
            break;
        default: // Fill
            base += 'border-none ';
            custom = { backgroundColor: user.button_color, color: '#ffffff' };
    }
    return { className: base, style: custom };
  };

  const btnStyles = getButtonStyles();

  return (
    <div 
        className={`min-h-screen relative overflow-x-hidden ${styles.wrapper}`} 
        style={customBgStyle}
    >
      {user.bg_type === 'Video' && (
        <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="fixed inset-0 w-full h-full object-cover z-0"
            src={user.bg_color}
        />
      )}
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-12 text-center w-full">
          <div className="size-24 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 shadow-xl mb-6 overflow-hidden">
            {user.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="size-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <h1 
            className={`text-2xl font-black mb-2 leading-tight ${styles.title}`}
            style={{ color: user.theme === 'Custom' ? user.title_color : undefined }}
          >
            {user.name}
          </h1>
          <p 
            className={`text-base max-w-sm font-medium ${styles.bio}`}
            style={{ color: user.theme === 'Custom' ? user.bio_color : undefined }}
          >
            {user.bio || `Cek tautan resmi @${user.username} di sini.`}
          </p>
        </div>

        {/* Links Container */}
        <div className="w-full space-y-4 mb-16 px-2">
          {links.length === 0 ? (
            <div className="text-center p-12 rounded-3xl border-2 border-dashed border-white/10 opacity-50">
              Belum ada tautan aktif.
            </div>
          ) : (
            links.map((link) => (
              <a 
                key={link.id}
                href={`/api/click?id=${link.id}&url=${encodeURIComponent(link.url)}`}
                className={`group relative w-full p-4.5 flex items-center justify-between shadow-sm hover:scale-[1.02] active:scale-[0.98] ${btnStyles.className}`}
                style={btnStyles.style}
              >
                <div className="flex items-center gap-4">
                  <div className={`size-11 rounded-xl flex items-center justify-center bg-white/10 group-hover:scale-110 transition-transform`}>
                    {getIconForUrl(link.url)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide uppercase">
                      {link.title}
                    </h3>
                  </div>
                </div>
                <div className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <ExternalLink size={18} />
                </div>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 flex flex-col items-center gap-6">
          <div className={`flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity ${styles.footer}`}>
             <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            <span className="font-black tracking-tighter text-lg">LinkinAja</span>
          </div>
          <a href="/daftar" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 hover:opacity-100 hover:text-primary transition-all">
            Buat halaman link kamu sendiri gratis
          </a>
        </div>
      </div>
    </div>
  );
}

function getIconForUrl(url) {
  const u = url.toLowerCase();
  if (u.includes('instagram.com')) return <Instagram size={24} />;
  if (u.includes('twitter.com') || u.includes('x.com')) return <Twitter size={24} />;
  if (u.includes('github.com')) return <Github size={24} />;
  return <Globe size={24} />;
}
