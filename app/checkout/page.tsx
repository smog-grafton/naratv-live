'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IconLock } from '@/components/icons';
import { BadgeCheck, CreditCard, Smartphone } from 'lucide-react';
import {
  checkoutSubscription,
  checkoutEventTicket,
  getEvent,
  getPaymentGateways,
  getPlans,
  getStoredToken,
  getStoredUser,
} from '@/services/home';
import { Event, PaymentGateway, SubscriptionPlan } from '@/services/types';

function gatewayLabel(item?: PaymentGateway | null) {
  if (!item) return 'Payment gateway';
  const fallback = item.code.replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  return item.display_name || item.name || item.public_label || fallback;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get('plan');
  const eventParam = searchParams.get('event');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [gateway, setGateway] = useState('iotec');
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCheckout() {
      setInitializing(true);
      setError('');
      try {
        const loadedGateways = await getPaymentGateways();
        if (loadedGateways.length === 0) {
          throw new Error('No active payment gateway is available. Please contact support before trying again.');
        }
        if (active) {
          setGateways(loadedGateways);
          setGateway(loadedGateways.find((item) => item.is_default)?.code || loadedGateways[0].code);
        }

        if (eventParam) {
          const loadedEvent = await getEvent(eventParam);
          if (active) setEvent(loadedEvent);
        } else {
          const loadedPlans = await getPlans();
          if (active) setPlans(loadedPlans);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Could not load checkout details.');
      } finally {
        if (active) setInitializing(false);
      }
    }

    loadCheckout();
    return () => {
      active = false;
    };
  }, [eventParam]);

  const selectedPlan = useMemo(() => {
    if (eventParam) return null;
    return plans.find((plan) => String(plan.slug) === String(planParam) || String(plan.id) === String(planParam)) || plans[0] || null;
  }, [eventParam, planParam, plans]);

  const selectedTicket = useMemo(() => {
    if (!event?.tickets?.length) return null;
    const onSale = event.tickets.filter((ticket) => ticket.on_sale !== false);
    return onSale.find((ticket) => ticket.grants_live_access || ticket.grants_replay_access || ['online', 'online_ppv', 'vip_online', 'replay'].includes(ticket.access_type || '')) || onSale[0] || null;
  }, [event]);

  const amount = eventParam
    ? `${event?.currency || selectedTicket?.currency || 'UGX'} ${(Number(selectedTicket?.price || event?.price || 0) * quantity).toLocaleString()}`
    : selectedPlan?.formatted_price || `${selectedPlan?.currency || 'UGX'} ${Number(selectedPlan?.price || 0).toLocaleString()}`;
  const title = eventParam ? `Event Pass: ${event?.title || eventParam}` : selectedPlan?.name || 'NaraTV Pass';
  const selectedGateway = gateways.find((item) => item.code === gateway) || gateways[0] || null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getStoredToken();

    if (!token) {
      router.push(`/login?next=${encodeURIComponent(`/checkout?${searchParams.toString()}`)}`);
      return;
    }

    if (eventParam && !selectedTicket) {
      setError('This event does not have an available ticket yet.');
      return;
    }

    if (!eventParam && !selectedPlan) {
      setError('No active subscription plan is available.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkout = eventParam
        ? await checkoutEventTicket(eventParam, { event_ticket_id: selectedTicket!.id, quantity, phone: phoneNumber, gateway, holder: { name: getStoredUser()?.name || undefined, email: getStoredUser()?.email || undefined, phone: phoneNumber } }, token)
        : await checkoutSubscription({ subscription_plan_id: selectedPlan!.id, phone: phoneNumber, gateway: gateway as 'iotec' | 'flutterwave' }, token);

      if (checkout.checkout_url) {
        window.location.href = checkout.checkout_url;
        return;
      }

      if (checkout.transaction_reference) {
        router.push(`/payment/status?reference=${encodeURIComponent(checkout.transaction_reference)}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be started.');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return <div className="min-h-[80vh] flex items-center justify-center text-white bg-nara-black">Loading checkout...</div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-nara-black py-12 px-4">
      <div className="w-full max-w-md bg-nara-surface border border-nara-border rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-nara-black p-6 border-b border-nara-border">
          <h1 className="text-xl font-bold text-white mb-1">Checkout</h1>
          <div className="flex justify-between items-end mt-4 gap-4">
            <div>
              <p className="text-sm text-nara-text-muted">{title}</p>
          {eventParam && selectedTicket && <p className="text-xs text-gray-500 mt-1">{selectedTicket.name}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs text-nara-text-muted uppercase">Total</p>
              <p className="text-2xl font-bold text-white">{amount}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePayment} className="p-6">
          {error && <div className="mb-4 border border-red-500/30 bg-red-950/40 text-red-200 text-sm p-3">{error}</div>}

          <div className="mb-6">
            {gateways.length > 0 && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-white mb-2">Payment Method</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {gateways.map((item) => {
                    const checked = gateway === item.code;
                    const Icon = item.supports_card ? CreditCard : Smartphone;

                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setGateway(item.code)}
                        className={`relative min-h-28 border p-4 text-left transition ${checked ? 'border-[#45E3FF] bg-[#45E3FF]/10' : 'border-nara-border bg-nara-black hover:border-white/30'}`}
                      >
                        {item.is_default ? (
                          <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-[#45E3FF]/50 text-[#45E3FF]" title="Recommended gateway" aria-label="Recommended gateway">
                            <BadgeCheck className="h-4 w-4" />
                          </span>
                        ) : null}
                        <span className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-[#45E3FF]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <strong className="mt-4 block text-sm uppercase tracking-wide text-white">{gatewayLabel(item)}</strong>
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-nara-text-muted">{item.instructions || 'Secure payment gateway'}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedGateway?.instructions ? (
                  <p className="text-xs text-nara-text-muted mt-2">{selectedGateway.instructions}</p>
                ) : null}
              </div>
            )}

            <label className="block text-sm font-medium text-white mb-2">Mobile Money Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-nara-text-muted select-none">+256</span>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="772 123 456"
                className="w-full bg-nara-black border border-nara-border rounded-sm py-3 pl-16 pr-4 text-white outline-none focus:border-nara-red transition-colors"
              />
            </div>
            <p className="text-xs text-nara-text-muted mt-2">Enter your MTN or Airtel number to receive the payment prompt.</p>
            {eventParam && selectedTicket ? (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-white">Number of tickets</label>
                <input type="number" min={1} max={selectedTicket.max_per_purchase || 10} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(Number(event.target.value) || 1, selectedTicket.max_per_purchase || 10)))} className="w-full bg-nara-black border border-nara-border rounded-sm py-3 px-4 text-white outline-none focus:border-nara-red transition-colors" />
                <p className="mt-2 text-xs text-nara-text-muted">This ticket is issued by NaraTV and remains in your NaraTV account after payment.</p>
              </div>
            ) : null}
          </div>

          {eventParam && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">Promo Code</label>
              <input
                type="text"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                placeholder="FIGHTNIGHT"
                className="w-full bg-nara-black border border-nara-border rounded-sm py-3 px-4 text-white outline-none focus:border-nara-red transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || phoneNumber.length < 9}
            className="w-full bg-nara-red hover:bg-nara-red/90 text-white font-bold py-4 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Preparing secure checkout...</>
            ) : (
              <>
                <IconLock className="w-4 h-4 fill-current" />
                Pay {amount}
              </>
            )}
          </button>

          <p className="text-center text-xs text-nara-text-muted mt-4">
            By paying, you agree to our <Link href="/support" className="underline hover:text-white">Terms of Service</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
