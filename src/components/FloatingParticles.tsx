import { useMemo } from 'react';

const COLORS = ['#D6B67A', '#E5D0A2', '#C8A96B', '#F4E6C3'];
const DRIFTS = ['vs-drift-up', 'vs-drift-up-right', 'vs-drift-up-left'];

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const roll = Math.random();
    // Bigger across the board: small dust is now 4-7px instead of 2-4px
    const size = roll < 0.5 ? 4 + Math.random() * 3 : roll < 0.85 ? 7 + Math.random() * 3 : 11 + Math.random() * 3;
    const isLarge = size > 9;

    const duration = isLarge ? 22 + Math.random() * 12 : 14 + Math.random() * 12;
    const delay = -Math.random() * duration;
    const drift = DRIFTS[Math.floor(Math.random() * DRIFTS.length)];

    // Twinkle is now the default, not a 30% chance
    const twDuration = 2 + Math.random() * 2;
    const twDelay = Math.random() * 3;

    return {
      id: i,
      size,
      left: Math.random() * 100,
      baseOpacity: (isLarge ? 0.35 : 0.28) + Math.random() * 0.25,
      blur: isLarge ? 1 + Math.random() * 1.5 : Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      driftAnim: `${duration}s linear ${delay}s infinite ${drift}`,
      twinkleAnim: `${twDuration}s ease-in-out ${twDelay}s infinite vs-twinkle`,
    };
  });
}

export default function FloatingParticles({ count = 32 }: { count?: number }) {
  const particles = useMemo(() => generateParticles(count), [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            bottom: -20,
            animation: p.driftAnim,
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity: p.baseOpacity,
              filter: `blur(${p.blur}px)`,
              boxShadow: `0 0 ${p.size * 2.5}px ${p.size * 0.8}px ${p.color}`,
              animation: p.twinkleAnim,
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes vs-drift-up {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(0, -110vh); }
        }
        @keyframes vs-drift-up-right {
          0%   { transform: translate(0, 0); }
          50%  { transform: translate(25px, -55vh); }
          100% { transform: translate(55px, -110vh); }
        }
        @keyframes vs-drift-up-left {
          0%   { transform: translate(0, 0); }
          50%  { transform: translate(-25px, -55vh); }
          100% { transform: translate(-55px, -110vh); }
        }
        @keyframes vs-twinkle {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50%      { opacity: 1;   transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}