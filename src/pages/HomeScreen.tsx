import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Scan, Crosshair, Trophy, User } from 'lucide-react';
import GlassCard from '@/components/game/GlassCard';
import NeonButton from '@/components/game/NeonButton';
import XPBar from '@/components/game/XPBar';
import TokenCard from '@/components/game/TokenCard';
import RadarWidget from '@/components/game/RadarWidget';
import HUDBar from '@/components/game/HUDBar';
import ParticleBackground from '@/components/game/ParticleBackground';
import { useGameStore } from '@/store/gameStore';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { level, xp, totalScans, totalCaptures, capturedTokens, claimDailyLogin, streak } = useGameStore();
  const [showDaily, setShowDaily] = useState(false);

  useEffect(() => {
    const claimed = claimDailyLogin();
    if (claimed) setShowDaily(true);
  }, []);

  return (
    <div className="min-h-screen cyber-gradient relative">
      <ParticleBackground />
      <div className="scan-line" />
      <div className="relative z-10 pb-24">
        <HUDBar />
        
        <div className="px-4 pt-4 space-y-4">
          {/* Daily reward */}
          <AnimatePresence>
            {showDaily && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <GlassCard glow="purple" className="text-center">
                  <p className="hud-text text-neon-purple mb-1">DAILY LOGIN REWARD</p>
                  <p className="font-display text-2xl font-bold text-secondary">+5 XP</p>
                  <p className="text-sm text-muted-foreground mt-1">🔥 {streak} day streak</p>
                  <button
                    className="mt-2 text-xs text-muted-foreground underline"
                    onClick={() => setShowDaily(false)}
                  >
                    Dismiss
                  </button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center py-4"
          >
            <h1 className="font-display text-3xl font-bold neon-text mb-1">SCAMHUNTER</h1>
            <p className="hud-text text-muted-foreground">AI-POWERED CRYPTO THREAT DETECTION</p>
          </motion.div>

          {/* XP Bar */}
          <XPBar />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'SCANS', value: totalScans, icon: '🔍' },
              { label: 'CAPTURES', value: totalCaptures, icon: '🪙' },
              { label: 'LEVEL', value: level, icon: '⚡' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <GlassCard className="text-center py-3">
                  <span className="text-xl">{stat.icon}</span>
                  <p className="font-display text-xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="hud-text text-muted-foreground">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Main Actions */}
          <div className="space-y-3 pt-2">
            <NeonButton
              fullWidth
              variant="green"
              size="lg"
              icon={<Scan className="w-5 h-5" />}
              onClick={() => navigate('/scanner')}
            >
              AI SCAM SCANNER
            </NeonButton>

            <div className="grid grid-cols-2 gap-3">
              <NeonButton
                fullWidth
                variant="purple"
                icon={<Crosshair className="w-5 h-5" />}
                onClick={() => navigate('/ar')}
              >
                AR HUNT
              </NeonButton>
              <NeonButton
                fullWidth
                variant="purple"
                icon={<Shield className="w-5 h-5" />}
                onClick={() => navigate('/game')}
              >
                GAME MODE
              </NeonButton>
            </div>
          </div>

          {/* Radar */}
          <GlassCard glow="green" className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold text-foreground">Nearby Tokens</p>
              <p className="text-xs text-muted-foreground mt-0.5">Open AR Hunt to capture</p>
            </div>
            <RadarWidget tokenCount={3} size={80} />
          </GlassCard>

          {/* Recent captures */}
          {capturedTokens.length > 0 && (
            <div>
              <p className="hud-text text-muted-foreground mb-2">RECENT CAPTURES</p>
              <div className="space-y-2">
                {capturedTokens.slice(0, 3).map((t) => (
                  <TokenCard
                    key={t.id}
                    name={t.name}
                    symbol={t.symbol}
                    riskScore={t.riskScore}
                    category={t.category}
                    hue={t.imageHue}
                    compact
                    onClick={() => navigate(`/detail/${t.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
