"use client";
import React, { useState } from 'react';
import { Apple, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      // Successful login
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background-light light:bg-background-light font-display">
      {/* Left Panel - Hero (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#131811] flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between w-full max-w-[600px]">
          <div className="flex items-center gap-2 text-white mb-12">
            <div className="size-8 text-primary">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">LinkinAja</h2>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              Satu link untuk <br />
              <span className="text-primary">semuanya.</span>
            </h1>
            
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBY8YKxdtzFjGnDkKqdmNones2YorPjlvGM9gssFwI_uGLhbArcE0HCipwZ34H1h6jYGzhjJuA3EjiqcxjJB_YNhz15AdRQG545ZvwY6BMbtBlf8OU9M0KRdml4KQQnJBsmoP9sblBWQz6kwAShb6IlEn9uN-ymmXhmjnX8nTVzLXQn2-DYhcDUgYvmQnLDF00D7VNRbk4mSAdliUxiLs0gB9xHHNreCfnwLsY2c1xzKmxG2ODi5yv8FPIoVMCkYHEFuWmgm_HRuIY')" }}
              ></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Analitik Langsung</span>
                </div>
                <div className="text-white text-lg font-bold">12.405 Klik</div>
                <div className="text-white/60 text-sm">Naik +24% minggu ini</div>
              </div>
            </div>
            
            <p className="text-white/60 text-lg">Bergabung dengan 2Jt+ kreator, penjual, dan bisnis yang menggunakan LinkinAja untuk berkarya.</p>
          </div>

          <div className="flex gap-4 mt-auto pt-12">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 flex-col justify-center items-center p-6 lg:p-24 bg-white light:bg-background-light min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden w-full flex justify-between items-center mb-10">
          <div className="flex items-center gap-2 text-[#131811] light:text-white">
            <div className="size-6 text-primary">
              <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">LinkinAja</h2>
          </div>
        </div>

        <div className="w-full max-w-[440px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-[#131811] light:text-white text-3xl font-black leading-tight tracking-[-0.02em]">Selamat datang kembali!</h2>
            <p className="text-[#6e8a60] light:text-[#a0b396] text-base font-normal">Kelola tautan dan kembangkan audiens Anda.</p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-[#dfe6db] bg-white hover:bg-gray-50 transition-colors text-[#131811] font-semibold text-sm">
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Yx5O_wPoYZz_zMw3DxT9V4W-_963M7hQ5qiRX0K46WS4UUGfVUu-E3XETHhf4oFn4syWCf-YB1V8hfF_KjchAovZdObHzYjcakXGDCPPHlDpTIOlwrpLWTLY_77jKYUcbp0UN5yHibpOwXrARlf6SJgWrhDxyWQDRTYnhc0MNV625zByC0Xl9hFznETzEXrBdbqQda3Qd4YBNV1w97fiVtxd4eNN3Yri_e8JkapfrFqpeuyHuHOdao4wu93_DXzdFpUZHeo11EA" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-[#dfe6db] bg-white hover:bg-gray-50 transition-colors text-[#131811] font-semibold text-sm">
              <Apple className="w-5 h-5" />
              Apple
            </button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[#dfe6db]"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">atau masuk dengan email</span>
            <div className="flex-grow border-t border-[#dfe6db]"></div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
            
            <label className="flex flex-col gap-2">
              <span className="text-[#131811] light:text-white text-sm font-semibold">Email atau Username</span>
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#dfe6db] bg-white light:bg-white/5 light:border-white/10 light:text-white h-12 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-[#9ca3af]" 
                placeholder="nama@contoh.com" 
                type="text" 
              />
            </label>
            
            <label className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[#131811] light:text-white text-sm font-semibold">Kata Sandi</span>
                <a className="text-sm font-semibold text-[#131811] light:text-white hover:text-primary transition-colors hover:underline" href="#">Lupa?</a>
              </div>
              <div className="relative flex items-center">
                <input 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#dfe6db] bg-white light:bg-white/5 light:border-white/10 light:text-white h-12 pl-4 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-[#9ca3af]" 
                  placeholder="********" 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#9ca3af] hover:text-[#131811] light:hover:text-white transition-colors" 
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            <button 
              className="mt-2 w-full h-12 rounded-lg bg-primary hover:bg-[#4ce00b] text-[#131811] text-base font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-[#6e8a60]">
            Belum punya akun? {" "}
            <Link href="/daftar" className="font-bold text-[#131811] light:text-white hover:text-primary hover:underline transition-colors">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
