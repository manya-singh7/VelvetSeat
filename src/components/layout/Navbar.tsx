import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { label: 'Home',         to: '/' },
    { label: 'Explore',      to: '/explore' },
    { label: 'AI Concierge', to: '/concierge' },
    { label: 'List Your Business', to: '/list-business' },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background:   scrolled ? 'rgba(26, 10, 15, 0.85)'  : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)'             : 'none',
        borderBottom: scrolled ? '1px solid rgba(201, 168, 76, 0.2)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Crown
            className="w-5 h-5 text-[#C9A84C] transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-display text-xl font-bold text-[#C9A84C] tracking-wide">
            VelvetSeat
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-all duration-200 relative group ${
                isActive(link.to)
                  ? 'text-[#C9A84C]'
                  : 'text-[#F5E6C8]/70 hover:text-[#F5E6C8]'
              }`}
            >
              {link.label}
              {/* Gold underline on active / hover */}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-[#C9A84C] transition-all duration-300 ${
                  isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}

          {/* Book Now CTA */}
          <Link
            to="/concierge"
            className="px-5 py-2 bg-[#C9A84C] text-[#1A0A0F] text-sm font-semibold rounded-full hover:bg-[#C9A84C]/85 active:scale-95 transition-all duration-200"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#C9A84C] p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1A0A0F]/95 backdrop-blur-xl border-t border-[#C9A84C]/20 px-4 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base font-medium transition-colors ${
                isActive(link.to) ? 'text-[#C9A84C]' : 'text-[#F5E6C8]/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/concierge"
            className="w-full text-center py-3 bg-[#C9A84C] text-[#1A0A0F] font-semibold rounded-full"
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}