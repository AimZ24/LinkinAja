"use client";
import { useState } from 'react';
import { 
  Palette, 
  Check, 
  Sliders, 
  Plus, 
  Link as LinkIcon, 
  ImagePlus, 
  ArrowUp, 
  TrendingUp, 
  Store, 
  ShoppingBag, 
  MessageCircle, 
  QrCode, 
  CalendarRange, 
  Lock, 
  HeartHandshake, 
  Search, 
  Rocket,
  Instagram,
  Twitter,
  Menu,
  X
} from 'lucide-react';

export default function FiturPage() {
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
                <a aria-current="page" className="block py-2 px-3 text-white bg-primary rounded md:bg-transparent md:text-primary md:p-0" href="/fitur">Fitur</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0" href="/harga">Harga</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0" href="/blogs">Blog</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="blob bg-green-200 w-96 h-96 rounded-full top-0 left-0 -translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
        <div className="blob bg-lime-200 w-[600px] h-[600px] rounded-full bottom-0 right-0 translate-x-1/4 translate-y-1/4 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-primary text-sm font-semibold mb-6 border border-green-200 shadow-sm">
            ✨ Lebih dari sekadar link
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Fitur Lengkap untuk <br className="hidden md:block" />
            <span className="text-gradient">Kembangkan Potensimu</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            LinkinAja dirancang untuk Kreator, UMKM, dan siapa saja yang ingin tampil profesional di dunia digital. Satu platform, sejuta kemungkinan.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Palette className="w-7 h-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Kustomisasi Tanpa Batas
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Tunjukkan kepribadian brand kamu. Ubah warna, font, background, dan tata letak tombol semudah drag-and-drop. Tidak perlu keahlian desain atau coding.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="text-slate-700">Ratusan tema siap pakai</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="text-slate-700">Upload background gambar atau video</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="text-slate-700">Pilihan font premium gratis</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-lime-100 rounded-[3rem] -rotate-3 transform scale-95 opacity-70"></div>
              <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 w-full max-w-md animate-float">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</span>
                    <Sliders className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    <div className="w-12 h-12 rounded-full bg-black cursor-pointer ring-2 ring-offset-2 ring-primary"></div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary cursor-pointer">
                      <Plus className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 items-center mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-8 h-5 bg-green-500 rounded-full flex items-center p-0.5">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
                <div className="flex gap-4 items-center p-3 bg-white rounded-xl border border-dashed border-gray-300 opacity-75">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <ImagePlus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-20 bg-gray-100 rounded mb-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative flex justify-center">
              <div className="absolute w-full h-full bg-lime-100/50 rounded-full blur-3xl transform -translate-y-6"></div>
              <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 animate-float-delayed">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Kunjungan</p>
                    <h3 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                      24.5k
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <ArrowUp className="w-2.5 h-2.5" /> 12%
                      </span>
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 text-xs">7H</span>
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 text-white text-xs font-bold shadow-lg shadow-green-500/30">30H</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-40 gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg h-[40%] hover:bg-green-200 transition-colors relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">400</div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-t-lg h-[65%] hover:bg-green-200 transition-colors"></div>
                  <div className="w-full bg-gray-100 rounded-t-lg h-[50%] hover:bg-green-200 transition-colors"></div>
                  <div className="w-full bg-primary rounded-t-lg h-[85%] shadow-lg shadow-green-500/20 relative">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-t-lg h-[60%] hover:bg-green-200 transition-colors"></div>
                  <div className="w-full bg-gray-100 rounded-t-lg h-[75%] hover:bg-green-200 transition-colors"></div>
                  <div className="w-full bg-gray-100 rounded-t-lg h-[45%] hover:bg-green-200 transition-colors"></div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Instagram
                    </span>
                    <span className="font-bold text-slate-900">65%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-3">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-black"></span> TikTok
                    </span>
                    <span className="font-bold text-slate-900">25%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 bg-lime-100 rounded-2xl flex items-center justify-center mb-6 text-lime-600">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Data Pintar untuk Keputusan Tepat
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Jangan menebak-nebak. Pahami audiensmu dengan data analitik yang lengkap dan mudah dipahami. Ketahui dari mana mereka berasal dan link apa yang paling mereka suka.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Real-time Data</h4>
                  <p className="text-sm text-slate-500">Data diperbarui setiap detik saat pengunjung datang.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Geolokasi</h4>
                  <p className="text-sm text-slate-500">Lihat persebaran kota dan negara audiensmu.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Click-through Rate</h4>
                  <p className="text-sm text-slate-500">Ukur efektivitas CTA tombol kamu.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Device Type</h4>
                  <p className="text-sm text-slate-500">Ketahui perangkat yang digunakan pengunjung.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
                <Store className="w-7 h-7" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Jualan Online Makin Praktis
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Solusi sempurna untuk UMKM dan Seller. Tampilkan katalog produk, terima pembayaran digital (QRIS, E-Wallet), atau arahkan langsung ke WhatsApp Admin tanpa ribet.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-gray-100">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Katalog Mini</h4>
                    <p className="text-sm text-slate-500 mt-1">Upload foto produk, deskripsi, dan harga. Pelanggan bisa lihat langsung.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-gray-100">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">WhatsApp Generator</h4>
                    <p className="text-sm text-slate-500 mt-1">Link otomatis membuka chat WA dengan pesan template yang sudah kamu atur.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="relative w-64 bg-white rounded-3xl shadow-2xl border-4 border-slate-900 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="h-6 bg-slate-900 w-full flex justify-center items-center">
                  <div className="w-16 h-3 bg-black rounded-b-lg"></div>
                </div>
                <div className="p-4 space-y-4 bg-gray-50 h-96 overflow-hidden relative">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto border-2 border-white mb-2 overflow-hidden">
                    </div>
                    <div className="h-3 w-24 bg-gray-200 rounded mx-auto"></div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0">
                    </div>
                    <div className="flex-1">
                      <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-10 bg-green-100 rounded"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-12 bg-green-100 rounded"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900 text-white py-3 rounded-xl text-center text-xs font-bold shadow-lg">
                    Checkout Sekarang
                  </div>
                </div>
              </div>
              <div className="absolute top-10 -right-4 bg-white py-2 px-4 rounded-lg shadow-lg rotate-12 animate-pulse-slow">
                <span className="font-bold text-green-600">Rp 45.000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Dan Masih Banyak Lagi</h2>
            <p className="text-slate-600">Semua tools yang kamu butuhkan dalam satu dashboard yang simpel.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">QR Code Instan</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Download QR code profilmu untuk dicetak di stiker, kartu nama, atau kemasan produk.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <CalendarRange className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Penjadwalan Link</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Atur kapan link muncul dan hilang secara otomatis. Cocok untuk promo terbatas.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Konten Sensitif</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Fitur gate untuk konten dewasa atau eksklusif dengan peringatan umur atau password.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dukungan & Tip</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Terima dukungan dana dari followers langsung di halaman profilmu.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">SEO Friendly</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Profilmu mudah ditemukan di Google, meningkatkan visibilitas brand.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fast Loading</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Server lokal Indonesia menjamin akses super cepat bagi pengunjungmu.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
            Mulai Cerita Suksesmu dengan <span className="text-primary">LinkinAja</span>
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Bergabung dengan 50.000+ kreator dan pebisnis lokal yang telah memaksimalkan potensi online mereka. Gratis selamanya!
          </p>
          <button className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-green-500/40 transition-all hover:scale-105 hover:shadow-green-500/50 text-lg">
            Buat Link Sekarang
          </button>
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-green-100/50 rounded-full blur-3xl -z-[1]"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-lime-100/50 rounded-full blur-3xl -z-[1]"></div>
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
