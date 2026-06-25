import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Star,
  MapPin,
  Phone,
  Clock,
  ChevronLeft,
  Calendar,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface Salon {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  phone: string;
  rating: number;
  review_count: number;
  price_tier: number;
  hero_image: string;
  is_open: boolean;
  ai_summary: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  duration_minutes: number;
  price: number;
  description: string;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface LookbookItem {
  id: string;
  image_url: string;
  style_name: string;
  price: number;
}

export default function SalonProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lookbook, setLookbook] = useState<LookbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (salonId: string) => {
    try {
      const [salonRes, servicesRes, reviewsRes, lookbookRes] = await Promise.all([
        supabase.from('salons').select('*').eq('id', salonId).single(),
        supabase.from('services').select('*').eq('salon_id', salonId),
        supabase.from('reviews').select('*').eq('salon_id', salonId).limit(4),
        supabase.from('stylist_lookbook').select('*').eq('salon_id', salonId),
      ]);

      if (salonRes.data) setSalon(salonRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data);
      if (lookbookRes.data) setLookbook(lookbookRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!salon || !selectedService || !bookingDate || !bookingTime || !customerName || !customerPhone) return;

    setBookingLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        salon_id: salon.id,
        service_id: selectedService.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        booking_date: bookingDate,
        booking_time: bookingTime,
        status: 'confirmed',
      });

      if (error) throw error;

      setShowBookingModal(false);
      setCustomerName('');
      setCustomerPhone('');
      setBookingDate('');
      setBookingTime('');
      setSelectedService(null);

      navigate('/booking-confirmation', {
        state: {
          salonName: salon.name,
          serviceName: selectedService.name,
          date: bookingDate,
          time: bookingTime,
          price: selectedService.price,
        },
      });
    } catch (err) {
        console.error("Booking error:", err);
      } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#F5E6C8]">Salon not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero with Parallax */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-[120%]"
          style={{
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        >
          <img
            src={salon.hero_image}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0A0F]/40 via-[#1A0A0F]/60 to-[#1A0A0F]" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-[#F5E6C8]/80 hover:text-[#C9A84C] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="font-display text-3xl md:text-5xl text-[#C9A84C] mb-2">
            {salon.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-[#C4847A]/20 text-[#C4847A] text-sm rounded-full">
              {salon.neighborhood}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-[#C9A84C] fill-[#C9A84C]" />
              <span className="text-[#C9A84C] font-medium">{salon.rating}</span>
              <span className="text-[#F5E6C8]/60 text-sm">
                ({salon.review_count} reviews)
              </span>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                salon.is_open
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {salon.is_open ? 'Open Now' : 'Closed'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#F5E6C8]/80 text-sm">
            <MapPin className="w-4 h-4 text-[#C4847A]" />
            <span>{salon.address}</span>
          </div>
        </div>
      </section>

      {/* AI Summary */}
      <section className="py-8 px-4 max-w-4xl mx-auto">
        <div className="bg-[#2D1B25] border-l-4 border-[#C9A84C] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-[#C9A84C] font-medium">AI Summary</span>
          </div>
          <p className="text-[#F5E6C8] italic">{salon.ai_summary}</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 px-4 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl text-[#C9A84C] mb-6">Services</h2>
        <div className="bg-[#2D1B25] rounded-xl overflow-hidden">
          {services.map((service, idx) => (
            <div
              key={service.id}
              onClick={() => {
                setSelectedService(service);
                setShowBookingModal(true);
              }}
              className="p-5 cursor-pointer hover:bg-[#C9A84C]/10 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-[#F5E6C8] font-medium mb-1">{service.name}</h3>
                  <p className="text-[#F5E6C8]/60 text-sm mb-2">{service.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[#C4847A] text-sm">
                      <Clock className="w-4 h-4" />
                      {service.duration_minutes} mins
                    </span>
                    <span className="px-2 py-0.5 bg-[#C4847A]/20 text-[#C4847A] text-xs rounded">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <span className="text-[#C9A84C] text-xl font-semibold">
                    ₹{service.price.toLocaleString()}
                  </span>
                  <p className="text-[#F5E6C8]/50 text-xs mt-1">Click to book</p>
                </div>
              </div>
              {idx < services.length - 1 && (
                <div className="border-b border-[#C9A84C]/20 mt-5" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Stylist Lookbook */}
      {lookbook.length > 0 && (
        <section className="py-8 px-4 max-w-full overflow-hidden">
          <h2 className="font-display text-2xl text-[#C9A84C] mb-6 px-4 max-w-4xl mx-auto">
            Stylist Lookbook
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
            {lookbook.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-64 h-64 relative rounded-xl overflow-hidden group"
              >
                <img
                  src={item.image_url}
                  alt={item.style_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A0F] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-[#C9A84C] font-display text-lg">
                    {item.style_name}
                  </h3>
                  <p className="text-[#F5E6C8] font-medium">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-8 px-4 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl text-[#C9A84C] mb-6">
          Customer Reviews
        </h2>
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#2D1B25] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[#F5E6C8] font-medium">{review.user_name}</h3>
                  <p className="text-[#F5E6C8]/50 text-sm">
                    {formatDate(review.created_at)}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-[#C9A84C] fill-[#C9A84C]'
                          : 'text-[#F5E6C8]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[#F5E6C8]/80">{review.review_text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-8 px-4 max-w-4xl mx-auto">
        <div className="bg-[#2D1B25] rounded-xl p-5 flex items-center gap-4">
          <a
            href={`tel:${salon.phone}`}
            className="flex items-center gap-3 text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#F5E6C8]/60 text-xs">Call the salon</p>
              <p className="font-medium">{salon.phone}</p>
            </div>
          </a>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1A0A0F]/80 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          />
          <div className="relative bg-[#2D1B25] rounded-2xl p-6 w-full max-w-md border border-[#C9A84C]/30">
            <h2 className="font-display text-2xl text-[#C9A84C] mb-2">
              Book at {salon.name}
            </h2>
            <p className="text-[#F5E6C8]/80 mb-6">
              {selectedService.name} - ₹{selectedService.price.toLocaleString()}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[#F5E6C8]/60 text-sm block mb-1">Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1A0A0F] border border-[#C4847A]/30 rounded-lg px-4 py-2.5 text-[#F5E6C8] outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-[#F5E6C8]/60 text-sm block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#1A0A0F] border border-[#C4847A]/30 rounded-lg px-4 py-2.5 text-[#F5E6C8] outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="+91 9090909090"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#F5E6C8]/60 text-sm block mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-[#1A0A0F] border border-[#C4847A]/30 rounded-lg px-4 py-2.5 text-[#F5E6C8] outline-none focus:border-[#C9A84C] transition-colors"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-[#F5E6C8]/60 text-sm block mb-1">Time</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-[#1A0A0F] border border-[#C4847A]/30 rounded-lg px-4 py-2.5 text-[#F5E6C8] outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-2.5 border border-[#C4847A] text-[#C4847A] rounded-lg hover:bg-[#C4847A]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={bookingLoading || !customerName || !customerPhone || !bookingDate || !bookingTime}
                className="flex-1 py-2.5 bg-[#C9A84C] text-[#1A0A0F] font-medium rounded-lg hover:bg-[#C9A84C]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Book Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
