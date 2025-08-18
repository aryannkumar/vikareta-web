import { Variants } from 'framer-motion';

// Premium animation variants for business components
export const businessAnimations = {
  // Hero section animations
  heroContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  } as Variants,

  heroItem: {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95 
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  } as Variants,

  // Card animations
  cardContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  } as Variants,

  cardItem: {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  } as Variants,

  // Business stats animations
  statsContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  } as Variants,

  statItem: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 20 
    },
    show: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  } as Variants,

  // Filter animations
  filterSlide: {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  } as Variants,

  // Page transitions
  pageTransition: {
    initial: { 
      opacity: 0,
      y: 20 
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  } as Variants,

  // Floating elements
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity
    }
  },

  floatDelay: {
    y: [0, -8, 0],
    transition: {
      duration: 3.5,
      ease: "easeInOut",
      repeat: Infinity,
      delay: 0.5
    }
  },

  // Badge animations
  badge: {
    hidden: { 
      opacity: 0, 
      scale: 0.8 
    },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  } as Variants,

  // Button hover effects
  buttonHover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },

  buttonTap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  },

  // Loading animations
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity
    }
  },

  // Counter animation
  counterUp: {
    opacity: [0, 1],
    y: [20, 0],
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Utility functions for creating custom animations
export const createStaggerAnimation = (
  delay: number = 0.1,
  childDelay: number = 0.1
) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: childDelay
    }
  }
});

export const createSlideUpAnimation = (
  duration: number = 0.5,
  yOffset: number = 30
) => ({
  hidden: { 
    opacity: 0, 
    y: yOffset 
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration,
      ease: "easeOut"
    }
  }
});

export const createScaleAnimation = (
  duration: number = 0.3,
  scale: number = 0.95
) => ({
  hidden: { 
    opacity: 0, 
    scale 
  },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration,
      ease: "easeOut"
    }
  }
});