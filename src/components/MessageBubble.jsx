export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        padding: '0 4px',
      }}
    >
      {!isUser && (
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
            color: '#000',
            marginRight: '10px',
            flexShrink: 0,
            marginTop: '4px',
            fontFamily: 'Bebas Neue, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          AI
        </div>
      )}

      <div style={{ maxWidth: '80%' }}>
        <div
          className={isUser ? 'bubble-user' : 'bubble-ai'}
          style={{ padding: '12px 16px' }}
        >
          {isUser ? (
            <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{content}</p>
          ) : (
            <div className="ai-prose" style={{ fontSize: '14px', lineHeight: 1.7 }}>
              {content.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={i} style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '6px' }}>
                      {line.replace(/\*\*/g, '')}
                    </p>
                  );
                }
                if (line.startsWith('• ') || line.startsWith('- ') || line.match(/^[\d]+\./)) {
                  return (
                    <p key={i} style={{ marginBottom: '4px', paddingLeft: '8px' }}>
                      {line}
                    </p>
                  );
                }
                if (line.trim() === '') return <br key={i} />;
                return (
                  <p key={i} style={{ marginBottom: '6px' }}>
                    {line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        {timestamp && (
          <p
            style={{
              fontSize: '11px',
              color: 'var(--muted)',
              marginTop: '4px',
              textAlign: isUser ? 'right' : 'left',
              fontFamily: 'DM Mono, monospace',
            }}
          >
            {timestamp}
          </p>
        )}
      </div>

      {isUser && (
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#222',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            marginLeft: '10px',
            flexShrink: 0,
            marginTop: '4px',
          }}
        >
          👤
        </div>
      )}
    </div>
  );
}
