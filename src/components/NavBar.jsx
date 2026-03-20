import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/workout', label: 'Workout' },
  { to: '/diet', label: 'Diet' },
  { to: '/bmi', label: 'BMI' },
  { to: '/chat', label: 'Chat' },
];

export default function NavBar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span
            className="font-display"
            style={{ fontSize: '28px', color: 'var(--accent)', lineHeight: 1 }}
          >
            FIT
          </span>
          <span
            className="font-display"
            style={{ fontSize: '28px', color: 'var(--text)', lineHeight: 1 }}
          >
            FORGE
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  textDecoration: 'none',
                  padding: '6px 14px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'all 0.2s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.color = 'var(--text)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.color = 'var(--muted)';
                }}
              >
                {link.label}
              </Link>
            );
          })}

          <Link to="/chat" className="btn-primary" style={{ marginLeft: '8px', padding: '8px 20px', fontSize: '14px' }}>
            Start Free →
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-hamburger"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            flexDirection: 'column',
            gap: '5px',
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={
                menuOpen
                  ? i === 0
                    ? { rotate: 45, y: 10 }
                    : i === 1
                    ? { opacity: 0 }
                    : { rotate: -45, y: -10 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              style={{
                display: 'block',
                width: '24px',
                height: '2px',
                background: 'var(--text)',
                borderRadius: '2px',
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute',
              top: '72px',
              left: 0,
              right: 0,
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflow: 'hidden',
              zIndex: 99,
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: isActive ? 'var(--accent)' : 'var(--text)',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(232,255,59,0.08)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/chat"
              onClick={() => setMenuOpen(false)}
              className="btn-primary"
              style={{ marginTop: '8px', justifyContent: 'center' }}
            >
              Start Free →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-hamburger { display: none; }
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
