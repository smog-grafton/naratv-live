function Block({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-white/[0.07] ${className}`} />;
}

export function PageSkeleton({ kind = 'grid' }: { kind?: 'grid' | 'detail' | 'plans' | 'player' }) {
  if (kind === 'detail') {
    return (
      <main className="min-h-[70vh] bg-nara-black px-4 pb-24 pt-28 md:px-12" aria-busy="true" aria-label="Loading page">
        <div className="mx-auto max-w-[1920px] space-y-8">
          <Block className="h-3 w-28" />
          <Block className="h-12 w-2/3 max-w-2xl md:h-20" />
          <Block className="aspect-[16/6] w-full" />
          <div className="grid gap-4 md:grid-cols-3"><Block className="h-24" /><Block className="h-24" /><Block className="h-24" /></div>
        </div>
      </main>
    );
  }

  if (kind === 'player') {
    return (
      <main className="min-h-[70vh] bg-nara-black px-4 pb-24 pt-24 md:px-12" aria-busy="true" aria-label="Loading player">
        <div className="mx-auto max-w-[1400px] space-y-5"><Block className="aspect-video w-full" /><Block className="h-8 w-2/3" /><Block className="h-4 w-1/2" /></div>
      </main>
    );
  }

  if (kind === 'plans') {
    return (
      <main className="min-h-[70vh] bg-nara-black px-4 pb-24 pt-28 md:px-12" aria-busy="true" aria-label="Loading subscription plans">
        <div className="mx-auto max-w-6xl space-y-10"><div className="mx-auto space-y-4 text-center"><Block className="mx-auto h-4 w-32" /><Block className="mx-auto h-12 w-80" /><Block className="mx-auto h-5 w-full max-w-xl" /></div><div className="grid gap-6 lg:grid-cols-3"><Block className="h-[430px]" /><Block className="h-[430px]" /><Block className="h-[430px]" /></div></div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-nara-black px-4 pb-24 pt-28 md:px-12" aria-busy="true" aria-label="Loading content">
      <div className="mx-auto max-w-[1920px] space-y-8"><Block className="h-12 w-72" /><Block className="h-5 w-full max-w-xl" /><div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Block className="aspect-video" /><Block className="aspect-video" /><Block className="aspect-video" /><Block className="aspect-video" /></div></div>
    </main>
  );
}
