import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Crown, Send, Sparkles, Heart, Leaf, Scissors } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const promptChips = [
  'Bridal makeup under ₹5000',
  'Relaxing hair spa in Indiranagar',
  'Best balayage in Bangalore',
  'Quick haircut near Koramangala',
];

export default function AIConcierge() {
  const location = useLocation();
  const initialPrompt = location.state?.prompt || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    } else {
      setMessages([
        {
          role: 'assistant',
          content: 'Welcome to VelvetSeat AI Concierge! I am your personal beauty advisor for Bangalore. Tell me about your perfect salon experience, and I will find the ideal match for you.',
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  const generateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('bridal') || msg.includes('wedding')) {
      return 'For bridal services in Bangalore, I highly recommend The Bridal Studio in Koramangala and Aura Bridal Studio in Indiranagar. They specialize in stunning Indian bridal looks with packages starting from ₹15,000. Would you like me to show you their portfolios or help you book a trial session?';
    }
    if (msg.includes('hair spa') || msg.includes('relaxing') || msg.includes('spa')) {
      return 'Looking for relaxation? Luxe Salon & Spa in Indiranagar offers an incredible aromatherapy hair spa experience - their 75-minute treatment is pure bliss at ₹2,500. Silk & Shine in Jayanagar also has beautiful organic spa treatments. Should I check availability for this weekend?';
    }
    if (msg.includes('balayage') || msg.includes('color') || msg.includes('hair color')) {
      return 'For beautiful balayage and color work, Mane Attraction in JP Nagar is exceptional - their artists create the most natural, sun-kissed looks from ₹6,000. The Crown Jewel on MG Road offers premium color services for a luxury experience. What shade are you dreaming of?';
    }
    if (msg.includes('quick') || msg.includes('haircut') || msg.includes('efficient')) {
      return 'For quick, efficient services, Radiance Beauty Lounge in HSR Layout offers express haircuts from just ₹800 with same-day appointments available. Serendipity Salon is also great for when you need to look your best in a hurry. When would you like to visit?';
    }
    if (msg.includes('nail') || msg.includes('manicure') || msg.includes('pedicure')) {
      return 'Velvet Touch in Koramangala is your destination for stunning nail art - from gel extensions to intricate crystal designs starting at ₹2,000. Glow & Co. in Whitefield also offers great manicure services. Looking for something specific?';
    }
    if (msg.includes('grooming') || msg.includes('men')) {
      return 'For mens grooming, Glow & Co. in Whitefield offers a premium grooming package with haircut, beard trim, and facial from ₹2,500. The experience is luxurious and efficient. Want me to find an appointment?';
    }
    if (msg.includes('facial') || msg.includes('skincare') || msg.includes('skin')) {
      return 'For glowing skin, Glow & Co. offers the rejuvenating Diamond Facial at ₹5,000 and HydraFacial from ₹3,500. If you prefer organic treatments, Silk & Shine has a wonderful herbal facial at ₹2,000. What is your skin type or concern?';
    }
    if (msg.includes('indiranagar')) {
      return 'Indiranagar has some gems! Luxe Salon & Spa is the premium choice for bridal and hair services. Aura Bridal Studio specializes in wedding looks. Radiance Beauty Lounge offers affordable luxury. What service are you looking for?';
    }
    if (msg.includes('koramangala')) {
      return 'Koramangala offers amazing options - The Bridal Studio is renowned for bridal work, Velvet Touch has beautiful nail art, and The Crown Jewel is perfect for celebrity-level experiences. What brings you here today?';
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return 'Hello! I am delighted to help you find the perfect salon experience in Bangalore. Tell me about your preferences - are you looking for bridal services, a relaxing spa day, a new hairstyle, or something else entirely?';
    }
    return 'That sounds lovely! Based on what you have shared, I would recommend exploring Luxe Salon & Spa in Indiranagar or The Crown Jewel on MG Road for a premium experience. Would you like me to show you available services and help you book? Or tell me more about what you are looking for!';
  };

  const handleSend = (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        role: 'assistant',
        content: generateResponse(text),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 pb-24">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-[#1A0A0F] border-b border-[#C9A84C]/20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-[#C9A84C]" />
            <h1 className="font-display text-xl text-[#C9A84C]">
              VelvetSeat AI Concierge
            </h1>
          </div>
          <p className="text-[#C4847A] text-sm">Your personal beauty advisor</p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full px-4 py-6">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[#C9A84C] text-[#1A0A0F] animate-slide-in-right'
                    : 'bg-[#2D1B25] text-[#F5E6C8] animate-slide-in-left'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span className="text-[#C9A84C] text-xs font-medium">AI</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-bounce-in">
              <div className="bg-[#2D1B25] rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A0A0F] via-[#1A0A0F] to-transparent pt-6 z-40">
        <div className="max-w-3xl mx-auto px-4">
          {/* Prompt chips */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {promptChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 text-sm border border-[#C4847A] text-[#C4847A] rounded-full hover:bg-[#C4847A]/10 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="flex items-center gap-2 bg-[#2D1B25] border border-[#C4847A]/30 rounded-full px-4 py-2 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your perfect salon experience..."
              className="flex-1 bg-transparent text-[#F5E6C8] placeholder-[#C4847A]/50 outline-none text-sm"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              <Send className="w-5 h-5 text-[#1A0A0F]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
