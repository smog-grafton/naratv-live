'use client';

/* eslint-disable @next/next/no-img-element */
import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import logoImage from '@/app/logo.png';
import { resolveMediaUrl } from '@/lib/media';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
  fallbackLabel?: string;
  fallbackClassName?: string;
};

export default function NaraImage({ src, alt, className = '', fallbackLabel = 'NaraTV', fallbackClassName, ...props }: Props) {
  const resolved = resolveMediaUrl(src);
  const [failedSource, setFailedSource] = useState<string | null>(resolved ? null : 'missing');

  useEffect(() => {
    setFailedSource(resolved ? null : 'missing');
  }, [resolved]);

  const showFallback = !resolved || failedSource === resolved;
  const mediaClassName = `block ${className}`.trim();

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={`${alt} unavailable`}
        data-media-fallback="true"
        className={`${fallbackClassName || mediaClassName} relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#172338_0%,#07111F_68%,#050B12_100%)]`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(69,227,255,0.06)_48%,transparent_100%)]" />
        <div className="relative flex flex-col items-center justify-center gap-2 px-4 text-center">
          <Image src={logoImage as StaticImageData} alt="NaraTV" width={132} height={40} className="h-auto max-h-10 w-auto object-contain opacity-90" />
          <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/45">{fallbackLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={resolved}
      alt={alt}
      className={mediaClassName}
      onError={() => setFailedSource(resolved)}
    />
  );
}
