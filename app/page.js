"use client";
import { useState } from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Store, 
  ChevronRight, 
  Globe, 
  Mail, 
  Palette, 
  BarChart3, 
  Coins,
  Instagram,
  Twitter,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
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
                <a aria-current="page" className="block py-2 px-3 text-white bg-primary rounded md:bg-transparent md:text-primary md:p-0" href="#">Beranda</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 light:text-white light:hover:text-primary light:hover:bg-gray-700 light:border-gray-700" href="/fitur">Fitur</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 light:text-white light:hover:text-primary light:hover:bg-gray-700 light:border-gray-700" href="/harga">Harga</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 light:text-white light:hover:text-primary light:hover:bg-gray-700 light:border-gray-700" href="/blogs">Blog</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="blob bg-green-200 light:bg-green-900 w-96 h-96 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="blob bg-lime-200 light:bg-lime-900 w-[500px] h-[500px] rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 light:bg-green-900/30 text-primary text-sm font-semibold mb-6 border border-green-200 light:border-green-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                100% Karya Anak Bangsa Indonesia
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 light:text-white mb-6 leading-[1.1]">
                Semua Link,<br />
                <span className="text-gradient">LinkinAja</span>
              </h1>
              <p className="text-lg text-slate-600 light:text-slate-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Satu link simpel untuk semua kebutuhanmu. Cocok untuk jualan di Instagram, profil TikTok, portofolio kreator, atau kontak bisnis UMKM kamu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center bg-white light:bg-surface-light border border-gray-200 light:border-gray-700 rounded-full px-4 py-2 shadow-sm w-full sm:w-auto">
                  <span className="text-gray-400 light:text-gray-500 font-medium mr-1">linkinaja.id/</span>
                  <input className="bg-transparent border-none p-0 text-slate-900 light:text-white focus:ring-0 w-24 placeholder-gray-300 light:placeholder-gray-600 font-semibold" placeholder="namakamu" type="text" />
                </div>
                <button className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-green-500/40 transition-all hover:scale-105 hover:shadow-green-500/50 w-full sm:w-auto">
                  Buat Link Sekarang
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 light:text-slate-400">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white light:border-slate-800 flex items-center justify-center overflow-hidden">
                    <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8oLNM_TtkQ_oQ3abeWs9ON-bQgeT46wSn-sA596K7MYlzsTopUXhdZ7h6Epdl0Nm-ZMYRzKl2SDEvw7GELIm9kVHPnkv9TGBrOb_HQ6zOVnVHlZ8vCbwt_zPi8r79JgKpz3Ror_ri5D_fDbAHpBfTPCpmyHoZmJGRjT5XTiSs_2i06Z8oB8S5euv03Yw9Sue-dBRie8lr7LCPxHv4vcvf6R1TrP7WnI5TBQmqo9pcqtb4GbERlsM01s3ha5hTnWyP6_Z7r49bQ6o" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white light:border-slate-800 flex items-center justify-center overflow-hidden">
                    <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmq1FQUh3uFzI6e1RJolFFjmViOUoD2sDJxPyl3BGN9h8HAFXAOyVzZ6V9tKobeCZ-z6LCCRSa7Ep5ic-_GFWrfyflhRIKAIX397IoNxQdcdpNpQ_fhqRQ_xYiF_3qd8_QdSJ4IlynGn5eZxUuaG3hLggQhVc0-Q16qyIdyKdnAYO6R_3YuWMyOSADeM2tvWCGg_VRZ5v2m2aq4Rid9SR68cZucuANsNQ6uJbvlmi5dvT38yVwAGP4rbHIweDyBKZugZVRTIS4rcI" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white light:border-slate-800 flex items-center justify-center overflow-hidden">
                    <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQo8gFRjfkM8F52bt0Mc_g76B8ja6eCgiDr4KBE_yHdInebmyrYwXUjuB3_bhFqshsXfuWP8yUe6gq4SARxcTFYcxG8aENLuVSJK3on_UCw2zOfcJuVSnfHgkv8knkTtxJHxpZvWhNcXXx5XFdUQkqrkGZ-8fk7lhEqhki8xj5HW8KaOlHlgIVhksCwfa3YxpGicDcPPosdIBBlt_ddXgv3xwH5tMPzMFEtvOjJBVkKy5pJigS7flAdhNSs2SvEaI9IgSBcqZHBhQ" />
                  </div>
                </div>
                <p>Telah digunakan 50.000+ Kreator</p>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[600px] bg-gradient-to-tr from-green-400 to-lime-300 rounded-[3rem] rotate-6 blur-2xl opacity-40 animate-pulse"></div>
              <div className="relative w-[300px] h-[620px] bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden animate-float">
                <div className="absolute top-0 inset-x-0 h-7 bg-slate-900 z-20 flex justify-center rounded-b-2xl">
                  <div className="w-20 h-5 bg-black rounded-b-xl"></div>
                </div>
                <div className="w-full h-full bg-white light:bg-slate-900 overflow-y-auto no-scrollbar relative">
                  <div className="h-32 bg-gradient-to-br from-green-100 to-lime-100 light:from-green-900 light:to-slate-800 relative">
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                      <div className="w-24 h-24 rounded-full border-4 border-white light:border-slate-900 overflow-hidden bg-white shadow-md">
                        <img alt="Profile Chameleon" className="w-full h-full object-cover p-1" src="/img/logo.png" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-12 px-6 text-center pb-6">
                    <h3 className="font-bold text-xl text-slate-800 light:text-white">Si Paling Ijo</h3>
                    <p className="text-sm text-slate-500 light:text-slate-400 mt-1">@linkinaja_official</p>
                    <p className="text-xs text-slate-600 light:text-slate-300 mt-3 px-2">
                      Solusi link bio untuk UMKM & Kreator Indonesia. Klik link di bawah 👇
                    </p>
                  </div>
                  <div className="px-5 space-y-3 pb-8">
                    <a className="block w-full p-3 bg-white light:bg-slate-800 border-2 border-gray-100 light:border-slate-700 hover:border-green-400 light:hover:border-green-500 hover:shadow-md rounded-2xl transition-all group flex items-center justify-between" href="#">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 light:bg-slate-700 flex items-center justify-center text-green-600 light:text-green-400">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm text-slate-700 light:text-slate-200">Katalog Produk Terbaru</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-500" />
                    </a>
                    <a className="block w-full p-3 bg-white light:bg-slate-800 border-2 border-gray-100 light:border-slate-700 hover:border-green-400 light:hover:border-green-500 hover:shadow-md rounded-2xl transition-all group flex items-center justify-between" href="#">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 light:bg-slate-700 flex items-center justify-center text-green-600 light:text-green-400">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm text-slate-700 light:text-slate-200">Chat WhatsApp Admin</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-500" />
                    </a>
                    <a className="block w-full p-3 bg-white light:bg-slate-800 border-2 border-gray-100 light:border-slate-700 hover:border-green-400 light:hover:border-green-500 hover:shadow-md rounded-2xl transition-all group flex items-center justify-between" href="#">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 light:bg-slate-700 flex items-center justify-center text-green-600 light:text-green-400">
                          <Store className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm text-slate-700 light:text-slate-200">Toko Oren (Shopee)</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-500" />
                    </a>
                    <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100 light:border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-slate-100 light:bg-slate-800 flex items-center justify-center text-slate-600 light:text-slate-400 hover:bg-green-100 hover:text-green-600 transition-colors cursor-pointer">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 light:bg-slate-800 flex items-center justify-center text-slate-600 light:text-slate-400 hover:bg-green-100 hover:text-green-600 transition-colors cursor-pointer">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 light:bg-slate-800 flex items-center justify-center text-slate-600 light:text-slate-400 hover:bg-green-100 hover:text-green-600 transition-colors cursor-pointer">
                        <Mail className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-light light:bg-surface-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 light:text-white mb-4">Kenapa LinkinAja?</h2>
            <p className="text-slate-600 light:text-slate-400 max-w-2xl mx-auto">Platform karya lokal yang mengerti kebutuhan digital Gen-Z dan UMKM Indonesia.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white light:bg-background-light p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 light:border-gray-800">
              <div className="w-14 h-14 bg-green-100 light:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 text-green-600 light:text-green-400">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 light:text-white mb-3">Tampilan Estetik</h3>
              <p className="text-slate-600 light:text-slate-400 leading-relaxed">
                Desain profilmu sesuka hati. Banyak pilihan tema warna, font, dan layout yang kekinian dan tidak kaku.
              </p>
            </div>
            <div className="bg-white light:bg-background-light p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 light:border-gray-800">
              <div className="w-14 h-14 bg-lime-100 light:bg-lime-900/30 rounded-2xl flex items-center justify-center mb-6 text-lime-600 light:text-lime-400">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 light:text-white mb-3">Analisis Lengkap</h3>
              <p className="text-slate-600 light:text-slate-400 leading-relaxed">
                Pantau siapa yang klik link kamu. Data real-time untuk bantu kamu optimalkan penjualan dan traffic.
              </p>
            </div>
            <div className="bg-white light:bg-background-light p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 light:border-gray-800">
              <div className="w-14 h-14 bg-teal-100 light:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6 text-teal-600 light:text-teal-400">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 light:text-white mb-3">Terintegrasi E-Wallet</h3>
              <p className="text-slate-600 light:text-slate-400 leading-relaxed">
                Terima saweran atau pembayaran langsung via QRIS, GoPay, dan OVO tanpa ribet pindah aplikasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white light:bg-background-light border-t border-gray-200 light:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="font-bold text-lg text-slate-900 light:text-white">LinkinAja</span>
            </div>
            <div className="text-slate-500 light:text-slate-500 text-sm">
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
