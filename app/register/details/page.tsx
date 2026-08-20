'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowLeft, Check, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { register, storeSession } from '@/services/home';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  
  // Validation states
  const [hasUpperLower, setHasUpperLower] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLength, setHasLength] = useState(false);
  
  // Toggle states
  const [notifySchedules, setNotifySchedules] = useState(true);
  const [notifyOffers, setNotifyOffers] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('email')) {
      setEmail(params.get('email') || '');
    }
  }, []);

  useEffect(() => {
    setHasUpperLower(/[a-z]/.test(password) && /[A-Z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setHasLength(password.length >= 8);
  }, [password]);

  const isValid = hasUpperLower && hasNumber && hasLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setIsLoading(true);

    try {
      const session = await register({
        name: [firstName, lastName].filter(Boolean).join(' '),
        email,
        password,
        password_confirmation: password,
      });
      storeSession(session);
      window.location.href = '/subscribe';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B12] text-white flex flex-col relative font-sans">
      {/* Top Bar matching DAZN */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10 bg-[#050B12]">
        <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </Link>
        <span className="text-[14px] md:text-sm font-bold tracking-wide">Finish signing up</span>
        <Link href="/" className="flex items-center text-lg font-black uppercase tracking-tighter">
          <span className="bg-white text-black py-0.5 px-1.5 leading-none mr-1 rounded-sm">NARA</span>
          <span className="text-white leading-none">TV</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 w-full max-w-[480px] mx-auto z-10 pb-12 pt-24 md:pt-[100px]">
        <div className="w-full">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div>
              <label className="block text-sm font-bold text-white mb-3">Your name</label>
              <div className="flex flex-col gap-[1px] bg-[#172338] border border-[#172338] rounded-[4px] overflow-hidden">
                <input 
                  type="text" 
                  placeholder="First name" 
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full bg-[#050B12] px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:bg-[#111D2E] transition-all text-sm"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Last name" 
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full bg-[#050B12] px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:bg-[#111D2E] transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-3">Email address</label>
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-[#172338] rounded-[4px] px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all text-sm"
                required
              />
              <p className="text-[#848485] text-[13px] mt-2 tracking-wide">Remember this email! You&apos;ll need it to sign in.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-3">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter new password" 
                  className="w-full bg-transparent border border-[#172338] rounded-[4px] px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="mt-6 flex flex-col gap-3">
                <h4 className="text-[13px] font-bold text-white mb-1">Your password must contain</h4>
                <div className={`flex items-center gap-3 text-[13px] ${hasUpperLower ? 'text-[#848485]' : 'text-[#848485]'}`}>
                  {hasUpperLower ? <Check className="w-4 h-4 text-[#55f599]" /> : <X className="w-4 h-4 text-[#848485]" />} 
                  Upper and lower case letters
                </div>
                <div className={`flex items-center gap-3 text-[13px] ${hasNumber ? 'text-[#848485]' : 'text-[#848485]'}`}>
                  {hasNumber ? <Check className="w-4 h-4 text-[#55f599]" /> : <X className="w-4 h-4 text-[#848485]" />} 
                  At least one number
                </div>
                <div className={`flex items-center gap-3 text-[13px] ${hasLength ? 'text-[#848485]' : 'text-[#848485]'}`}>
                  {hasLength ? <Check className="w-4 h-4 text-[#55f599]" /> : <X className="w-4 h-4 text-[#848485]" />} 
                  At least 8 characters
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-[4px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            )}

            <div className="mt-2">
              <label className="block text-[15px] font-bold text-white mb-4">Get notified</label>
              <div className="flex flex-col gap-[1px] bg-[#172338] rounded-[4px] overflow-hidden border border-[#172338]">
                <div className="bg-[#050B12] p-4 py-5 flex justify-between items-center gap-4">
                  <span className="text-[13px] text-[#d1d1d1] pr-4">Keep me updated on all sports schedules, game and news.</span>
                  <div 
                    onClick={() => setNotifySchedules(!notifySchedules)}
                    className={`w-11 h-[22px] rounded-full relative flex-shrink-0 cursor-pointer transition-colors duration-200 ${notifySchedules ? 'bg-[#8ceda7]' : 'bg-[#22314B]'}`}
                  >
                    <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[2px] transition-all duration-200 ${notifySchedules ? 'right-[2px]' : 'left-[2px]'}`}></div>
                  </div>
                </div>
                <div className="bg-[#050B12] p-4 py-5 flex justify-between items-center gap-4">
                  <span className="text-[13px] text-[#d1d1d1] pr-4">Keep me updated on exclusive offers and special features.</span>
                  <div 
                    onClick={() => setNotifyOffers(!notifyOffers)}
                    className={`w-11 h-[22px] rounded-full relative flex-shrink-0 cursor-pointer transition-colors duration-200 ${notifyOffers ? 'bg-[#8ceda7]' : 'bg-[#22314B]'}`}
                  >
                    <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[2px] transition-all duration-200 ${notifyOffers ? 'right-[2px]' : 'left-[2px]'}`}></div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#848485] mt-3 mb-6">You can adjust these settings later in My account.</p>
            </div>
            
            <button 
              type="submit" 
              className={`w-full font-bold py-[15px] rounded-[4px] transition-colors mt-4 flex items-center justify-center gap-2 text-sm ${isValid ? 'bg-[#6F88FC] text-black hover:bg-[#45E3FF]' : 'bg-[#22314B] text-[#848485] pointer-events-none'}`}
              disabled={!isValid || isLoading}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Continue
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
