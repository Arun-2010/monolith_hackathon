import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'green' | 'purple' | 'none';
  onClick?: () => void;
  animate?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  glow = 'none',
  onClick,
  animate = true,
}: GlassCardProps) {
  const glowClass = glow === 'green' ? 'glass-card-glow' : glow === 'purple' ? 'glass-card neon-border-purple' : 'glass-card';

  const Comp = animate ? motion.div : 'div';
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        whileHover: onClick ? { scale: 1.01 } : undefined,
        whileTap: onClick ? { scale: 0.98 } : undefined,
      }
    : {};

  return (
    <Comp
      {...(animProps as any)}
      onClick={onClick}
      className={`${glowClass} p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </Comp>
  );
}
