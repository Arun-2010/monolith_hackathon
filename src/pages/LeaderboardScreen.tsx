import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import GlassCard from '@/components/game/GlassCard';
import HUDBar from '@/components/game/HUDBar';
import ParticleBackground from '@/components/game/ParticleBackground';
import { LEADERBOARD_DATA } from '@/services/aiService';
import { useGameStore } from '@/store/gameStore';

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const { username, level, xp, totalCaptures, accuracy } = useGameStore();

  const rankIcons = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen cyber-gradient relative">
      <ParticleBackground />
      <div className="scan-line" />
      <div className="relative z-10 pb-24">
        <HUDBar />
        
        <div className="px-4 pt-2">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-muted-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> <span className="hud-text">BACK</span>
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-neon-purple" />
            <h2 className="font-display text-xl font-bold neon-text-purple">LEADERBOARD</h2>
          </div>

          {/* Your rank */}
          <GlassCard glow="green" className="mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-sm">
                #?
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-foreground">{username}</p>
                <p className="hud-text text-muted-foreground">LVL {level} · {xp} XP</p>
              </div>
              <span className="hud-text text-primary">{totalCaptures} captures</span>
            </div>
          </GlassCard>

          {/* Leaderboard list */}
          <div className="space-y-2">
            {LEADERBOARD_DATA.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className={i < 3 ? 'border-neon-purple/20' : ''}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center">
                      {i < 3 ? (
                        <span className="text-lg">{rankIcons[i]}</span>
                      ) : (
                        <span className="font-display font-bold text-muted-foreground text-sm">#{entry.rank}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-sm font-semibold text-foreground">{entry.name}</p>
                      <p className="hud-text text-muted-foreground">LVL {entry.level} · {entry.accuracy}% ACC</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-bold text-secondary">{entry.xp} XP</p>
                      <p className="hud-text text-muted-foreground">{entry.captures} 🪙</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
