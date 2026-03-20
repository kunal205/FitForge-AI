import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/workout', label: 'Workout Generator' },
  { to: '/diet', label: 'Diet Planner' },
  { to: '/bmi', label: 'BMI Calculator' },
  { to: '/chat', label: 'AI Chat' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
        padding: 'clamp(32px, 5vw, 48px) clamp(16px, 4vw, 24px) 32px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span
                className="font-display"
                style={{ fontSize: '32px', color: 'var(--accent)', lineHeight: 1 }}
              >
                FIT
              </span>
              <span
                className="font-display"
                style={{ fontSize: '32px', color: 'var(--text)', lineHeight: 1 }}
              >
                FORGE
              </span>
            </div>
            <p
              className="font-mono"
              style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '220px' }}
            >
              Train smarter. Not just harder.
            </p>
          </div>

          {/* Links */}
          <div>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px',
                fontWeight: 600,
              }}
            >
              Tools
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    textDecoration: 'none',
                    color: 'var(--muted)',
                    fontSize: '14px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Legal */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p
            style={{
              color: 'var(--muted)',
              fontSize: '12px',
              maxWidth: '480px',
              lineHeight: 1.5,
            }}
          >
            ⚠️ AI responses are for informational purposes only. Consult a doctor before starting any
            fitness program.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '12px' }}>
            © 2026 FitForge AI
          </p>
        </div>
      </div>
    </footer>
  );
}
