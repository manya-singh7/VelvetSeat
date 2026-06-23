import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check, Calendar, Home, Download } from 'lucide-react';

interface BookingState {
  salonName: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
}

export default function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state as BookingState | null;
  const [animationPhase, setAnimationPhase] = useState<'circle' | 'check' | 'done'>('circle');

  useEffect(() => {
    const circleTimer = setTimeout(() => setAnimationPhase('check'), 400);
    const checkTimer = setTimeout(() => setAnimationPhase('done'), 1000);
    return () => {
      clearTimeout(circleTimer);
      clearTimeout(checkTimer);
    };
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#F5E6C8] mb-4">No booking information found.</p>
          <Link
            to="/"
            className="text-[#C9A84C] hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const generateCalendarEvent = () => {
    const startDate = new Date(`${booking.date}T${booking.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour appointment

    const event = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//VelvetSeat//EN
BEGIN:VEVENT
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${booking.serviceName} at ${booking.salonName}
DESCRIPTION:Booked via VelvetSeat
LOCATION:${booking.salonName}, Bangalore
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'velvetseat-appointment.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        {/* Animated checkmark */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            {/* Circle */}
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: animationPhase === 'circle' ? 283 : 0,
                  transition: 'stroke-dashoffset 0.4s ease-out',
                }}
              />
            </svg>

            {/* Checkmark */}
            <svg
              className="absolute inset-0 w-24 h-24"
              viewBox="0 0 100 100"
              style={{
                opacity: animationPhase === 'check' || animationPhase === 'done' ? 1 : 0,
                transition: 'opacity 0.2s ease-out',
              }}
            >
              <path
                d="M30 52 L45 67 L70 37"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 50,
                  strokeDashoffset: animationPhase === 'check' ? 50 : 0,
                  transition: 'stroke-dashoffset 0.6s ease-out',
                }}
              />
            </svg>
          </div>
        </div>

        {/* Success message */}
        <h1 className="font-display text-3xl text-[#C9A84C] mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-[#F5E6C8]/70 mb-8">
          Your appointment has been booked successfully
        </p>

        {/* Booking details card */}
        <div className="bg-[#2D1B25] rounded-xl p-6 mb-6 text-left border border-[#C9A84C]/20">
          <div className="space-y-4">
            <div>
              <p className="text-[#C4847A] text-sm mb-1">Salon</p>
              <p className="text-[#F5E6C8] font-medium">{booking.salonName}</p>
            </div>
            <div>
              <p className="text-[#C4847A] text-sm mb-1">Service</p>
              <p className="text-[#F5E6C8] font-medium">{booking.serviceName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#C4847A] text-sm mb-1">Date</p>
                <p className="text-[#F5E6C8] font-medium">{formatDate(booking.date)}</p>
              </div>
              <div>
                <p className="text-[#C4847A] text-sm mb-1">Time</p>
                <p className="text-[#F5E6C8] font-medium">{formatTime(booking.time)}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-[#C9A84C]/20">
              <div className="flex justify-between items-center">
                <p className="text-[#C4847A]">Total</p>
                <p className="text-[#C9A84C] text-2xl font-semibold">
                  ₹{booking.price?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={generateCalendarEvent}
            className="w-full py-3.5 bg-[#C9A84C] text-[#1A0A0F] font-medium rounded-xl hover:bg-[#C9A84C]/90 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Add to Calendar
          </button>
          <Link
            to="/"
            className="block w-full py-3.5 border border-[#F5E6C8]/30 text-[#F5E6C8] rounded-xl hover:bg-[#F5E6C8]/5 transition-colors text-center"
          >
            <span className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </span>
          </Link>
        </div>

        {/* Confirmation note */}
        <p className="mt-6 text-[#F5E6C8]/50 text-sm">
          A confirmation SMS will be sent to your phone number
        </p>
      </div>
    </div>
  );
}
