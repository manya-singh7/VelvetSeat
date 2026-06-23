import { useState } from 'react';
import {
  Heart, Sparkles, Zap, Clock, Moon, Flower2, X, ArrowRight, Wine,
} from "lucide-react";
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Salon {
  id: number;
  name: string;
  area: string;
  rating: number;
  price: string;
  image: string;
  tags: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SALONS: Salon[] = [
  { id: 1, name: 'Mirrors Luxury Salon', area: 'Indiranagar', rating: 4.9, price: '₹₹₹', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80',   tags: ['bridal', 'makeup', 'glam', 'premium'] },
  { id: 2, name: 'Toni & Guy',           area: 'MG Road',     rating: 4.8, price: '₹₹₹', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500&q=80', tags: ['color', 'cut', 'transformation', 'premium'] },
  { id: 3, name: 'Enrich Salon',         area: 'Koramangala', rating: 4.7, price: '₹₹',  image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&q=80', tags: ['bridal', 'makeup', 'hairstyling'] },
  { id: 4, name: 'Affinity Salon',       area: 'HSR Layout',  rating: 4.7, price: '₹₹',  image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&q=80', tags: ['spa', 'relax', 'wellness', 'facial'] },
  { id: 5, name: 'VLCC Wellness',        area: 'Jayanagar',   rating: 4.6, price: '₹₹',  image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80', tags: ['spa', 'wellness', 'relax', 'facial'] },
  { id: 6, name: 'Naturals Salon',       area: 'Whitefield',  rating: 4.6, price: '₹₹',  image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=500&q=80', tags: ['grooming', 'quick', 'budget', 'cut'] },
  { id: 7, name: 'Bounce Salon',         area: 'HSR Layout',  rating: 4.7, price: '₹₹',  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80', tags: ['color', 'transformation', 'cut'] },
  { id: 8, name: 'Green Trends',         area: 'Jayanagar',   rating: 4.5, price: '₹',   image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&q=80', tags: ['grooming', 'quick', 'budget'] },
];

// 7 vibes arranged as: 3 + 1 (hero center) + 3 = symmetrical arc
const VIBES = [
  {
    id: 'bridal',
    label: 'Bridal Glow',
    subtitle: 'Wedding-ready beauty',
    services: ['Bridal Makeup', 'Hair Styling', 'Trial Sessions', 'Mehendi'],
    icon: Heart,
    tags: ['bridal', 'makeup', 'glam'],
    accent: '#C4847A',
    size: 'normal',
  },
  {
    id: 'pamper',
    label: 'Pamper Me',
    subtitle: 'Relax and recharge',
    services: ['Massage', 'Hair Spa', 'Facials', 'Mani-Pedi'],
    icon: Flower2,
    tags: ['spa', 'massage', 'wellness', 'facial'],
    accent: '#C9A84C',
    size: 'normal',
  },
  {
    id: 'transform',
    label: 'Bold Transformation',
    subtitle: 'New look, new you',
    services: ['Hair Color', 'Balayage', 'Keratin', 'Complete Restyle'],
    icon: Zap,
    tags: ['color', 'cut', 'transformation'],
    accent: '#C4847A',
    size: 'normal',
  },
  // ── Center hero card ──
  {
    id: 'party',
    label: 'Party Ready',
    subtitle: 'Glam for the night',
    services: ['Glam Makeup', 'Blowout', 'Hair Styling', 'Lashes'],
    icon: Wine,
    tags: ['makeup', 'glam', 'hairstyling'],
    accent: '#C9A84C',
    size: 'hero',
  },
  // ── Right three ──
  {
    id: 'date',
    label: 'Date Night',
    subtitle: 'Effortlessly stunning',
    services: ['Soft Curls', 'Natural Makeup', 'Blowout', 'Styling'],
    icon: Moon,
    tags: ['makeup', 'hairstyling', 'glam'],
    accent: '#C4847A',
    size: 'normal',
  },
  {
    id: 'nails',
    label: 'Nail Goals',
    subtitle: 'Your next obsession',
    services: ['Gel Nails', 'Nail Art', 'Extensions', 'Chrome / BIAB'],
    icon: Sparkles,
    tags: ['nails', 'manicure', 'pedicure'],
    accent: '#C9A84C',
    size: 'normal',
  },
  {
    id: 'quick',
    label: 'Quick & Clean',
    subtitle: 'Freshen up fast',
    services: ['Eyebrows', 'Threading', 'Waxing', 'Express Grooming'],
    icon: Clock,
    tags: ['grooming', 'quick', 'waxing', 'threading'],
    accent: '#C4847A',
    size: 'normal',
  },
] as const;

function scoreSalon(salon: Salon, vibeTags: readonly string[]) {
  return salon.tags.filter((t) => (vibeTags as readonly string[]).includes(t)).length;
}

// ─── Vibe Card ────────────────────────────────────────────────────────────────

function VibeCard({
  vibe,
  onClick,
  index,
}: {
  vibe: typeof VIBES[number];
  onClick: () => void;
  index: number;
}) {
  const Icon    = vibe.icon;
  const isHero  = vibe.size === 'hero';

  return (
    <button
      onClick={onClick}
      className="group relative text-left transition-all duration-300 hover:-translate-y-2"
      style={{
        animation:      `vs-rise 0.5s ease-out ${index * 80}ms both`,
        gridColumn:     isHero ? 'auto' : 'auto',
        gridRow:        isHero ? 'span 1' : 'auto',
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background:   '#2D1B25',
          border:       `1px solid rgba(201,168,76,${isHero ? '0.5' : '0.2'})`,
          padding:      isHero ? '28px 24px' : '22px 20px',
          boxShadow:    isHero ? '0 0 40px rgba(201,168,76,0.12), inset 0 1px 0 rgba(201,168,76,0.15)' : 'none',
          height:       isHero ? '100%' : 'auto',
          minHeight:    isHero ? '220px' : '170px',
        }}
      >
        {/* Hero card top gradient */}
        {isHero && (
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        )}

        {/* Hover border glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ border: `1px solid ${vibe.accent}`, boxShadow: `inset 0 0 20px ${vibe.accent}15` }}
        />

        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: `${vibe.accent}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: vibe.accent }} />
        </div>

        {/* Label */}
        <h3
          className="font-display font-semibold mb-1"
          style={{
            color:    '#F5E6C8',
            fontSize: isHero ? '18px' : '15px',
          }}
        >
          {vibe.label}
        </h3>
        <p className="text-xs mb-4" style={{ color: '#C4847A' }}>{vibe.subtitle}</p>

        {/* Services list */}
        <ul className="space-y-1">
          {vibe.services.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: vibe.accent }} />
              <span className="text-xs" style={{ color: 'rgba(245,230,200,0.6)' }}>{s}</span>
            </li>
          ))}
        </ul>

        {/* Arrow */}
        <ArrowRight
          className="absolute bottom-5 right-5 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
          style={{ color: vibe.accent }}
        />

        {/* Hero card crown badge */}
        {isHero && (
          <div
            className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
          >
            Popular
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchCard({ salon, index, matchPct }: { salon: Salon; index: number; matchPct: number }) {
  return (
    <div
      className="relative bg-[#2D1B25] rounded-xl overflow-hidden"
      style={{
        border:    '1px solid rgba(201,168,76,0.2)',
        animation: `vs-rise 0.5s ease-out ${index * 120}ms both`,
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={salon.image}
          alt={salon.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80'; }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,10,15,0.9) 0%, transparent 55%)' }} />
        <div
          className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: '#C9A84C', color: '#1A0A0F' }}
        >
          {matchPct}% Match
        </div>
        {index === 0 && (
          <div
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(196,132,122,0.9)', color: '#fff' }}
          >
            Best Pick
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="text-[#F5E6C8] font-semibold mb-1">{salon.name}</h4>
        <div className="flex items-center justify-between text-xs text-[#C4847A] mb-4">
          <span>{salon.area}</span>
          <span className="text-[#C9A84C] font-medium">★ {salon.rating} · {salon.price}</span>
        </div>
        <Link
          to={`/salon/${salon.id}`}
          className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #A8832A)',
            color:      '#1A0A0F',
          }}
        >
          View Salon
        </Link>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function VibeMatcher() {
  const [selectedVibe, setSelectedVibe] = useState<typeof VIBES[number] | null>(null);

  const matches = selectedVibe
    ? [...SALONS]
        .map((s) => ({ ...s, score: scoreSalon(s, selectedVibe.tags) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];

  return (
    <section className="py-20 px-4" style={{ background: '#1A0A0F' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <p className="text-center text-[#C4847A] text-xs uppercase tracking-[0.35em] mb-2 font-medium">
          What Brings You In Today?
        </p>
        <h2 className="text-center font-display text-3xl md:text-4xl text-[#C9A84C] mb-2">
          Choose Your Vibe
        </h2>
        <p className="text-center text-[#F5E6C8]/40 text-sm mb-12">
          We'll match you with salons that fit perfectly
        </p>

        {/* ── Vibe grid — symmetrical 3 + 1 center + 3 ── */}
        {!selectedVibe ? (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows:    'auto auto',
            }}
          >
            {/* Row 1: first 4 vibes (left 3 normal + hero center-ish) */}
            {VIBES.slice(0, 4).map((vibe, i) => (
              <VibeCard key={vibe.id} vibe={vibe} onClick={() => setSelectedVibe(vibe)} index={i} />
            ))}
            {/* Row 2: last 3 vibes + empty cell for alignment */}
            <div /> {/* spacer left */}
            {VIBES.slice(4).map((vibe, i) => (
              <VibeCard key={vibe.id} vibe={vibe} onClick={() => setSelectedVibe(vibe)} index={i + 4} />
            ))}
          </div>
        ) : (

          /* ── Match results ── */
          <div style={{ animation: 'vs-fadeIn 0.4s ease-out' }}>

            {/* Result header */}
            <div
              className="flex items-center justify-between mb-8 p-5 rounded-2xl"
              style={{ background: '#2D1B25', border: '1px solid rgba(201,168,76,0.2)' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${selectedVibe.accent}20` }}
                >
                  <selectedVibe.icon className="w-5 h-5" style={{ color: selectedVibe.accent }} />
                </div>
                <div>
                  <p className="text-[#C4847A] text-xs uppercase tracking-widest mb-0.5">Best matches for</p>
                  <h3 className="text-[#C9A84C] font-display text-xl">{selectedVibe.label}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedVibe(null)}
                className="flex items-center gap-1.5 text-[#F5E6C8]/50 hover:text-[#F5E6C8] text-sm transition-colors"
              >
                <X className="w-4 h-4" /> Change vibe
              </button>
            </div>

            {/* Match cards */}
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {matches.map((salon, i) => (
                <MatchCard
                  key={salon.id}
                  salon={salon}
                  index={i}
                  matchPct={Math.min(99, 70 + salon.score * 9)}
                />
              ))}
            </div>

            {/* CTA to AI concierge */}
            <div
              className="text-center py-6 rounded-2xl"
              style={{ background: '#2D1B25', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <p className="text-[#F5E6C8]/50 text-sm mb-3">
                Want something more personalised?
              </p>
              <Link
                to="/concierge"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                Talk to our AI Concierge <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes vs-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes vs-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}