"use client";
import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  BadgeCheck,
  Instagram,
  Twitter,
  Menu,
  X 
} from 'lucide-react';

export default function HargaPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-background-light text-slate-900 font-sans antialiased transition-colors duration-300">
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 bg-white/80 glass-panel">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
          <a className="flex items-center space-x-3 rtl:space-x-reverse" href="/">
            <span className="self-center text-xl font-bold whitespace-nowrap tracking-tight">LinkinAja</span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <a className="text-slate-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200 font-semibold rounded-full text-sm px-5 py-2.5 text-center me-2 hidden sm:block" href="/login">
              Masuk
            </a>
            <a className="text-white bg-primary hover:bg-primary-hover focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-full text-sm px-5 py-2.5 text-center shadow-lg shadow-green-500/30 transition-transform hover:scale-105" href="/daftar">
              Buat Gratis
            </a>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-controls="navbar-sticky" 
              aria-expanded={isMenuOpen} 
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" 
              type="button"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div className={`${isMenuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0" href="/">Beranda</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0" href="/fitur">Fitur</a>
              </li>
              <li>
                <a aria-current="page" className="block py-2 px-3 text-white bg-primary rounded md:bg-transparent md:text-primary md:p-0" href="/harga">Harga</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0" href="/blogs">Blog</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen">
        <div className="blob bg-green-200 w-96 h-96 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="blob bg-lime-200 w-[500px] h-[500px] rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Investasi Kecil, <br className="hidden md:block" /> <span className="text-gradient">Impact Besar</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Pilih paket yang pas buat kebutuhanmu. Mulai dari yang gratisan sampai fitur pro untuk cuan maksimal.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 select-none">
              <span className="text-sm font-semibold text-slate-900">Bulanan</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" value="" />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="text-sm font-semibold text-slate-500">Tahunan <span className="inline-flex items-center justify-center px-2 py-0.5 ml-1 text-xs font-bold text-green-800 bg-green-100 rounded-full">Hemat 20%</span></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all relative group">
              <h3 className="text-xl font-bold text-slate-900">Starter</h3>
              <p className="text-slate-500 text-sm mt-2">Buat yang baru coba-coba.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900">Rp 0</span>
                <span className="text-slate-500 font-medium">/bulan</span>
              </div>
              <button className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-slate-900 font-bold rounded-xl transition-colors mb-8 group-hover:scale-[1.02]">
                Mulai Gratis
              </button>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited Links</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Basic Analytics (7 hari)</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Tema Standar</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Profile QR Code</li>
                <li className="flex items-center gap-3 text-slate-400"><XCircle className="w-5 h-5 text-gray-300" /> Custom Domain</li>
                <li className="flex items-center gap-3 text-slate-400"><XCircle className="w-5 h-5 text-gray-300" /> Hapus Logo LinkinAja</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-primary rounded-3xl p-8 shadow-2xl scale-105 relative z-10 overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-400 to-lime-400"></div>
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-green-500 to-lime-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                  Favorit
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Kreator Pro</h3>
              <p className="text-slate-500 text-sm mt-2">Wajib punya buat kreator serius.</p>
              <div className="my-6 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-slate-900">29rb</span>
                <span className="text-slate-500 font-medium">/bulan</span>
              </div>
              <button className="w-full py-4 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] mb-8">
                Coba Pro Gratis 14 Hari
              </button>
              <div className="space-y-4">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Semua fitur Starter, plus:</p>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li className="flex items-center gap-3"><BadgeCheck className="w-5 h-5 text-primary" /> <strong>Hapus Logo LinkinAja</strong></li>
                  <li className="flex items-center gap-3"><BadgeCheck className="w-5 h-5 text-primary" /> Custom Font & Background</li>
                  <li className="flex items-center gap-3"><BadgeCheck className="w-5 h-5 text-primary" /> Analisis Lengkap (1 Tahun)</li>
                  <li className="flex items-center gap-3"><BadgeCheck className="w-5 h-5 text-primary" /> SEO Customization</li>
                  <li className="flex items-center gap-3"><BadgeCheck className="w-5 h-5 text-primary" /> Integrasi Email Newsletter</li>
                  <li className="flex items-center gap-3"><BadgeCheck className="w-5 h-5 text-primary" /> Prioritas Support WhatsApp</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all relative group">
              <h3 className="text-xl font-bold text-slate-900">UMKM Biz</h3>
              <p className="text-slate-500 text-sm mt-2">Solusi lengkap jualan online.</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-slate-900">Rp 99rb</span>
                <span className="text-slate-500 font-medium">/bulan</span>
              </div>
              <button className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-slate-900 font-bold rounded-xl transition-colors mb-8 group-hover:scale-[1.02]">
                Hubungi Sales
              </button>
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semua fitur Pro, plus:</p>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> 0% Transaction Fee</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Integrasi Pixel (FB/TikTok)</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> 5 Akun Admin</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Custom Domain (your.com)</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Bantuan Setup Awal</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Dedicated Account Manager</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-24 pb-10 text-center">
            <p className="text-slate-500 mb-8 font-medium">Dipercaya oleh 50.000+ brand lokal & kreator</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="font-display font-black text-2xl text-slate-800 tracking-tighter">std.tamanbelakang</span>
              <span className="font-display font-black text-2xl text-slate-800 tracking-widest italic">PT. Ryunacore</span>
              <span className="font-display font-bold text-2xl text-slate-800 tracking-tight">HijabStyle</span>
              <span className="font-display font-extrabold text-2xl text-slate-800">GADGET<span className="text-primary">LO</span></span>
              <span className="font-display font-bold text-2xl text-slate-800 tracking-wide border-2 border-current px-2 py-1">DISTRO.ID</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="font-bold text-lg text-slate-900">LinkinAja</span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2025 LinkinAja Indonesia. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a className="text-slate-400 hover:text-primary transition-all hover:scale-110" href="#">
                <Instagram className="w-5 h-5" />
              </a>
              <a className="text-slate-400 hover:text-primary transition-all hover:scale-110" href="#">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
