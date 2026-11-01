import { motion } from 'framer-motion';

export function WebGLFallback() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#070817]">
      {/* Deep Cosmic Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-[#070817] to-[#070817]" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-cyan-600/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-pink-600/20 blur-3xl" />

      {/* Floating 2D Stars Animation */}
      <div className="absolute inset-0">
        {Array.from({ length: 70 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [0.2, 0.9, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
