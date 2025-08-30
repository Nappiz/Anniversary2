'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PhotoCard from './PhotoCard';
import clsx from 'clsx';

type CarouselItem = { id: number; src: string; caption: string };
type AllPhotos = { [year: string]: CarouselItem[] };
type Carousel3DProps = { allPhotos: AllPhotos };

gsap.registerPlugin(ScrollTrigger);

export default function Carousel3D({ allPhotos }: Carousel3DProps) {
  const component = useRef<HTMLDivElement>(null);
  const carousel = useRef<HTMLDivElement>(null);

  const years = Object.keys(allPhotos);
  const [activeYear, setActiveYear] = useState<string>(years[0]);
  const items = allPhotos[activeYear];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLDivElement>('.card');
      const numPanels = panels.length;

      const vw = window.innerWidth;
      const isMobile = vw < 640;
      const isTablet = vw >= 640 && vw < 1024;

      const endDistance = isMobile ? 2000 : isTablet ? 3000 : 4000;

      let baseRadius = isMobile ? 170 : isTablet ? 260 : 340;
      if (numPanels > 6) baseRadius += (numPanels - 6) * (isMobile ? 20 : 30);

      const baseScale = isMobile ? 0.9 : 1.0;
      const scaleDecrement = isMobile ? 0.04 : 0.05;
      const minCardScale = isMobile ? 0.7 : 0.6;
      let cardScale = baseScale;
      if (numPanels > 5) {
        cardScale = Math.max(minCardScale, baseScale - (numPanels - 5) * scaleDecrement);
      }

      const angleStep = 360 / Math.max(1, numPanels);

      gsap.set(panels, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        scale: cardScale,
        rotationY: (i: number) => i * angleStep,
        transformOrigin: `50% 50% -${baseRadius}px`,
        z: baseRadius,
        willChange: 'transform',
      });

      gsap.to(carousel.current, {
        rotationY: '+=360',
        ease: 'none',
        scrollTrigger: {
          trigger: component.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: `+=${endDistance}`,
        },
      });
    }, component);

    return () => ctx.revert();
  }, [items]);

  return (
    <div ref={component} className="relative min-h-[100svh] w-full">
      <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-20 flex flex-wrap justify-center gap-2 sm:gap-4 px-3 py-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={clsx(
              'rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold transition-all duration-300 cursor-pointer hover:scale-105',
              'backdrop-blur-sm ring-1',
              activeYear === year
                ? 'bg-pink-500 text-white shadow-lg ring-pink-400'
                : 'bg-white/70 text-pink-600 hover:bg-white ring-rose-200/60'
            )}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-rose-100 via-rose-50 to-transparent" />

      <div className="relative flex h-full w-full items-center justify-center [perspective:800px] sm:[perspective:1000px] lg:[perspective:1400px] [transform-style:preserve-3d]">
        <div ref={carousel} className="relative h-full w-full [transform-style:preserve-3d]">
          {items.map((item) => (
            <PhotoCard key={item.id} src={item.src} caption={item.caption} />
          ))}
        </div>
      </div>
    </div>
  );
}
