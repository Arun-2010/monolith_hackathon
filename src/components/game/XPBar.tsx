import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function XPBar() {
  const { xp, level } = useGameStore();
  const xpInLevel = xp % 100;
  const progress = xpInLevel / 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="hud-text text-muted-foreground">LVL {level}</span>
        <span className="hud-text text-muted-foreground">{xpInLevel}/100 XP</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--neon-green)), hsl(var(--neon-purple)))',
            boxShadow: '0 0 10px hsl(var(--neon-green) / 0.5)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
