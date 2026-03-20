export default function LoadingDots({ text = 'Thinking...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="loading-dot"
            style={{
              width: '10px',
              height: '10px',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
      {text && (
        <p style={{ color: 'var(--muted)', fontSize: '14px', fontFamily: 'DM Mono, monospace' }}>
          {text}
        </p>
      )}
    </div>
  );
}
