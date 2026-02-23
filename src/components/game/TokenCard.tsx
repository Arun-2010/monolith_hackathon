import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

interface TokenCardProps {
  name: string;
  symbol: string;
  riskScore?: number;
  category?: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  hue?: number;
  onClick?: () => void;
  compact?: boolean;
}

export default function TokenCard({ name, symbol, riskScore, category, hue = 160, onClick, compact }: TokenCardProps) {
  const categoryColor = category === 'SAFE'
    ? 'text-safe'
    : category === 'SUSPICIOUS'
    ? 'text-warning'
    : category === 'SCAM'
    ? 'text-danger'
    : 'text-muted-foreground';

  return (
    <GlassCard glow={category === 'SAFE' ? 'green' : category === 'SCAM' ? 'none' : 'none'} onClick={onClick}>
      <div className={`flex items-center gap-3 ${compact ? '' : 'py-1'}`}>
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0"
          style={{
            background: `linear-gradient(135deg, hsl(${hue} 80% 50% / 0.3), hsl(${hue} 80% 30% / 0.5))`,
            border: `1px solid hsl(${hue} 80% 50% / 0.3)`,
            color: `hsl(${hue} 80% 70%)`,
          }}
          whileHover={{ rotate: 10 }}
        >
          {symbol.substring(0, 2)}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm font-semibold text-foreground truncate">{name}</p>
          <p className="hud-text text-muted-foreground">${symbol}</p>
        </div>
        {riskScore !== undefined && (
          <div className="text-right shrink-0">
            <p className={`font-display font-bold text-lg ${categoryColor}`}>{riskScore}</p>
            {category && <p className={`hud-text ${categoryColor}`}>{category}</p>}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
