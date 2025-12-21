import React from 'react';
import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { ExternalLink, Instagram, Twitter, Github, Globe } from 'lucide-react';

export default async function PublicProfilePage({ params }) {
  const { username } = await params;

  // Fetch user
  const user = db.prepare('SELECT id, name, username, bio, profile_image FROM users WHERE username = ?').get(username);

  if (!user) {
    notFound();
  }

  // Fetch active links
  const links = db.prepare('SELECT * FROM links WHERE user_id = ? AND is_active = 1 ORDER BY sort_order ASC, created_at DESC').all(user.id);

  return (
    <div className="min-h-screen bg-[#f6f8f5] dark:bg-[#162210] selection:bg-primary/30">
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="size-24 bg-white dark:bg-white/10 rounded-full flex items-center justify-center border-4 border-white dark:border-white/5 shadow-xl mb-6 overflow-hidden">
            {user.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="size-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
            {user.name}
          </h1>
          <p className="text-slate-500 dark:text-[#a0b396] text-base max-w-sm">
            {user.bio || `Cek tautan resmi @${user.username} di sini.`}
          </p>
        </div>

        {/* Links Container */}
        <div className="w-full space-y-4 mb-16">
          {links.length === 0 ? (
            <div className="text-center p-8 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 text-slate-400">
              Belum ada tautan aktif.
            </div>
          ) : (
            links.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full p-4 flex items-center justify-between bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-primary transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {getIconForUrl(link.url)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                  </div>
                </div>
                <div className="text-slate-300 dark:text-white/20 group-hover:text-primary transition-colors">
                  <ExternalLink size={18} />
                </div>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <svg className="size-5 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
            </svg>
            <span className="text-slate-900 dark:text-white font-bold tracking-tight">LinkinAja</span>
          </div>
          <a href="/" className="text-xs text-slate-400 hover:text-primary transition-colors">
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
