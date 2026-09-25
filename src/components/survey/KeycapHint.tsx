import React from 'react';

export function KeycapHint({ children }: { children: React.ReactNode }) {
  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--void-2)',
        border: '1px solid var(--emerald-2)',
        borderRadius: '4px',
        padding: '2px 6px',
        color: 'var(--ink-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        marginLeft: '8px'
      }}
    >
      {children}
    </span>
  );
}
