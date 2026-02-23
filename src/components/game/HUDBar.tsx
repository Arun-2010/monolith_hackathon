import { useGameStore } from '@/store/gameStore';
import { Shield, Zap } from 'lucide-react';

export default function HUDBar() {
  const { level, xp, totalCaptures } = useGameStore();
  const xpInLevel = xp % 100;

  return (
    <div className="flex items-center justify-between px-4 py-2 safe-area-top"
         style={{
           background: 'linear-gradient(180deg, hsl(var(--cyber-darker) / 0.95), transparent)',
         }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="hud-text text-primary">LVL {level}</p>
          <div className="w-16 h-1 rounded-full bg-muted mt-0.5">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${xpInLevel}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-neon-purple" />
          <span className="hud-text text-neon-purple">{xp} XP</span>
        </div>
        <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
          <span className="hud-text text-primary">{totalCaptures} 🪙</span>
        </div>
      </div>
    </div>
  );
}
