import { ReactNode, useRef } from 'react';
import { motion, useInView as useFramerInView } from 'framer-motion';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  duration?: number;
  variant?: 'fade' | 'scale' | 'both';
}

/**
 * ScrollAnimation component for animating elements as they come into view during scrolling
 * Uses framer-motion for smooth animations
 */
export default function ScrollAnimation({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  duration = 0.5,
  variant = 'both'
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const inView = useFramerInView(ref, {
    once: true,
    amount: threshold
  });

  // Initial animation properties based on direction
  const getInitialProps = () => {
    const baseProps: any = variant === 'fade' || variant === 'both' 
      ? { opacity: 0 } 
      : { opacity: 1 };
      
    if (variant === 'scale' || variant === 'both') {
      baseProps.scale = 0.95;
    }

    switch (direction) {
      case 'up':
        return { ...baseProps, y: 30 };
      case 'down':
        return { ...baseProps, y: -30 };
      case 'left':
        return { ...baseProps, x: 30 };
      case 'right':
        return { ...baseProps, x: -30 };
      case 'none':
        return baseProps;
      default:
        return { ...baseProps, y: 30 };
    }
  };

  // Animate to these values when in view
  const finalProps = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: duration,
      delay: delay,
      ease: 'easeOut'
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialProps()}
      animate={inView ? finalProps : getInitialProps()}
      className={className}
    >
      {children}
    </motion.div>
  );
}