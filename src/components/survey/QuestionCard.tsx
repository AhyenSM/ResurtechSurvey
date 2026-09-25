import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function QuestionCard({ 
  children, 
  id,
  maxWidth = '640px'
}: { 
  children: React.ReactNode, 
  id: string | number,
  maxWidth?: string
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        className="question-card"
        style={{
          width: '100%',
          maxWidth: maxWidth,
          margin: '0 auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
