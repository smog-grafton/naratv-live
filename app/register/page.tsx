'use client';

import React, { useState } from 'react';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function RegisterInitialPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `/register/details?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#050B12] text-white flex flex-col relative font-sans">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10 bg-[#050B12]">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </Link>
        <span className="text-[14px] md:text-sm font-bold tracking-wide">Sign up</span>
        <Link href="/" className="flex items-center text-lg font-black uppercase tracking-tighter">
          <span className="bg-white text-black py-0.5 px-1.5 leading-none mr-1 rounded-sm">NARA</span>
          <span className="text-white leading-none">TV</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-[400px] mx-auto z-10 pt-20">
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-gray-400 mb-8 text-sm">Enter your email to get started.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-[#172338] rounded-[4px] px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all text-sm"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`w-full font-bold py-3.5 rounded-[4px] transition-colors flex items-center justify-center gap-2 text-sm ${email ? 'bg-[#6F88FC] text-black hover:bg-[#45E3FF]' : 'bg-[#22314B] text-[#848485] pointer-events-none'}`}
              disabled={!email}
            >
              Continue with Email
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"><span className="h-px flex-1 bg-white/10" /> <span>or</span> <span className="h-px flex-1 bg-white/10" /></div>
          <GoogleAuthButton />


          <div className="text-center mt-8">
            <Link href="/login" className="text-sm font-bold text-white hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
