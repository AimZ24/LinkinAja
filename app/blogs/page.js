"use client";
import React from 'react';
import { Search, Calendar, ArrowRight, Bookmark, Mail, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

export default function BlogPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="bg-background-light light:bg-background-light text-slate-900 light:text-white font-sans antialiased transition-colors duration-300">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200 light:border-gray-800 bg-white/80 light:bg-background-light/80 glass-panel">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4 px-6 md:px-8">
          <a className="flex items-center space-x-3 rtl:space-x-reverse" href="/">
            <span className="self-center text-xl font-bold whitespace-nowrap light:text-white tracking-tight">LinkinAja</span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <a href="/login" className="text-slate-900 light:text-white bg-gray-100 hover:bg-gray-200 light:bg-gray-800 light:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 font-semibold rounded-full text-sm px-5 py-2.5 text-center me-2 hidden sm:block">
              Masuk
            </a>
            <a href="/daftar" className="text-white bg-primary hover:bg-primary-hover focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-full text-sm px-5 py-2.5 text-center shadow-lg shadow-green-500/30 transition-transform hover:scale-105">
              Buat Gratis
            </a>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 light:text-gray-400 light:hover:bg-gray-700 light:focus:ring-gray-600"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div className={`${isMenuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent light:bg-gray-800 md:light:bg-transparent light:border-gray-700">
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 light:text-white light:hover:text-primary light:hover:bg-gray-700 light:border-gray-700" href="/">Beranda</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 light:text-white light:hover:text-primary light:hover:bg-gray-700 light:border-gray-700" href="/fitur">Fitur</a>
              </li>
              <li>
                <a className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary md:p-0 light:text-white light:hover:text-primary light:hover:bg-gray-700 light:border-gray-700" href="/harga">Harga</a>
              </li>
              <li>
                <a aria-current="page" className="block py-2 px-3 text-white bg-primary rounded md:bg-transparent md:text-primary md:p-0" href="/blogs">Blog</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 overflow-hidden">
        <div className="blob bg-green-200 light:bg-green-900 w-96 h-96 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-green-100 light:bg-green-900/40 text-primary text-xs font-bold tracking-wider uppercase mb-4">Blog & Resources</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 light:text-white mb-6">
            Tips Sukses di <span className="text-gradient">Dunia Digital</span>
          </h1>
          <p className="text-lg text-slate-600 light:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Temukan inspirasi, tips jualan, strategi konten, dan update terbaru dari LinkinAja untuk mengembangkan bisnismu.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input 
                className="bg-white light:bg-slate-800 border border-gray-200 light:border-gray-700 text-gray-900 light:text-white text-sm rounded-full focus:ring-primary focus:border-primary block w-full pl-12 p-4 shadow-sm" 
                placeholder="Cari artikel, tutorial, atau tips..." 
                type="text"
              />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-md shadow-green-500/20">Semua</button>
            <button className="px-5 py-2 rounded-full bg-white light:bg-slate-800 text-slate-600 light:text-slate-300 border border-gray-200 light:border-gray-700 hover:border-green-400 light:hover:border-green-500 transition-colors text-sm font-medium">Tips Konten</button>
            <button className="px-5 py-2 rounded-full bg-white light:bg-slate-800 text-slate-600 light:text-slate-300 border border-gray-200 light:border-gray-700 hover:border-green-400 light:hover:border-green-500 transition-colors text-sm font-medium">Bisnis UMKM</button>
            <button className="px-5 py-2 rounded-full bg-white light:bg-slate-800 text-slate-600 light:text-slate-300 border border-gray-200 light:border-gray-700 hover:border-green-400 light:hover:border-green-500 transition-colors text-sm font-medium">Update Fitur</button>
            <button className="px-5 py-2 rounded-full bg-white light:bg-slate-800 text-slate-600 light:text-slate-300 border border-gray-200 light:border-gray-700 hover:border-green-400 light:hover:border-green-500 transition-colors text-sm font-medium">Success Story</button>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white light:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 light:border-gray-700 grid md:grid-cols-2 group hover:border-green-300 light:hover:border-green-700 transition-all duration-300">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img 
                alt="Meeting UMKM" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChvivpZWB3V5coDX0_wXEJD8oD1EHrMe4mn808wpSkOu8JYDQaMKUPYWxW7NckaBauZUix2TE2ENkQQ2asLOd8JZgNFBjrZQFVtT_hjD_irB7p_FI7qJAYu52ttcFPWnL7uBXlK4z9YiFQXUS94W178S0-FHEVZC0hgUQqWNQK62jQUPbay9vSzGmF5-vbJFnM5ev-N0nFWPlnFrl0UQmp9--sE-9in0M7sb7egkge5aUtK-LSwIVwt3wyG_AEwsELqCsyn0xBIpM"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 light:bg-black/70 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-800 light:text-white uppercase tracking-wider">Featured</span>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500 light:text-slate-400 mb-4">
                <span className="flex items-center gap-1"><Calendar size={16} /> 12 Okt 2023</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-primary font-medium">Bisnis UMKM</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 light:text-white mb-4 group-hover:text-primary transition-colors leading-tight">Cara Membangun Brand Lokal yang Kuat di Era Digital</h2>
              <p className="text-slate-600 light:text-slate-300 mb-8 leading-relaxed font-medium">Pelajari strategi jitu para founder brand lokal dalam memanfaatkan media sosial dan link-in-bio untuk meningkatkan awareness dan penjualan secara drastis.</p>
              <a className="inline-flex items-center font-bold text-primary hover:text-primary-hover transition-colors gap-2" href="#">
                Baca Selengkapnya
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 light:text-white">Artikel Terbaru</h3>
            <a className="text-sm font-semibold text-primary hover:underline" href="#">Lihat Semua</a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 */}
            <article className="bg-white light:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 light:border-gray-700 flex flex-col h-full group">
              <div className="relative h-56 overflow-hidden">
                <img alt="Content Creation" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_XIJGftuTL-0L-tVB2oXiM_IpI-FCDwG7MKbLU9ATlIBA_iBxauTKBA5UBFWYFkX3nVB7vTpg3RJsM9waML7TKGQZycC34qPzGqdLVKAQejwufmyDZPgNB1clb-wMath2_J4aHdC1uQJqA5tNtiFjvlzC7JT15YLh5fUVFC85--cy_970JfkpBk07uyVWGTV9BeVBURNb6vQj74OGWW-iOzWQ5udrjSsiy5nCoJFmWkst0miPTbNTLX36eDMojfhBwmN8Y4AHABo"/>
                <div className="absolute top-4 right-4 bg-white light:bg-slate-900 p-2 rounded-full shadow-md text-green-500">
                  <Bookmark size={20} />
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Tips Konten</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-slate-500 light:text-slate-400 mb-3 gap-2">
                  <span>5 menit baca</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>10 Okt 2023</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 light:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">5 Ide Konten TikTok yang Bikin Followers Auto Follow</h3>
                <p className="text-slate-600 light:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow font-medium">Kehabisan ide konten? Coba 5 format video TikTok ini yang terbukti meningkatkan engagement dan konversi followers baru.</p>
                <div className="pt-4 border-t border-gray-100 light:border-gray-700 mt-auto flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                    <img alt="Author" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=rina" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 light:text-slate-300">Rina Kreator</span>
                </div>
              </div>
            </article>

            {/* Article 2 */}
            <article className="bg-white light:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 light:border-gray-700 flex flex-col h-full group">
              <div className="relative h-56 overflow-hidden">
                <img alt="Digital Payment" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMesjTqs7Fna-lLQLZA8tP4GG2Doae9pw94RgQy2qb-56UWWv4vaBeQjGO0tJfApXjChXz6fUSxqsZ22AJ_S3Zkq4ek3Att-E1pCqT3nb0XQ2_tUxQB00BKRSFwGQ7f6BkL355rv7syGXS_2OB4BvwlS_nQUPLoXEJIVN-QN85THNWiACx7ouYxMGvd4WYw1XXVo-XbsUJLCiXULLNZcujiyUtXYXm0wwENfqCzUpknX3nzsmZQm0ujqkJJMKSNvWehom09_sG8mo"/>
                <div className="absolute top-4 right-4 bg-white light:bg-slate-900 p-2 rounded-full shadow-md text-green-500">
                  <Bookmark size={20} />
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-lime-100 text-lime-800 text-xs font-bold rounded-full">Update Fitur</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-slate-500 light:text-slate-400 mb-3 gap-2">
                  <span>3 menit baca</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>08 Okt 2023</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 light:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">Fitur Baru: Integrasi QRIS Langsung di Link Bio Kamu</h3>
                <p className="text-slate-600 light:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow font-medium">Kabar gembira untuk UMKM! Sekarang kamu bisa terima pembayaran via QRIS langsung dari halaman LinkinAja tanpa biaya tambahan.</p>
                <div className="pt-4 border-t border-gray-100 light:border-gray-700 mt-auto flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center p-1">
                    <img alt="Author" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF1ERZdQaE058Ac7zqhwUo7J_bGxk1jJbY0DcOjY0GeSf6xiXCLN8yo32yDfxwGjkGzqjW0ZaIN-MfarQ-7leQaOKUziFW-FgjYX1FWNTUrjbSVnUJkvdy8SNQa0QwI7YucaK5DIRID8AEDA4PeSk8dxWFoWn99nYgjfFozUkPjZSGnEIcd-m9XvKcKkrPctg_WbuYYMbnEUn4k_mjp5JEYykuh67kW8h0tc65u4WdrBhefm8oWQxERJLpCOsoDXqaFJxHiCGmtcE" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 light:text-slate-300">Tim LinkinAja</span>
                </div>
              </div>
            </article>

            {/* Article 3 */}
            <article className="bg-white light:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 light:border-gray-700 flex flex-col h-full group">
              <div className="relative h-56 overflow-hidden">
                <img alt="Success Story" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9QG39gvXbZVd5--G2t-pdlV1QcdPRDGnIABiWjmSgeLbkuUr93F1LYAW1DpcqAYcPiIRupyO6yv6xROHOq2IeJzgfnNnmHRMPd9M4Es_vcse-gZaycK9WhqnKVWI1vCgZ_Q8HaNwalvg24IQCtj_txUri1n19jyNluLniG62FI__bhRhN04mupuieOFouMEIeXIpvdLap7YXVyw-M-JCYSJqibscfsJ5niEVo4bP9EZTnj-tckv5AE7BLs67kSMiU44cxdHOF75U"/>
                <div className="absolute top-4 right-4 bg-white light:bg-slate-900 p-2 rounded-full shadow-md text-green-500">
                  <Bookmark size={20} />
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">Success Story</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-slate-500 light:text-slate-400 mb-3 gap-2">
                  <span>8 menit baca</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>05 Okt 2023</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 light:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">Dari Hobi Masak Jadi Omzet Jutaan via Instagram</h3>
                <p className="text-slate-600 light:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow font-medium">Simak perjalanan inspiratif Dapur Mama Ina yang memulai bisnis katering rumahan dan sukses besar berkat optimalisasi link bio.</p>
                <div className="pt-4 border-t border-gray-100 light:border-gray-700 mt-auto flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                    <img alt="Author" className="w-full h-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=budi" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 light:text-slate-300">Budi Jurnalis</span>
                </div>
              </div>
            </article>
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 light:border-gray-700 text-gray-500 hover:bg-green-50 hover:text-green-600 light:hover:bg-slate-700 light:hover:text-white transition-colors disabled:opacity-50" disabled>
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-lg shadow-green-500/30">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 light:border-gray-700 text-gray-600 light:text-gray-400 hover:bg-green-50 hover:text-green-600 light:hover:bg-slate-700 light:hover:text-white transition-colors">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 light:border-gray-700 text-gray-600 light:text-gray-400 hover:bg-green-50 hover:text-green-600 light:hover:bg-slate-700 light:hover:text-white transition-colors">3</button>
              <span className="text-gray-400 px-1">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 light:border-gray-700 text-gray-600 light:text-gray-400 hover:bg-green-50 hover:text-green-600 light:hover:bg-slate-700 light:hover:text-white transition-colors">8</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 light:border-gray-700 text-gray-600 light:text-gray-400 hover:bg-green-50 hover:text-green-600 light:hover:bg-slate-700 light:hover:text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-surface-light light:bg-surface-light/50 border-t border-gray-100 light:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-green-500 to-lime-500 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-300 opacity-20 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
            <div className="relative z-10">
              <div className="size-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                <Mail size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Jangan Ketinggalan Tips Cuan!</h2>
              <p className="text-green-50 text-lg mb-8 max-w-lg mx-auto font-medium">Dapatkan update artikel terbaru seputar strategi digital marketing dan fitur LinkinAja langsung di inbox kamu.</p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  className="flex-grow px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-white/50 placeholder-slate-400 shadow-lg font-medium text-white fond-bold" 
                  placeholder="Masukkan email kamu" 
                  type="email"
                />
                <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg" type="button">Langganan</button>
              </form>
              <p className="text-green-100 text-xs mt-4">Kami tidak akan mengirim spam. Unsubscribe kapan saja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white light:bg-background-light border-t border-gray-200 light:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              
              <span className="font-bold text-lg text-slate-900 light:text-white">LinkinAja</span>
            </div>
            <div className="text-slate-500 light:text-slate-500 text-sm font-medium">
              © 2025 LinkinAja Indonesia. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a className="text-slate-400 hover:text-primary transition-colors font-bold text-sm" href="#">Instagram</a>
              <a className="text-slate-400 hover:text-primary transition-colors font-bold text-sm" href="#">TikTok</a>
              <a className="text-slate-400 hover:text-primary transition-colors font-bold text-sm" href="#">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
