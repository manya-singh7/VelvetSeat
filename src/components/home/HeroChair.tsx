import { useEffect, useState } from 'react';

const SALONS = [
  { id: 1, name: 'Mirrors Luxury Salon', area: 'Indiranagar', rating: 4.9, price: '₹₹₹', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80' },
  { id: 2, name: 'Toni & Guy', area: 'MG Road', rating: 4.8, price: '₹₹₹', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80' },
  { id: 3, name: 'Enrich Salon', area: 'Koramangala', rating: 4.7, price: '₹₹', image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80' },
  { id: 4, name: 'Affinity Salon', area: 'HSR Layout', rating: 4.7, price: '₹₹', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80' },
  { id: 5, name: 'VLCC Wellness', area: 'Jayanagar', rating: 4.6, price: '₹₹', image: 'https://images.unsplash.com/photo-1633681926035-ec1ac984418a?w=500&q=80' },
  { id: 6, name: 'Naturals Salon', area: 'Whitefield', rating: 4.6, price: '₹₹', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80' },
  { id: 7, name: 'Bounce Salon', area: 'HSR Layout', rating: 4.7, price: '₹₹', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80' },
  { id: 8, name: 'Green Trends', area: 'Jayanagar', rating: 4.5, price: '₹', image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80' },
  { id: 9, name: 'Looks Salon', area: 'Marathahalli', rating: 4.6, price: '₹₹', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80' },
  { id: 10, name: 'Lakme Salon', area: 'Bannerghatta Road', rating: 4.8, price: '₹₹₹', image: 'https://images.unsplash.com/photo-1633681926035-ec1ac984418a?w=500&q=80' },
];

const REPEAT_COUNT = 30;
const trackSalons = Array.from({ length: REPEAT_COUNT }, () => SALONS).flat();

const CARD_WIDTH = 220;
const CARD_GAP = 24;
const STEP = CARD_WIDTH + CARD_GAP;
const HOLD_MS = 2800;
const MOVE_MS = 900;
const VISIBLE_DISTANCE = 3;

export default function HeroChair() {
  // Start one full lap into the repeated array — this guarantees salons
  // 7, 8, 9, 10 are already sitting visible to the left the moment the
  // page loads, instead of an empty gap.
  const [active, setActive] = useState(SALONS.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => prev + 1);
    }, HOLD_MS + MOVE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-[#1A0A0F]">
      <video autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0A0F]/30 via-transparent to-[#1A0A0F]/95" />

      <div className="absolute bottom-0 left-0 right-0 pb-6 pt-4 bg-gradient-to-t from-[#1A0A0F] via-[#1A0A0F]/80 to-transparent">
        <p className="text-center text-[#C4847A] text-xs uppercase tracking-[0.3em] mb-4">
          Top 10 This Week
        </p>

        {/* Extra height + padding so the gold ring has room to render
            without the wrapper's overflow-hidden slicing its top edge */}
        <div className="relative h-[230px] overflow-hidden">
          <CarouselTrack active={active} />
        </div>
      </div>
    </section>
  );
}

function CarouselTrack({ active }: { active: number }) {
  const [wrapperWidth, setWrapperWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setWrapperWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const trackOffset = wrapperWidth / 2 - (active * STEP + CARD_WIDTH / 2);

  return (
    <div
      className="absolute left-0 flex gap-6"
      style={{
        top: 10, // breathing room for the box-shadow ring above the cards
        transform: `translateX(${trackOffset}px)`,
        transition: `transform ${MOVE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
      }}
    >
      {trackSalons.map((salon, i) => {
        const distance = Math.abs(i - active);
        const isCenter = distance === 0;

        if (distance > VISIBLE_DISTANCE + 1) {
          return <div key={i} style={{ width: CARD_WIDTH, flexShrink: 0 }} />;
        }

        const scale = Math.max(0.6, 1 - distance * 0.18);
        const opacity = Math.max(0, 1 - distance * 0.3);
        const liftY = distance * 10;

        return (
          <div
            key={i}
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{
              width: CARD_WIDTH,
              height: 160,
              transform: `scale(${scale}) translateY(${liftY}px)`,
              opacity,
              transition: `transform ${MOVE_MS}ms ease-out, opacity ${MOVE_MS}ms ease-out, box-shadow ${MOVE_MS}ms ease-out`,
              boxShadow: isCenter
                ? '0 0 0 3px #C9A84C, 0 12px 30px rgba(0,0,0,0.5)'
                : '0 0 0 0px transparent',
              zIndex: 10 - distance,
            }}
          >
            <img src={salon.image} alt={salon.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            <div
              className="absolute top-2 left-2 rounded-full text-[#1A0A0F] text-[10px] font-bold flex items-center justify-center transition-all"
              style={{
                width: isCenter ? 22 : 18,
                height: isCenter ? 22 : 18,
                backgroundColor: isCenter ? '#C9A84C' : '#C9A84Caa',
              }}
            >
              {(i % SALONS.length) + 1}
            </div>

            <div className="absolute bottom-2 left-3 right-3">
              <p className={`text-white font-semibold truncate ${isCenter ? 'text-sm' : 'text-xs'}`}>
                {salon.name}
              </p>
              {isCenter && (
                <div className="flex items-center justify-between text-[10px] text-[#C4847A] mt-0.5">
                  <span className="truncate">{salon.area}</span>
                  <span className="text-[#C9A84C] flex-shrink-0 ml-1">★ {salon.rating} · {salon.price}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}