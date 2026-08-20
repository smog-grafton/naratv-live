'use client';

import React, { useState } from 'react';
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { login, storeSession } from '@/services/home';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const session = await login(loginValue, password);
      storeSession(session);
      const next = new URLSearchParams(window.location.search).get('next') || '/';
      window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B12] text-white flex flex-col relative font-sans">
      {/* Top Bar matching DAZN */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </Link>
        <Link href="/" className="flex items-center text-xl font-black uppercase tracking-tighter">
          <span className="bg-nara-red text-white py-1 px-2 leading-none mr-1.5 rounded-sm">NARA</span>
          <span className="text-white leading-none">TV</span>
        </Link>
        <div className="w-6 hidden md:block"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 w-full max-w-[440px] mx-auto z-10 pt-20 pb-12">
        <div className="w-full">
          <h1 className="text-2xl md:text-[28px] font-bold text-center mb-2 tracking-tight">Log in or sign up</h1>
          <p className="text-gray-400 text-sm md:text-base text-center mb-8 max-w-[320px] mx-auto">
            Get access to live fights, highlights, shows, and much more.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Email address or phone number" 
                value={loginValue}
                onChange={(event) => setLoginValue(event.target.value)}
                className="w-full bg-transparent border border-[#172338] rounded-[4px] px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all text-sm"
                required
              />
            </div>
            
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent border border-[#172338] rounded-[4px] px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all text-sm"
                required
              />
            </div>

            {error && (
              <p className="rounded-[4px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#6F88FC] text-black font-bold py-3.5 rounded-[4px] hover:bg-[#45E3FF] transition-colors mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin text-black" />} Continue
            </button>
          </form>

          <div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"><span className="h-px flex-1 bg-white/10" /> <span>or</span> <span className="h-px flex-1 bg-white/10" /></div>
          <GoogleAuthButton />

          <div className="text-center mb-6">
            <Link href="/forgot-password" className="mb-4 block text-sm text-gray-400 hover:text-white hover:underline">
              Forgot your password?
            </Link>
            <Link href="/register" className="text-sm font-bold text-white hover:underline">
              New to NARA TV? Sign up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
