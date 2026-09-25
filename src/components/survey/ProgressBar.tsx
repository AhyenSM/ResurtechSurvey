import React from 'react';

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = Math.max(5, Math.min(100, (current / total) * 100));
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '8px', background: 'var(--void-2)', zIndex: 50 }}>
      <div 
        style={{ 
          height: '100%', 
          width: `${percentage}%`, 
          background: 'var(--neon)',
          boxShadow: '0 0 15px var(--neon)',
          transition: 'width 0.4s var(--ease-out-quint)'
        }} 
      />

    </div>
  );
}
