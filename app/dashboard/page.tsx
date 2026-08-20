'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconPlay, IconLock } from '@/components/icons';
import { getDashboard, getStoredToken } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      window.location.href = '/login';
      return;
    }

    getDashboard(token)
      .then(setDashboard)
      .finally(() => setLoading(false));
  }, []);

  const activePlan = dashboard?.active_subscription;
  const continueWatching = dashboard?.continue_watching || [];

  return (
    <div className="min-h-[80vh] bg-nara-black pt-24 pb-24 px-4 md:px-8">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-24">
            <h1 className="text-2xl font-bold text-white mb-8">My Account</h1>
            
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-4 md:pb-0">
              <Link href="/dashboard" className="bg-white/10 text-white font-medium px-4 py-3 rounded-sm whitespace-nowrap">
                Overview
              </Link>
              <Link href="/subscriptions" className="text-nara-text-muted hover:bg-white/5 hover:text-white font-medium px-4 py-3 rounded-sm transition-colors whitespace-nowrap">
                Subscriptions
              </Link>
              <Link href="/my-account" className="text-nara-text-muted hover:bg-white/5 hover:text-white font-medium px-4 py-3 rounded-sm transition-colors whitespace-nowrap">
                Payment History
              </Link>
              <Link href="/replays" className="text-nara-text-muted hover:bg-white/5 hover:text-white font-medium px-4 py-3 rounded-sm transition-colors whitespace-nowrap">
                My Library
              </Link>
              <Link href="/my-account/profile" className="text-nara-text-muted hover:bg-white/5 hover:text-white font-medium px-4 py-3 rounded-sm transition-colors whitespace-nowrap">
                Profile
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {loading && (
            <div className="mb-8 border border-nara-border bg-nara-surface p-6 text-sm text-nara-text-muted">
              Loading your account...
            </div>
          )}

          {dashboard?.user && (
            <section className="mb-8">
              <p className="text-sm uppercase tracking-widest text-nara-text-muted">Signed in as</p>
              <h2 className="mt-1 text-2xl font-bold text-white">{dashboard.user.name}</h2>
              <p className="text-sm text-nara-text-muted">{dashboard.user.email || dashboard.user.phone}</p>
            </section>
          )}

          <section className="mb-12">
            <h2 className="text-xl font-medium text-white mb-4 border-b border-nara-border pb-2">Active Plan</h2>
            <div className="bg-nara-surface border border-nara-red rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl shadow-nara-red/5">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white">{activePlan?.plan?.name || 'No active plan'}</h3>
                  <span className="bg-nara-red text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">{activePlan?.status || 'Inactive'}</span>
                </div>
                <p className="text-sm text-nara-text-muted">
                  {activePlan?.expires_at ? `Access until ${new Date(activePlan.expires_at).toLocaleDateString()}` : 'Choose a pass to unlock premium replays and live access.'}
                </p>
              </div>
              <Link href="/subscriptions" className="bg-nara-black border border-nara-border hover:bg-white/5 text-white font-medium py-2 px-6 rounded-sm transition-colors text-sm">
                Manage Plan
              </Link>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex justify-between items-center mb-4 border-b border-nara-border pb-2">
              <h2 className="text-xl font-medium text-white">Continue Watching</h2>
              <Link href="/replays" className="text-sm text-nara-text-muted hover:text-white">View all</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {continueWatching.length ? continueWatching.slice(0, 4).map((item: any) => {
                const content = item.video || item.event;
                if (!content) return null;

                return (
                <Link href={`/watch/${content.slug}`} key={item.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative w-32 aspect-video bg-nara-surface rounded-sm overflow-hidden flex-shrink-0">
                    <NaraImage src={content.thumbnail_url || content.poster_url} alt={content.title || 'NaraTV content'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <IconPlay className="w-8 h-8 text-white fill-current" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div className="h-full bg-nara-red" style={{ width: `${item.progress_percent || 0}%` }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-medium text-white line-clamp-2 mb-1 group-hover:text-nara-red transition-colors">{content.title}</h4>
                    <p className="text-xs text-nara-text-muted">{item.progress_percent || 0}% watched</p>
                  </div>
                </Link>
              )}) : (
                <p className="text-sm text-nara-text-muted">Start watching a replay or live card and it will appear here.</p>
              )}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4 border-b border-nara-border pb-2">
              <h2 className="text-xl font-medium text-white">Purchased Events (PPV)</h2>
            </div>
            <div className="bg-nara-surface border border-nara-border rounded-lg p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <IconLock className="w-5 h-5 text-nara-text-muted" />
              </div>
              <h3 className="text-white font-medium mb-1">{dashboard?.tickets_count || 0} purchased tickets</h3>
              <p className="text-sm text-nara-text-muted mb-6">Your tickets, payments, and stream access are issued and managed by NaraTV.</p>
              <Link href="/my-account/tickets" className="mr-3 bg-nara-red hover:bg-nara-red/90 text-white font-medium py-2.5 px-6 rounded-sm transition-colors text-sm">View my tickets</Link>
              <Link href="/events" className="bg-white hover:bg-white/90 text-nara-black font-medium py-2.5 px-6 rounded-sm transition-colors text-sm">
                Browse Events
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
