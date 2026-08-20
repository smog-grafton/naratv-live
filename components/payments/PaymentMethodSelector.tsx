'use client';

import React, { useState } from 'react';
import { CreditCard, Smartphone, Check, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface PaymentMethodSelectorProps {
  amount: number;
  planName: string;
}

export default function PaymentMethodSelector({ amount, planName }: PaymentMethodSelectorProps) {
  const [method, setMethod] = useState<'mobile_money' | 'card' | 'paypal'>('mobile_money');
  
  // Mobile Money State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState<'mtn' | 'airtel'>('mtn');
  const [momoStatus, setMomoStatus] = useState<'idle' | 'processing' | 'waiting_prompt' | 'success' | 'failed'>('idle');

  const handleMobileMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setMomoStatus('processing');
    
    // Simulate API call to initiate push prompt
    setTimeout(() => {
      setMomoStatus('waiting_prompt');
      
      // Simulate user accepting prompt
      setTimeout(() => {
        setMomoStatus('success');
        // Redirect to success page normally
      }, 4000);
    }, 1500);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Flutterwave redirect
    setMomoStatus('processing');
    setTimeout(() => {
       alert("Redirecting to Flutterwave secure checkout...");
       setMomoStatus('idle');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Method Tabs */}
      <div className="flex gap-2 p-1 bg-[#172338] rounded-md">
        <button 
          onClick={() => { setMethod('mobile_money'); setMomoStatus('idle'); }}
          className={`flex-1 py-2.5 px-3 rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors ${method === 'mobile_money' ? 'bg-[#050B12] shadow-sm text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Smartphone className="w-4 h-4" /> Mobile Money
        </button>
        <button 
          onClick={() => { setMethod('card'); setMomoStatus('idle'); }}
          className={`flex-1 py-2.5 px-3 rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors ${method === 'card' ? 'bg-[#050B12] shadow-sm text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <CreditCard className="w-4 h-4" /> Card
        </button>
        <button 
          onClick={() => { setMethod('paypal'); setMomoStatus('idle'); }}
          className={`flex-1 py-2.5 px-3 rounded text-sm font-bold flex items-center justify-center gap-2 transition-colors ${method === 'paypal' ? 'bg-[#050B12] shadow-sm text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.815 1.01 1.15 1.304 2.815.87 4.714-.652 2.834-2.483 4.909-5.187 5.867-1.12.396-2.427.531-3.92.531H8.761L7.076 21.337z"/></svg> 
          PayPal
        </button>
      </div>

      {method === 'mobile_money' && (
        <div className="animate-in fade-in flex flex-col gap-6 w-full">
          {momoStatus === 'idle' && (
            <form onSubmit={handleMobileMoneySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-white">Select Network</label>
                <div className="flex gap-4">
                  <div 
                    onClick={() => setNetwork('mtn')}
                    className={`flex-1 border-2 rounded-md p-4 flex items-center justify-center cursor-pointer transition-colors ${network === 'mtn' ? 'border-[#ffcc00] bg-[#ffcc00]/5' : 'border-[#172338] hover:border-gray-500'}`}
                  >
                    <span className="font-bold text-[#ffcc00] drop-shadow-sm">MTN MOMO</span>
                  </div>
                  <div 
                    onClick={() => setNetwork('airtel')}
                    className={`flex-1 border-2 rounded-md p-4 flex items-center justify-center cursor-pointer transition-colors ${network === 'airtel' ? 'border-[#ff0000] bg-[#ff0000]/5' : 'border-[#172338] hover:border-gray-500'}`}
                  >
                    <span className="font-bold text-[#ff0000]">Airtel Money</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2 text-white">Phone Number</label>
                <div className="flex bg-[#050B12] border border-[#172338] rounded-md overflow-hidden focus-within:border-white focus-within:ring-1 focus-within:ring-white">
                  <div className="px-4 py-3 bg-[#111D2E] border-r border-[#172338] text-gray-400 font-medium">
                    +256
                  </div>
                  <input 
                    type="tel" 
                    placeholder="772 123 456" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent text-white outline-none placeholder-gray-500"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Enter your number without the country code.</p>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#6F88FC] text-black font-bold py-3.5 rounded-md hover:bg-[#45E3FF] transition-colors mt-2"
              >
                Pay UGX {amount.toLocaleString()}
              </button>
            </form>
          )}

          {momoStatus === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#6F88FC] mb-4" />
              <h3 className="font-bold text-lg mb-2 text-white">Initiating Payment...</h3>
              <p className="text-gray-400 text-sm">Please wait while we connect to {network === 'mtn' ? 'MTN' : 'Airtel'}.</p>
            </div>
          )}

          {momoStatus === 'waiting_prompt' && (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4 border border-blue-800/50">
                <Smartphone className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-white">Check your phone!</h3>
              <p className="text-gray-300 text-sm mb-6 max-w-[280px]">
                We&apos;ve sent a payment prompt to <br/><span className="font-bold text-white">+256 {phoneNumber}</span>. <br/><br/>Please enter your PIN to confirm the payment.
              </p>
              <div className="bg-orange-900/20 text-orange-400 text-xs px-4 py-3 rounded-md border border-orange-800/50 flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>If you didn&apos;t receive a prompt, dial *165# for MTN or *185# for Airtel to check pending approvals.</span>
              </div>
            </div>
          )}

          {momoStatus === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4 border border-green-800/50">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-white">Payment Successful!</h3>
              <p className="text-gray-300 text-sm mb-6 max-w-[280px]">
                Your {planName} is now active. You have full access to NARA TV.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-white text-black font-bold px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
               >
                 Start Watching
              </button>
            </div>
          )}
        </div>
      )}

      {method === 'card' && (
        <div className="animate-in fade-in flex flex-col gap-6 w-full">
           <form onSubmit={handleCardSubmit} className="flex flex-col gap-4">
             <div className="bg-[#172338]/30 border border-[#172338] rounded-md p-6 text-center mb-2">
                <CreditCard className="w-10 h-10 mx-auto text-gray-500 mb-4" />
                <h4 className="font-bold text-white mb-2">Flutterwave Secure Checkout</h4>
                <p className="text-sm text-gray-400">You will be redirected to Flutterwave to securely enter your card details and complete the payment.</p>
             </div>
             <button 
                type="submit"
                disabled={momoStatus === 'processing'}
                className="w-full bg-[#6F88FC] text-black font-bold py-3.5 rounded-md hover:bg-[#45E3FF] transition-colors flex justify-center items-center gap-2"
              >
                {momoStatus === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Checkout'}
              </button>
           </form>
        </div>
      )}

      {method === 'paypal' && (
        <div className="animate-in fade-in flex flex-col gap-6 w-full">
           <div className="bg-[#172338]/30 border border-[#172338] rounded-md p-6 text-center mb-2">
              <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto fill-blue-500 mb-4"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.815 1.01 1.15 1.304 2.815.87 4.714-.652 2.834-2.483 4.909-5.187 5.867-1.12.396-2.427.531-3.92.531H8.761L7.076 21.337z"/></svg> 
              <h4 className="font-bold text-white mb-2">Pay with PayPal</h4>
              <p className="text-sm text-gray-400">You will be securely redirected to PayPal to complete your purchase using your account or a supported card.</p>
           </div>
           <button 
              className="w-full bg-[#ffc439] hover:bg-[#f4bb33] text-black font-bold py-3.5 rounded-md transition-colors"
            >
              Continue to PayPal
            </button>
        </div>
      )}

    </div>
  );
}
