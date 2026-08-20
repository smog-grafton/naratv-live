import Link from 'next/link';
import { Calendar, Lock, Play } from 'lucide-react';
import { getSchedule } from '@/services/home';
import { Event } from '@/services/types';
import NaraImage from '@/components/media/NaraImage';

export const revalidate = 60;

function dayKey(event: Event) {
  return event.start_time ? new Date(event.start_time).toISOString().slice(0, 10) : 'TBA';
}

function formatDay(key: string) {
  if (key === 'TBA') return { weekday: 'TBA', day: '--', month: '' };
  const date = new Date(`${key}T00:00:00`);
  return {
    weekday: date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
    day: date.toLocaleDateString(undefined, { day: '2-digit' }),
    month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
  };
}

function formatTime(value?: string | null) {
  if (!value) return 'Time TBA';
  return new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default async function SchedulePage() {
  const events = await getSchedule(90);
  const grouped = events.reduce<Record<string, Event[]>>((carry, event) => {
    const key = dayKey(event);
    carry[key] = carry[key] || [];
    carry[key].push(event);
    return carry;
  }, {});

  return (
    <main className="min-h-screen bg-[#0E1015] pt-24 pb-24">
      <div className="sticky top-16 z-30 bg-[#0E1015]/95 border-b border-white/5 py-3 backdrop-blur">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 flex items-center gap-3 overflow-x-auto hide-scrollbar">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#24262b] text-white">
            <Calendar size={20} />
          </div>
          {['All Events', 'Live', 'Upcoming', 'Replays', 'PPV', 'Free'].map((filter, index) => (
            <span
              key={filter}
              className={`flex-shrink-0 px-4 h-10 inline-flex items-center rounded-md text-sm font-medium ${
                index === 0 ? 'bg-white text-black' : 'bg-[#24262b] text-white'
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 md:px-8 mt-10 space-y-12">
        {Object.entries(grouped).map(([key, dayEvents]) => {
          const label = formatDay(key);

          return (
            <section key={key} className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-6 border-t border-white/10 pt-8">
              <div className="lg:sticky lg:top-32 h-fit">
                <p className="text-gray-500 text-xs font-black tracking-[0.3em]">{label.weekday}</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-5xl font-black text-white leading-none">{label.day}</span>
                  <span className="text-sm font-black text-gray-500 mb-1">{label.month}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {dayEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group bg-[#0B1626] border border-white/10 hover:border-[#45E3FF]/50 rounded-sm overflow-hidden transition-colors"
                  >
                    <div className="relative aspect-video bg-black">
                      <NaraImage
                        src={event.poster_url || event.thumbnail_url || '/assets/images/banner/event_banner.jpg'}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {event.is_live ? (
                          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase">Live</span>
                        ) : (
                          <span className="bg-white text-black text-[10px] font-black px-2 py-1 uppercase">{formatTime(event.start_time)}</span>
                        )}
                        {(event.is_ppv || event.access_type === 'ticket_holder') && (
                          <span className="bg-black/70 text-white p-1 rounded-sm"><Lock className="w-3 h-3" /></span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#45E3FF] font-black mb-2">{event.status}</p>
                      <h2 className="text-white font-black uppercase tracking-tight line-clamp-2">{event.title}</h2>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-1">{[event.venue, event.city, event.country].filter(Boolean).join(', ')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {events.length === 0 && (
          <div className="border border-white/10 bg-[#0B1626] p-10 text-center">
            <h2 className="text-white text-xl font-black uppercase">No scheduled events yet</h2>
            <p className="text-gray-400 mt-2">The next NaraTV schedule is being prepared. Check back soon for live cards and replay premieres.</p>
          </div>
        )}
      </div>
    </main>
  );
}
