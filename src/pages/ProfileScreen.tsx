import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Shield, Target, Zap, Award } from 'lucide-react';
import GlassCard from '@/components/game/GlassCard';
import XPBar from '@/components/game/XPBar';
import HUDBar from '@/components/game/HUDBar';
import ParticleBackground from '@/components/game/ParticleBackground';
import { useGameStore } from '@/store/gameStore';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { username, level, xp, totalScans, totalCaptures, accuracy, streak, capturedTokens, scanHistory } = useGameStore();

  const stats = [
    { icon: <Target className="w-4 h-4" />, label: 'Total Scans', value: totalScans },
    { icon: <Shield className="w-4 h-4" />, label: 'Captures', value: totalCaptures },
    { icon: <Zap className="w-4 h-4" />, label: 'Total XP', value: xp },
    { icon: <Award className="w-4 h-4" />, label: 'Accuracy', value: `${accuracy}%` },
  ];

  const scamsDetected = scanHistory.filter(s => s.category === 'SCAM').length;
  const safeFound = scanHistory.filter(s => s.category === 'SAFE').length;

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

          {/* Avatar + Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                 style={{
                   background: 'linear-gradient(135deg, hsl(var(--neon-green) / 0.2), hsl(var(--neon-purple) / 0.2))',
                   border: '2px solid hsl(var(--neon-green) / 0.3)',
                   boxShadow: 'var(--glow-green)',
                 }}>
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold neon-text">{username}</h2>
            <p className="hud-text text-muted-foreground mt-1">LEVEL {level} SCAM HUNTER</p>
            {streak > 0 && <p className="text-sm text-secondary mt-1">🔥 {streak} day streak</p>}
          </motion.div>

          <XPBar />

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <GlassCard className="text-center py-4">
                  <div className="flex items-center justify-center gap-1.5 text-primary mb-2">
                    {stat.icon}
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="hud-text text-muted-foreground">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Detection breakdown */}
          <GlassCard className="mt-4">
            <p className="hud-text text-muted-foreground mb-3">DETECTION BREAKDOWN</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-danger font-semibold">Scams Detected</span>
                  <span className="text-sm text-danger">{scamsDetected}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-danger" style={{ width: `${totalScans ? (scamsDetected / totalScans) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-safe font-semibold">Safe Tokens</span>
                  <span className="text-sm text-safe">{safeFound}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-safe" style={{ width: `${totalScans ? (safeFound / totalScans) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Inventory */}
          {capturedTokens.length > 0 && (
            <div className="mt-4">
              <p className="hud-text text-muted-foreground mb-2">INVENTORY ({capturedTokens.length})</p>
              <div className="grid grid-cols-4 gap-2">
                {capturedTokens.slice(0, 12).map((t) => (
                  <motion.div
                    key={t.id}
                    whileHover={{ scale: 1.1 }}
                    className="aspect-square rounded-xl flex items-center justify-center font-display text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, hsl(${t.imageHue} 80% 50% / 0.3), hsl(${t.imageHue} 80% 30% / 0.5))`,
                      border: `1px solid hsl(${t.imageHue} 80% 50% / 0.3)`,
                      color: `hsl(${t.imageHue} 80% 70%)`,
                    }}
                  >
                    {t.symbol.substring(0, 2)}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
