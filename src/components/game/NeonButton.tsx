import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'green' | 'purple' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

const variantStyles = {
  green: 'border-neon-green/40 text-primary bg-primary/10 hover:bg-primary/20 shadow-[0_0_15px_-3px_hsl(var(--neon-green)/0.3)]',
  purple: 'border-neon-purple/40 text-secondary bg-secondary/10 hover:bg-secondary/20 shadow-[0_0_15px_-3px_hsl(var(--neon-purple)/0.3)]',
  danger: 'border-danger/40 text-danger bg-danger/10 hover:bg-danger/20 shadow-[0_0_15px_-3px_hsl(var(--danger)/0.3)]',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function NeonButton({
  children,
  onClick,
  variant = 'green',
  size = 'md',
  fullWidth,
  disabled,
  icon,
}: NeonButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-display font-semibold tracking-wider uppercase rounded-xl border
        transition-all duration-300 flex items-center justify-center gap-2
        disabled:opacity-40 disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
}
