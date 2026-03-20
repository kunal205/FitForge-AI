import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  {
    icon: '🏋️',
    title: 'AI Workout Plans',
    desc: 'Custom plans based on your goals, level & equipment',
  },
  {
    icon: '🥗',
    title: 'Smart Diet Coach',
    desc: 'Macro-balanced meal plans tailored to your body',
  },
  {
    icon: '💬',
    title: '24/7 AI Coach',
    desc: 'Ask anything. Get expert answers instantly.',
  },
];

const stats = [
  { value: '10,000+', label: 'Workouts Generated' },
  { value: '500+', label: 'Diet Plans Created' },
  { value: '4.9★', label: 'Average Rating' },
  { value: 'GPT-4o', label: 'Powered' },
];

const steps = [
  {
    num: '01',
    title: 'Tell us about yourself',
    desc: 'Goals, fitness level, equipment, diet preferences',
  },
  {
    num: '02',
    title: 'AI builds your plan',
    desc: 'Personalized workout + meal plan in seconds',
  },
  {
    num: '03',
    title: 'Train & track progress',
    desc: 'Follow along, ask questions, adjust anytime',
  },
];

// Floating blob component
function FloatingBlob({ style }) {
  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(20px) scale(0.95); }
        }
        .blob2 { animation: float2 10s ease-in-out infinite !important; }
      `}</style>

      {/* HERO */}
      <section
        className="grid-bg"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '72px',
        }}
      >
        {/* Blobs */}
        <FloatingBlob
          style={{
            width: '400px',
            height: '400px',
            background: 'rgba(232,255,59,0.07)',
            top: '10%',
            left: '-10%',
          }}
        />
        <FloatingBlob
          style={{
            width: '300px',
            height: '300px',
            background: 'rgba(255,69,69,0.06)',
            bottom: '10%',
            right: '-5%',
            animationDelay: '3s',
          }}
        />
        <FloatingBlob
          className="blob2"
          style={{
            width: '250px',
            height: '250px',
            background: 'rgba(232,255,59,0.05)',
            top: '40%',
            right: '15%',
            animationDelay: '1.5s',
          }}
        />

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          style={{ textAlign: 'center', zIndex: 1, padding: '0 16px', maxWidth: '900px', width: '100%' }}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} style={{ marginBottom: '24px' }}>
            <span
              className="font-mono"
              style={{
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '12px',
                letterSpacing: '0.1em',
              }}
            >
              ✦ POWERED BY GPT-4o
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp}>
            <p
              className="font-display"
              style={{
                fontSize: 'clamp(16px, 3vw, 24px)',
                letterSpacing: '0.4em',
                color: 'var(--muted)',
                marginBottom: '0',
              }}
            >
              YOUR AI
            </p>
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(80px, 15vw, 180px)',
                lineHeight: 0.9,
                color: 'var(--text)',
                marginBottom: '0',
              }}
            >
              FITNESS
            </h1>
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(80px, 15vw, 180px)',
                lineHeight: 0.9,
                color: 'var(--accent)',
              }}
            >
              COACH
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            style={{
              color: 'var(--muted)',
              fontSize: 'clamp(14px, 2vw, 18px)',
              maxWidth: '520px',
              margin: '28px auto',
              lineHeight: 1.7,
            }}
          >
            Personalized workouts. Smart nutrition. Real results.
            <br />
            Built by AI. Trained for you.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="hero-cta"
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}
          >
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link to="/chat" className="btn-primary" style={{ fontSize: '16px' }}>
                Start Training →
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <a href="#how-it-works" className="btn-ghost" style={{ fontSize: '16px' }}>
                See How It Works
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES STRIP */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <p className="font-mono" style={{ color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.15em', marginBottom: '12px' }}>
              WHAT WE OFFER
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 56px)', color: 'var(--text)' }}>
              EVERYTHING YOU NEED
            </h2>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -4, borderColor: '#E8FF3B' }}
                className="card"
                style={{ padding: '32px' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--accent)',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease',
                    transformOrigin: 'left',
                  }}
                  className="card-top-line"
                />
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.icon}</div>
                <h3
                  className="font-display"
                  style={{ fontSize: '24px', color: 'var(--text)', marginBottom: '10px' }}
                >
                  {f.title}
                </h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: '15px' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '32px',
            textAlign: 'center',
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div
                className="font-display"
                style={{ fontSize: 'clamp(36px, 5vw, 52px)', color: 'var(--accent)', lineHeight: 1 }}
              >
                {s.value}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '8px', fontFamily: 'DM Mono, monospace' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section grid-bg">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <p className="font-mono" style={{ color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.15em', marginBottom: '12px' }}>
              THE PROCESS
            </p>
            <h2 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 56px)', color: 'var(--text)' }}>
              HOW IT WORKS
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '700px', margin: '0 auto' }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}
              >
                <div
                  className="font-display"
                  style={{
                    fontSize: '60px',
                    color: 'rgba(232,255,59,0.15)',
                    lineHeight: 0.9,
                    flexShrink: 0,
                    minWidth: '80px',
                  }}
                >
                  {step.num}
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <h3 className="font-display" style={{ fontSize: '28px', color: 'var(--text)', marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: '15px' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        className="cta-banner"
        style={{
          background: 'var(--accent)',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(40px, 7vw, 72px)', color: '#000', marginBottom: '16px' }}
          >
            READY TO TRANSFORM?
          </h2>
          <p style={{ color: 'rgba(0,0,0,0.65)', fontSize: '18px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Start training smarter today. No signup required.
          </p>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              to="/chat"
              style={{
                background: '#000',
                color: 'var(--accent)',
                padding: '16px 40px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '16px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'transform 0.2s',
              }}
            >
              Get My Free Plan →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
