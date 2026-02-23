import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, ArrowLeft } from 'lucide-react';
import GlassCard from '@/components/game/GlassCard';
import NeonButton from '@/components/game/NeonButton';
import RiskGauge from '@/components/game/RiskGauge';
import HUDBar from '@/components/game/HUDBar';
import ParticleBackground from '@/components/game/ParticleBackground';
import { analyzeToken, AnalysisResult } from '@/services/aiService';
import { useGameStore } from '@/store/gameStore';

export default function ScannerScreen() {
  const navigate = useNavigate();
  const { addXP, addScanResult } = useGameStore();
  const [tokenInput, setTokenInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleScan = useCallback(async () => {
    if (!tokenInput.trim()) return;
    setScanning(true);
    setResult(null);
    try {
      const res = await analyzeToken(tokenInput.trim());
      setResult(res);
      addXP(10);
      addScanResult({
        tokenName: res.tokenName,
        riskScore: res.riskScore,
        category: res.category,
        confidence: res.confidence,
        reasons: res.reasons,
        scannedAt: Date.now(),
      });
    } finally {
      setScanning(false);
    }
  }, [tokenInput]);

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
          
          <h2 className="font-display text-xl font-bold neon-text mb-4">AI SCAM SCANNER</h2>

          {/* Input */}
          <GlassCard glow="green" className="mb-4">
            <label className="hud-text text-muted-foreground block mb-2">TOKEN NAME OR CONTRACT</label>
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. SafeMoon, 0x1234..."
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            />
          </GlassCard>

          <NeonButton
            fullWidth
            size="lg"
            disabled={scanning || !tokenInput.trim()}
            onClick={handleScan}
            icon={scanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          >
            {scanning ? 'ANALYZING...' : 'SCAN TOKEN'}
          </NeonButton>

          {/* Scanning animation */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-12"
              >
                <div className="relative w-24 h-24">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/50"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  />
                  <div className="absolute inset-0 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center">
                    <Search className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <p className="hud-text text-primary mt-4 animate-pulse">ANALYZING SMART CONTRACT...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && !scanning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4"
              >
                <GlassCard glow={result.category === 'SAFE' ? 'green' : 'none'} className="text-center py-6">
                  <p className="hud-text text-muted-foreground mb-3">RISK ASSESSMENT</p>
                  <RiskGauge score={result.riskScore} category={result.category} />
                  <p className="text-sm text-muted-foreground mt-3">
                    Confidence: <span className="text-foreground font-semibold">{result.confidence}%</span>
                  </p>
                </GlassCard>

                <GlassCard>
                  <p className="hud-text text-muted-foreground mb-3">RISK FACTORS</p>
                  <div className="space-y-2">
                    {result.reasons.map((reason, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <span className={result.category === 'SAFE' ? 'text-safe' : 'text-danger'}>
                          {result.category === 'SAFE' ? '✓' : '⚠'}
                        </span>
                        <span className="text-sm text-foreground/80">{reason}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                <p className="text-center hud-text text-primary">+10 XP EARNED</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
