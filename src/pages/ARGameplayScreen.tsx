import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Crosshair, Zap } from 'lucide-react';
import RadarWidget from '@/components/game/RadarWidget';
import RiskGauge from '@/components/game/RiskGauge';
import NeonButton from '@/components/game/NeonButton';
import { generateRandomToken, analyzeToken, AnalysisResult } from '@/services/aiService';
import { useGameStore } from '@/store/gameStore';

interface ARToken {
  id: string;
  name: string;
  symbol: string;
  hue: number;
  x: number;
  y: number;
  distance: number;
  visible: boolean;
}

export default function ARGameplayScreen() {
  const navigate = useNavigate();
  const { addXP, captureToken } = useGameStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [arTokens, setArTokens] = useState<ARToken[]>([]);
  const [capturing, setCapturing] = useState<string | null>(null);
  const [capturedResult, setCapturedResult] = useState<{ token: ARToken; analysis: AnalysisResult } | null>(null);
  const [hunting, setHunting] = useState(false);
  const spawnInterval = useRef<NodeJS.Timeout | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      setCameraError(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((t) => t.stop());
    setCameraActive(false);
  }, []);

  const startHunt = useCallback(() => {
    setHunting(true);
    startCamera();

    // Spawn tokens periodically
    spawnInterval.current = setInterval(() => {
      const t = generateRandomToken();
      const newToken: ARToken = {
        ...t,
        x: 10 + Math.random() * 70,
        y: 15 + Math.random() * 55,
        distance: Math.floor(10 + Math.random() * 90),
        visible: true,
      };
      setArTokens((prev) => [...prev.filter((t) => t.visible).slice(-4), newToken]);
    }, 3000);
  }, [startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (spawnInterval.current) clearInterval(spawnInterval.current);
    };
  }, []);

  const handleCapture = useCallback(async (token: ARToken) => {
    setCapturing(token.id);
    // Vibrate if available
    if (navigator.vibrate) navigator.vibrate(100);
    
    // Hide token
    setArTokens((prev) => prev.map((t) => (t.id === token.id ? { ...t, visible: false } : t)));

    const analysis = await analyzeToken(token.name);
    
    captureToken({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      riskScore: analysis.riskScore,
      category: analysis.category,
      capturedAt: Date.now(),
      xpEarned: 20,
      imageHue: token.hue,
    });
    addXP(20);
    
    setCapturedResult({ token, analysis });
    setCapturing(null);
  }, []);

  const dismissResult = () => setCapturedResult(null);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Camera fallback gradient */}
      {!cameraActive && (
        <div className="absolute inset-0 cyber-gradient">
          <div className="scan-line" />
        </div>
      )}

      {/* AR Overlay */}
      <div className="absolute inset-0 z-10">
        {/* Top HUD */}
        <div className="safe-area-top px-4 pt-2 flex items-center justify-between"
             style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
          <button onClick={() => { stopCamera(); navigate('/'); }} className="w-10 h-10 rounded-full bg-black/50 border border-border/50 flex items-center justify-center">
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary" />
            <span className="hud-text text-primary">AR HUNT MODE</span>
          </div>
          <div className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
            <span className="hud-text text-primary">{arTokens.filter(t => t.visible).length} 🪙</span>
          </div>
        </div>

        {/* Scanning frame */}
        {hunting && (
          <div className="absolute inset-12 border border-primary/20 rounded-3xl pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-2xl" />
            
            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        {/* Floating tokens */}
        <AnimatePresence>
          {arTokens.filter(t => t.visible).map((token) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              exit={{ opacity: 0, scale: 3 }}
              transition={{ y: { duration: 2, repeat: Infinity } }}
              className="absolute z-20"
              style={{ left: `${token.x}%`, top: `${token.y}%` }}
              onClick={() => handleCapture(token)}
            >
              <motion.div
                whileTap={{ scale: 1.5 }}
                className="relative cursor-pointer"
              >
                {/* Pulse ring */}
                <motion.div
                  className="absolute -inset-4 rounded-full border border-primary/30"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                
                {/* Token icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-sm backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, hsl(${token.hue} 80% 50% / 0.4), hsl(${token.hue} 80% 30% / 0.6))`,
                    border: `1px solid hsl(${token.hue} 80% 50% / 0.5)`,
                    color: `hsl(${token.hue} 80% 80%)`,
                    boxShadow: `0 0 20px hsl(${token.hue} 80% 50% / 0.3)`,
                  }}
                >
                  {token.symbol.substring(0, 2)}
                </div>
                
                {/* Distance */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="hud-text text-foreground bg-black/60 px-1.5 py-0.5 rounded text-[9px]">
                    {token.distance}m
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 safe-area-bottom px-4 pb-4"
             style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
          {!hunting ? (
            <div className="text-center space-y-4 py-8">
              {cameraError ? (
                <>
                  <p className="text-sm text-muted-foreground">Camera not available.</p>
                  <p className="text-xs text-muted-foreground">The hunt will use simulated AR mode.</p>
                </>
              ) : null}
              <NeonButton fullWidth size="lg" onClick={startHunt} icon={<Crosshair className="w-5 h-5" />}>
                START AR HUNT
              </NeonButton>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <RadarWidget tokenCount={arTokens.filter(t => t.visible).length} size={80} />
              <div className="text-center">
                <p className="hud-text text-muted-foreground mb-1">TAP TOKENS TO CAPTURE</p>
                {capturing && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hud-text text-primary animate-pulse"
                  >
                    CAPTURING...
                  </motion.p>
                )}
              </div>
              <div className="w-20" />
            </div>
          )}
        </div>
      </div>

      {/* Capture result modal */}
      <AnimatePresence>
        {capturedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-6"
            onClick={dismissResult}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card-glow p-6 rounded-2xl w-full max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-5xl mb-3"
              >
                🪙
              </motion.div>
              <h3 className="font-display text-xl font-bold neon-text mb-1">TOKEN CAPTURED!</h3>
              <p className="text-foreground font-semibold">{capturedResult.token.name}</p>
              <p className="hud-text text-muted-foreground mb-4">${capturedResult.token.symbol}</p>
              
              <RiskGauge
                score={capturedResult.analysis.riskScore}
                category={capturedResult.analysis.category}
                size={120}
              />
              
              <div className="mt-4 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-neon-purple" />
                <span className="font-display text-lg font-bold text-secondary">+20 XP</span>
              </div>
              
              <div className="mt-4">
                <NeonButton fullWidth onClick={dismissResult}>
                  CONTINUE HUNT
                </NeonButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
