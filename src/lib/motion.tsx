import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] } }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export const floatSlow: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
  }
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.2, 0.9, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.32, ease: 'easeInOut' } }
};

export const cardHover = {
  whileHover: { scale: 1.02, y: -6, transition: { duration: 0.18 } },
  whileTap: { scale: 0.995 }
};
