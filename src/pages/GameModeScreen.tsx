import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import GlassCard from '@/components/game/GlassCard';
import NeonButton from '@/components/game/NeonButton';
import TokenCard from '@/components/game/TokenCard';
import RiskGauge from '@/components/game/RiskGauge';
import HUDBar from '@/components/game/HUDBar';
import ParticleBackground from '@/components/game/ParticleBackground';
import { generateRandomToken, analyzeToken, AnalysisResult } from '@/services/aiService';
import { useGameStore } from '@/store/gameStore';

interface GameToken {
  id: string;
  name: string;
  symbol: string;
  hue: number;
}

export default function GameModeScreen() {
  const navigate = useNavigate();
  const { addXP, addScanResult } = useGameStore();
  const [tokens, setTokens] = useState<GameToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<GameToken | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Generate initial tokens
    setTokens(Array.from({ length: 6 }, () => generateRandomToken()));
  }, []);

  const handleAnalyze = useCallback(async (token: GameToken) => {
    setSelectedToken(token);
    setAnalyzing(true);
    setResult(null);
    const res = await analyzeToken(token.name);
    setResult(res);
    setAnalyzing(false);
    addXP(10);
    addScanResult({
      tokenName: res.tokenName,
      riskScore: res.riskScore,
      category: res.category,
      confidence: res.confidence,
      reasons: res.reasons,
      scannedAt: Date.now(),
    });
  }, []);

  const refreshTokens = () => {
    setTokens(Array.from({ length: 6 }, () => generateRandomToken()));
    setSelectedToken(null);
    setResult(null);
  };

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

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold neon-text-purple">GAME MODE</h2>
            <button onClick={refreshTokens} className="hud-text text-secondary underline">REFRESH</button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">Tap a token card to analyze it with AI.</p>

          <div className="grid grid-cols-1 gap-3">
            {tokens.map((token, i) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <TokenCard
                  name={token.name}
                  symbol={token.symbol}
                  hue={token.hue}
                  onClick={() => handleAnalyze(token)}
                />
              </motion.div>
            ))}
          </div>

          {/* Analysis modal */}
          <AnimatePresence>
            {selectedToken && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
                onClick={() => { if (!analyzing) { setSelectedToken(null); setResult(null); }}}
              >
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GlassCard className="rounded-b-none p-6 border-t-2 border-t-primary/30 safe-area-bottom">
                    <div className="w-12 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{selectedToken.name}</h3>
                    <p className="hud-text text-muted-foreground mb-4">${selectedToken.symbol}</p>
                    
                    {analyzing && (
                      <div className="flex flex-col items-center py-8">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="hud-text text-primary mt-3">RUNNING AI ANALYSIS...</p>
                      </div>
                    )}

                    {result && !analyzing && (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <RiskGauge score={result.riskScore} category={result.category} size={160} />
                        </div>
                        <div className="space-y-2">
                          {result.reasons.slice(0, 3).map((r, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span className={result.category === 'SAFE' ? 'text-safe' : 'text-danger'}>
                                {result.category === 'SAFE' ? '✓' : '⚠'}
                              </span>
                              <span className="text-foreground/80">{r}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-center hud-text text-primary">+10 XP</p>
                        <NeonButton fullWidth onClick={() => { setSelectedToken(null); setResult(null); }}>
                          CLOSE
                        </NeonButton>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
