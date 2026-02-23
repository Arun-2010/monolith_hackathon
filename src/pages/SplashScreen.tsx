import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => navigate('/', { replace: true }), 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center cyber-gradient"
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="scan-line" />
      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="text-6xl mb-6"
        >
          🛡️
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-display text-4xl font-black neon-text tracking-wider"
        >
          SCAMHUNTER
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="hud-text text-neon-purple mt-2"
        >
          AR · AI · CRYPTO DEFENSE
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '60%' }}
          transition={{ delay: 1, duration: 1.5 }}
          className="h-0.5 mx-auto mt-8 rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--neon-green)), hsl(var(--neon-purple)))',
            boxShadow: '0 0 10px hsl(var(--neon-green) / 0.5)',
          }}
        />
      </div>
    </motion.div>
  );
}
