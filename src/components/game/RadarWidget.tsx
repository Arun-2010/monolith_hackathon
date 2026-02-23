import { motion } from 'framer-motion';

interface RadarWidgetProps {
  tokenCount?: number;
  size?: number;
}

export default function RadarWidget({ tokenCount = 0, size = 100 }: RadarWidgetProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Radar circles */}
      <div className="absolute inset-0 rounded-full border border-neon-green/20" />
      <div className="absolute inset-[15%] rounded-full border border-neon-green/15" />
      <div className="absolute inset-[30%] rounded-full border border-neon-green/10" />
      
      {/* Crosshairs */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-neon-green/10" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-neon-green/10" />
      
      {/* Sweep */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, hsl(var(--neon-green) / 0.2) 30deg, transparent 60deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Token dots */}
      {Array.from({ length: Math.min(tokenCount, 5) }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-neon-green"
          style={{
            top: `${25 + Math.random() * 50}%`,
            left: `${25 + Math.random() * 50}%`,
            boxShadow: '0 0 6px hsl(var(--neon-green))',
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" 
           style={{ boxShadow: '0 0 8px hsl(var(--neon-green))' }} />
      
      {/* Count */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
        <span className="hud-text text-primary">{tokenCount} nearby</span>
      </div>
    </div>
  );
}
