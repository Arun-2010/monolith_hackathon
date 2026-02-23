import { motion } from 'framer-motion';

interface RiskGaugeProps {
  score: number;
  size?: number;
  category: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
}

export default function RiskGauge({ score, size = 140, category }: RiskGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  const color = category === 'SAFE'
    ? 'hsl(var(--neon-green))'
    : category === 'SUSPICIOUS'
    ? 'hsl(var(--warning))'
    : 'hsl(var(--danger))';

  const glowColor = category === 'SAFE'
    ? 'var(--glow-green)'
    : category === 'SUSPICIOUS'
    ? '0 0 20px hsl(40 100% 55% / 0.5)'
    : 'var(--glow-red)';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        <path
          d={`M 8 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <motion.path
          d={`M 8 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(${glowColor})` }}
        />
        <text
          x={size / 2}
          y={size / 2 - 5}
          textAnchor="middle"
          fill={color}
          fontSize="28"
          fontFamily="var(--font-display)"
          fontWeight="bold"
        >
          {score}
        </text>
      </svg>
      <span
        className="font-display text-sm font-bold tracking-widest uppercase"
        style={{ color }}
      >
        {category}
      </span>
    </div>
  );
}
