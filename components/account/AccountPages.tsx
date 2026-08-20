'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, CreditCard, Loader2, LogOut, MonitorSmartphone, Settings } from 'lucide-react';
import {
  AccountDashboard,
  AuthUser,
  UserDevice,
  clearSession,
  getAccount,
  getDevices,
  getMyTickets,
  getStoredToken,
  logout,
  revokeDevice,
  storeSession,
  updateProfile,
} from '@/services/home';

type ActivePage = 'overview' | 'tickets' | 'profile' | 'devices';

function initialFor(user?: AuthUser | null) {
  return (user?.name || user?.email || 'N').trim().charAt(0).toUpperCase();
}

function formatDate(value?: string | null) {
  if (!value) return 'Not recorded yet';
  return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function useAccountSession() {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      router.replace(`/login?next=${encodeURIComponent(pathname || '/my-account')}`);
      return;
    }
    setToken(storedToken);
  }, [pathname, router]);

  return token;
}

function AccountChrome({ active, user, children }: { active: ActivePage; user?: AuthUser | null; children: ReactNode }) {
  const router = useRouter();
  const nav = [
    ['overview', '/my-account', 'Overview'],
    ['tickets', '/my-account/tickets', 'My tickets'],
    ['profile', '/my-account/profile', 'Profile and settings'],
    ['devices', '/my-account/devices', 'Manage devices'],
  ] as const;

  async function signOut() {
    const token = getStoredToken();
    await logout(token).catch(() => null);
    clearSession();
    router.replace('/');
  }

  return (
    <div className="min-h-screen bg-[#050B12] text-white font-sans">
      <header className="border-b border-[#172338] bg-[#050B12]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center text-lg font-black uppercase tracking-tighter">
            <span className="mr-1 rounded-sm bg-nara-red px-1.5 py-0.5 leading-none text-white">NARA</span>
            <span className="leading-none text-white">TV</span>
            <span className="ml-2 border-l border-[#172338] pl-2 text-sm font-normal capitalize text-gray-400">My Account</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={signOut} className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 transition-colors hover:text-white sm:flex">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
              {initialFor(user)}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-0 py-0 md:flex-row md:px-8 md:py-8">
        <aside className="hidden w-full flex-shrink-0 border-[#172338] bg-[#050B12] md:block md:w-64 md:border-r md:bg-transparent">
          <div className="mb-4 border-b border-[#172338] p-4 md:mb-0 md:border-b-0 md:p-0">
            <Link href="/" className="mb-8 flex items-center gap-3 px-4 text-sm font-bold text-gray-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to NARA TV
            </Link>
          </div>
          <nav className="flex flex-col gap-1 pr-4">
            {nav.map(([key, href, label]) => (
              <Link
                key={key}
                href={href}
                className={`rounded-[4px] px-4 py-3 text-sm transition-colors ${active === key ? 'border-l-4 border-white bg-[#111D2E] font-bold text-white' : 'font-medium text-gray-400 hover:bg-[#111D2E] hover:text-white'}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="mb-4 flex gap-4 overflow-x-auto whitespace-nowrap border-b border-[#172338] bg-[#050B12] p-4 md:hidden">
          <Link href="/" className="border-r border-[#172338] pr-4 text-sm font-bold text-gray-400">Back</Link>
          {nav.map(([key, href, label]) => (
            <Link key={key} href={href} className={`pb-1 text-sm ${active === key ? 'border-b-2 border-white font-bold text-white' : 'font-medium text-gray-400'}`}>
              {label.split(' ')[0]}
            </Link>
          ))}
        </div>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 md:mx-0 md:px-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function LoadingAccount() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#050B12] text-white">
      <Loader2 className="h-7 w-7 animate-spin text-[#6F88FC]" />
    </div>
  );
}

export function AccountOverviewPage() {
  const token = useAccountSession();
  const [account, setAccount] = useState<AccountDashboard | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getAccount(token).then(setAccount).catch((err) => setError(err instanceof Error ? err.message : 'Could not load your account.'));
  }, [token]);

  if (!token || (!account && !error)) return <LoadingAccount />;
  const user = account?.user;
  const plan = account?.active_subscription?.plan?.name || 'No active pass';

  return (
    <AccountChrome active="overview" user={user}>
      {error ? <div className="mb-6 border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-100">{error}</div> : null}

      <Link href="/my-account/profile" className="relative mb-8 flex items-center justify-between overflow-hidden rounded-[4px] border border-[#172338] bg-[#111D2E] p-4 transition-colors hover:border-gray-500 md:p-6">
        <div className="absolute left-0 top-0 bg-[#6F88FC] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
          Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'recently'}
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#172338] bg-[#050B12] text-lg font-bold text-white">
            {initialFor(user)}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{user?.name || 'NaraTV member'}</h2>
            <p className="text-sm text-gray-400">{user?.email || user?.phone || 'Account access ready'}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-500" />
      </Link>

      <h3 className="mb-4 text-lg font-bold text-white">My Subscriptions</h3>
      <div className="mb-8 overflow-hidden rounded-[4px] border border-[#172338] bg-[#111D2E]">
        <div className="flex items-center justify-between border-b border-[#172338] p-4">
          <h4 className="text-lg font-bold text-white">{plan}</h4>
          {account?.active_subscription?.expires_at ? <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Renews {formatDate(account.active_subscription.expires_at)}</span> : null}
        </div>
        <div className="m-4 flex flex-col items-start justify-between gap-4 rounded-[4px] border border-orange-500/20 bg-orange-500/10 p-4 md:flex-row md:items-center">
          <div className="text-sm text-white">
            <span className="font-bold">Upgrade anytime</span> for live fights, premium replays, and Nara Originals.
          </div>
          <Link href="/subscriptions" className="whitespace-nowrap rounded-[4px] bg-[#6F88FC] px-6 py-2 text-sm font-bold text-black transition-colors hover:bg-[#45E3FF]">
            View passes
          </Link>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
      <div className="mb-8 flex flex-col overflow-hidden rounded-[4px] border border-[#172338] bg-[#111D2E]">
        <Link href="/my-account/tickets" className="flex items-center justify-between border-b border-[#172338] p-4 transition-colors hover:bg-[#172338]">
          <div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-gray-400" /><span className="text-sm font-bold text-white">My tickets</span></div>
          <span className="flex items-center gap-2 text-sm text-gray-400">{account?.tickets_count || 0}<ChevronRight className="h-5 w-5 text-gray-500" /></span>
        </Link>
        <Link href="/my-account/devices" className="flex items-center justify-between border-b border-[#172338] p-4 transition-colors hover:bg-[#172338]">
          <div className="flex items-center gap-3">
            <MonitorSmartphone className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-bold text-white">Manage devices</span>
          </div>
          <span className="flex items-center gap-2 text-sm text-gray-400">{account?.devices_count || 0}<ChevronRight className="h-5 w-5 text-gray-500" /></span>
        </Link>
        <Link href="/my-account/profile" className="flex items-center justify-between border-b border-[#172338] p-4 transition-colors hover:bg-[#172338]">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-bold text-white">Profile and preferences</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </Link>
        <Link href="/subscriptions" className="flex items-center justify-between p-4 transition-colors hover:bg-[#172338]">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <span className="border-b border-dashed border-gray-500 pb-0.5 text-sm font-bold text-white">Explore subscriptions</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </Link>
      </div>

      <h3 className="mb-4 text-lg font-bold text-white">Tickets & Payments</h3>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ['Tickets', account?.tickets_count || 0],
          ['Payments', account?.payments_count || 0],
          ['Devices', account?.devices_count || 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[4px] border border-[#172338] bg-[#111D2E] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>
    </AccountChrome>
  );
}

export function AccountTicketsPage() {
  const token = useAccountSession();
  const [tickets, setTickets] = useState<Awaited<ReturnType<typeof getMyTickets>>>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getMyTickets(token).then(setTickets).catch((err) => setError(err instanceof Error ? err.message : 'Could not load your tickets.'));
  }, [token]);

  if (!token || (!tickets.length && !error)) return <LoadingAccount />;

  return <AccountChrome active="tickets">
    <h1 className="mb-2 text-2xl font-bold text-white">My tickets</h1>
    <p className="mb-6 text-sm leading-7 text-gray-400">Your NaraTV-issued physical tickets, payment status, and entry codes.</p>
    {error ? <div className="mb-6 border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-100">{error}</div> : null}
    <div className="grid gap-4">
      {tickets.length ? tickets.map((ticket) => <article key={ticket.id} className="rounded-[4px] border border-[#172338] bg-[#111D2E] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#6F88FC]">{ticket.event?.name || 'NaraTV event'}</p><h2 className="mt-2 text-lg font-bold text-white">{ticket.ticket?.name || 'Event ticket'}</h2></div>
          <span className={`rounded-sm px-2 py-1 text-xs font-bold uppercase ${ticket.payment_status === 'paid' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-orange-500/15 text-orange-300'}`}>{ticket.payment_status}</span>
        </div>
        <div className="mt-5 grid gap-3 text-sm text-gray-300 sm:grid-cols-3"><div><span className="block text-xs uppercase tracking-wider text-gray-500">Ticket code</span><strong>{ticket.ticket_code}</strong></div><div><span className="block text-xs uppercase tracking-wider text-gray-500">Quantity</span><strong>{ticket.quantity}</strong></div><div><span className="block text-xs uppercase tracking-wider text-gray-500">Total</span><strong>{ticket.currency} {Number(ticket.total).toLocaleString()}</strong></div></div>
        <p className="mt-4 text-xs text-gray-500">{ticket.checked_in_at ? `Checked in ${formatDate(ticket.checked_in_at)}` : 'Present this code at venue entry.'}</p>
      </article>) : <div className="rounded-[4px] border border-[#172338] bg-[#111D2E] p-8 text-sm text-gray-400">No NaraTV tickets have been issued yet.</div>}
    </div>
  </AccountChrome>;
}

export function AccountProfilePage() {
  const token = useAccountSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getAccount(token).then((account) => setUser(account.user)).catch((err) => setError(err instanceof Error ? err.message : 'Could not load your profile.'));
  }, [token]);

  const formUser = useMemo(() => user || { id: '', name: '', email: '', phone: '', city: '', country: '', bio: '', schedule_notifications_enabled: true, marketing_opt_in: false }, [user]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const updated = await updateProfile({
        name: String(form.get('name') || ''),
        email: String(form.get('email') || ''),
        phone: String(form.get('phone') || ''),
        city: String(form.get('city') || ''),
        country: String(form.get('country') || ''),
        bio: String(form.get('bio') || ''),
        schedule_notifications_enabled: form.get('schedule_notifications_enabled') === 'on',
        marketing_opt_in: form.get('marketing_opt_in') === 'on',
      }, token);
      setUser(updated);
      storeSession({ token, user: updated });
      setMessage('Your profile has been updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  if (!token || (!user && !error)) return <LoadingAccount />;

  return (
    <AccountChrome active="profile" user={user}>
      <h1 className="mb-6 text-2xl font-bold text-white">Profile & Settings</h1>
      <form onSubmit={onSubmit} className="mb-8 overflow-hidden rounded-[4px] border border-[#172338] bg-[#111D2E]">
        <div className="border-b border-[#172338] p-6">
          <h3 className="mb-4 text-base font-bold text-white">Personal Details</h3>
          <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 sm:col-span-2">
              Name
              <input name="name" defaultValue={formUser.name || ''} required className="rounded-md border border-[#172338] bg-[#050B12] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-white" />
            </label>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Email
              <input name="email" type="email" defaultValue={formUser.email || ''} required className="rounded-md border border-[#172338] bg-[#050B12] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-white" />
            </label>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Phone
              <input name="phone" defaultValue={formUser.phone || ''} className="rounded-md border border-[#172338] bg-[#050B12] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-white" />
            </label>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              City
              <input name="city" defaultValue={formUser.city || ''} className="rounded-md border border-[#172338] bg-[#050B12] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-white" />
            </label>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              Country
              <input name="country" defaultValue={formUser.country || ''} className="rounded-md border border-[#172338] bg-[#050B12] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-white" />
            </label>
            <label className="grid gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 sm:col-span-2">
              Bio
              <textarea name="bio" defaultValue={formUser.bio || ''} rows={4} className="rounded-md border border-[#172338] bg-[#050B12] px-3 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-white" />
            </label>
          </div>
        </div>

        <div className="border-b border-[#172338] p-6">
          <h3 className="mb-4 text-base font-bold text-white">Preferences</h3>
          <div className="grid gap-4">
            <label className="flex items-center justify-between gap-4 border-b border-[#172338] py-2">
              <span>
                <span className="block text-sm font-bold text-white">Schedule updates</span>
                <span className="block text-xs text-gray-500">Receive fight schedule and replay alerts.</span>
              </span>
              <input name="schedule_notifications_enabled" type="checkbox" defaultChecked={Boolean(formUser.schedule_notifications_enabled)} className="h-5 w-5 accent-[#6F88FC]" />
            </label>
            <label className="flex items-center justify-between gap-4 py-2">
              <span>
                <span className="block text-sm font-bold text-white">Offers and special features</span>
                <span className="block text-xs text-gray-500">Hear about passes, PPV offers, and new originals.</span>
              </span>
              <input name="marketing_opt_in" type="checkbox" defaultChecked={Boolean(formUser.marketing_opt_in)} className="h-5 w-5 accent-[#6F88FC]" />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6">
          {message ? <p className="border border-green-500/30 bg-green-950/30 p-3 text-sm text-green-100">{message}</p> : null}
          {error ? <p className="border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-100">{error}</p> : null}
          <button disabled={saving} className="w-full rounded-[4px] bg-[#6F88FC] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black disabled:opacity-60 sm:w-fit">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </AccountChrome>
  );
}

export function AccountDevicesPage() {
  const token = useAccountSession();
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDevices(activeToken: string) {
    setLoading(true);
    setError('');
    try {
      setDevices(await getDevices(activeToken));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your devices.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadDevices(token);
  }, [token]);

  async function removeDevice(deviceId: number | string) {
    if (!token) return;
    await revokeDevice(deviceId, token).catch((err) => setError(err instanceof Error ? err.message : 'Could not remove this device.'));
    await loadDevices(token);
  }

  if (!token || loading) return <LoadingAccount />;
  const currentUser = devices.find((device) => device.is_current);

  return (
    <AccountChrome active="devices" user={undefined}>
      <h1 className="mb-6 text-2xl font-bold text-white">Manage Devices</h1>
      <div className="mb-8 overflow-hidden rounded-[4px] border border-[#172338] bg-[#111D2E]">
        <div className="border-b border-[#172338] p-6">
          <h3 className="mb-2 text-lg font-bold text-white">My Registered Devices</h3>
          <p className="mb-6 text-sm text-gray-400">Review recent devices and remove access you no longer recognize.</p>
          {error ? <p className="mb-4 border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-100">{error}</p> : null}

          <div className="flex flex-col gap-4">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between gap-4 rounded-[4px] border border-[#172338] bg-[#050B12] p-4">
                <div className="flex items-center gap-4">
                  <MonitorSmartphone className="h-8 w-8 text-gray-500" />
                  <div>
                    <span className="block text-sm font-bold text-white">{device.device_name || `${device.browser || 'Browser'} - ${device.platform || 'Device'}`}</span>
                    <span className={`mt-0.5 block text-xs font-bold ${device.is_current ? 'text-green-500' : 'text-gray-500'}`}>
                      {device.is_current ? 'Currently active' : `Last used: ${formatDate(device.last_used_at)}`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeDevice(device.id)}
                  disabled={device.is_current}
                  className="rounded-[4px] border border-[#172338] px-4 py-1.5 text-sm font-bold text-gray-300 transition-colors hover:bg-[#172338] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            ))}
            {devices.length === 0 ? <p className="rounded-[4px] border border-[#172338] bg-[#050B12] p-4 text-sm text-gray-400">No devices have been recorded yet.</p> : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 bg-[#111D2E] p-6">
          <span className="text-sm font-medium text-gray-400">{currentUser ? `This session is active on ${currentUser.platform || 'this device'}.` : 'Device limits will be available for future passes.'}</span>
          <Link href="/support" className="text-sm font-bold text-blue-400 hover:underline">Need help?</Link>
        </div>
      </div>
    </AccountChrome>
  );
}
