import VibeMatcher from '../components/home/VibeMatcher';
import HeroChair from '../components/home/HeroChair';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Scissors, Leaf, Crown, Star, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Salon {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  review_count: number;
  price_tier: number;       // 1 = ₹, 2 = ₹₹, 3 = ₹₹₹
  hero_image: string;
  ai_summary: string;
  categories: string[];     // ['hair', 'bridal', 'skin', 'nail', 'grooming']
}

interface HomeProps {
  salons?: Salon[];         // optional — component fetches its own data
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VIBES = [
  {
    id: 'bridal',
    title: 'Bridal Glow',
    subtitle: 'Wedding-ready transformations',
    description: 'Luxury bridal packages crafted for your special day',
    icon: Crown,
    prompt: 'I need a bridal makeup artist in Bangalore for my wedding. Looking for a luxury salon with experience in Indian bridal looks.',
  },
  {
    id: 'relax',
    title: 'Sunday Refresh',
    subtitle: 'Relax and reset',
    description: 'Pampering treatments to unwind and rejuvenate',
    icon: Leaf,
    prompt: 'I want a relaxing spa experience this weekend. Looking for a salon with great ambiance and hair spa or facial treatments.',
  },
  {
    id: 'transform',
    title: 'Bold Transformation',
    subtitle: 'New look, new you',
    description: 'Complete makeovers with cutting-edge styles',
    icon: Sparkles,
    prompt: 'I want a complete transformation — new hair color, cut, and style. Looking for a salon known for bold, creative looks.',
  },
  {
    id: 'quick',
    title: 'Quick & Clean',
    subtitle: 'Sharp and efficient',
    description: 'Fast, quality services when you are short on time',
    icon: Scissors,
    prompt: 'I need a quick haircut and styling today. Looking for an efficient salon with same-day appointments available.',
  },
];

const CATEGORIES = [
  { id: 'all',      label: 'All' },
  { id: 'hair',     label: 'Hair' },
  { id: 'bridal',   label: 'Bridal' },
  { id: 'skin',     label: 'Skin' },
  { id: 'nail',     label: 'Nail' },
  { id: 'grooming', label: 'Grooming' },
];

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home({ salons: initialSalons = [] }: HomeProps) {
  const navigate = useNavigate();

  const [searchQuery,     setSearchQuery]     = useState('');
  const [activeCategory,  setActiveCategory]  = useState('all');
  const [salons,          setSalons]          = useState<Salon[]>(initialSalons);
  const [loading,         setLoading]         = useState(initialSalons.length === 0);
  const [error,           setError]           = useState<string | null>(null);

  // Fetch salons whenever search or category changes (debounced 300ms)
  useEffect(() => {
    const controller = new AbortController();

    const fetchSalons = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          search:   searchQuery,
          category: activeCategory,
        });

        let query = supabase
            .from('salons')
            .select('*');

          if (searchQuery) {
            query = query.ilike('name', `%${searchQuery}%`);
          }

          const { data, error } = await query;

          if (error) throw error;

          console.log(data);
          setSalons(data || []);

          setSalons(data || []);

      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch salons:', err);
          setError('Could not load salons. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSalons, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, activeCategory]);

  const handleVibeClick = (vibe: typeof VIBES[0]) => {
    navigate('/concierge', { state: { prompt: vibe.prompt } });
  };

  return (
    <div className="min-h-screen bg-[#1A0A0F]">

    <HeroChair />

    <VibeMatcher />

      {/* ── Category Pills ──────────────────────────────────────────────────── */}
      <section className="py-4 px-4 max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-[#C9A84C] text-[#1A0A0F] shadow-[0_0_12px_#C9A84C50]'
                  : 'border border-[#C4847A] text-[#C4847A] hover:bg-[#C4847A]/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Salon Grid ──────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl text-[#C9A84C] mb-2 text-center">
          Top Salons in Bangalore
        </h2>
        <p className="text-[#C4847A] text-sm text-center mb-10">
          Curated by our AI concierge
        </p>

        {/* Error state */}
        {error && (
          <div className="text-center py-10">
            <p className="text-[#C4847A] mb-4">{error}</p>
            <button
              onClick={() => setActiveCategory(activeCategory)}
              className="px-6 py-2 border border-[#C9A84C] text-[#C9A84C] rounded-full hover:bg-[#C9A84C]/10 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && !error && (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 text-[#C9A84C] animate-spin" />
            <span className="text-[#C4847A] text-sm">Finding the finest salons…</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && salons.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#F5E6C8]/50 text-lg mb-2">No salons found</p>
            <p className="text-[#C4847A] text-sm">Try a different search or category</p>
          </div>
        )}

        {!loading && !error && salons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map((salon, index) => (
              <SalonCard
                key={salon.id}
                salon={salon}
                delay={index * 60}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

// ─── Vibe Card ────────────────────────────────────────────────────────────────

function VibeCard({
  vibe,
  onClick,
  delay,
}: {
  vibe: typeof VIBES[0];
  onClick: () => void;
  delay: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const Icon = vibe.icon;

  return (
    <div
      className="opacity-0 cursor-pointer"
      style={{ animation: `stagger-in 0.5s ease-out ${delay}ms forwards` }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={onClick}
    >
      {/* Perspective wrapper */}
      <div className="relative h-40" style={{ perspective: '1000px' }}>
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle:  'preserve-3d',
            transform:       flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 bg-[#2D1B25] border border-[#C9A84C]/60 rounded-xl p-5 flex flex-col items-center justify-center hover:border-[#C9A84C] transition-colors"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Icon className="w-9 h-9 text-[#C9A84C] mb-3" />
            <h3 className="font-display text-base text-[#C9A84C] mb-1 text-center">{vibe.title}</h3>
            <p className="text-xs text-[#C4847A] text-center">{vibe.subtitle}</p>
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 bg-[#C9A84C] rounded-xl p-5 flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform:          'rotateY(180deg)',
            }}
          >
            <p className="text-[#1A0A0F] font-semibold text-sm text-center leading-relaxed">
              {vibe.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Salon Card ───────────────────────────────────────────────────────────────

function SalonCard({ salon, delay }: { salon: Salon; delay: number }) {
  console.log("CARD:", salon);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x: y * 8, y: x * -8 });
  };

  return (
    <div
      className="opacity-0"
      style={{
        perspective: '1000px',
        animation:   `stagger-in 0.5s ease-out ${delay}ms forwards`,
      }}
    >
      <div
        className="relative bg-[#2D1B25] rounded-xl overflow-hidden transition-transform duration-300 cursor-pointer"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      >
        {/* Gold shimmer on hover */}
        {hovered && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent animate-shimmer" />
          </div>
        )}

        {/* Salon image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={salon.hero_image}
            alt={salon.name}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
            onError={(e) => {
              // Fallback if Unsplash image fails
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B25] via-transparent to-transparent" />

          {/* Price tier badge */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-[#1A0A0F]/80 backdrop-blur-sm rounded-full">
            <span className="text-[#C9A84C] font-bold text-sm">
              {'₹'.repeat(salon.price_tier || 1)}
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-5">
          {/* Name + rating row */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-display text-lg text-[#F5E6C8] leading-tight flex-1 mr-2">
              {salon.name}
            </h3>
            <div className="flex items-center flex-shrink-0">
              <Star className="w-4 h-4 text-[#C9A84C] fill-[#C9A84C]" />
              <span className="text-[#C9A84C] text-sm font-medium ml-1">{salon.rating || 4.5}</span>
            </div>
          </div>

          {/* Neighbourhood + review count */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 bg-[#C4847A]/20 text-[#C4847A] text-xs rounded-full">
              {salon.neighborhood}
            </span>
            <span className="text-[#F5E6C8]/40 text-xs">
              {salon.review_count || 0} reviews
            </span>
          </div>

          {/* AI summary */}
          <p className="text-[#F5E6C8]/65 text-sm italic mb-5 line-clamp-2 leading-relaxed">
            {salon.ai_summary}
          </p>

          {/* CTA */}
          <Link
            to={`/salon/${salon.id}`}
            className="block w-full text-center py-2.5 bg-[#C9A84C] text-[#1A0A0F] font-semibold text-sm rounded-lg hover:bg-[#C9A84C]/85 active:scale-95 transition-all duration-200"
          >
            View Salon
          </Link>
        </div>
      </div>
    </div>
  );
}
