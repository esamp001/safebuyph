// client/src/components/ui/ScrollAnimation.jsx
import { motion } from 'framer-motion';

export const ScrollAnimation = ({ children, delay = 0, direction = 'up' }) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 50 : -50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
