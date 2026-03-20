import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { callOpenAIRaw } from '../utils/openai';
import LoadingDots from '../components/LoadingDots';
import Footer from '../components/Footer';

function calcBMI(weight, height) {
  if (!weight || !height || height === 0) return 0;
  return weight / ((height / 100) ** 2);
}

function calcBMR(weight, height, age, gender) {
  if (!weight || !height || !age) return 0;
  if (gender === 'Male') return 10 * weight + 6.25 * height - 5 * age + 5;
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#60a5fa', pct: bmi / 40 };
  if (bmi < 25) return { label: 'Normal', color: '#E8FF3B', pct: bmi / 40 };
  if (bmi < 30) return { label: 'Overweight', color: '#fb923c', pct: bmi / 40 };
  return { label: 'Obese', color: '#FF4545', pct: Math.min(bmi / 40, 1) };
}

function getIdealWeight(height, gender) {
  const h = height - 100;
  if (gender === 'Male') return [h * 0.9, h * 1.1];
  return [h * 0.85, h * 1.05];
}

export default function BMI() {
  const navigate = useNavigate();
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('Male');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  const bmi = calcBMI(weightKg, heightCm);
  const bmr = calcBMR(weightKg, heightCm, age, gender);
  const tdee = bmr * 1.55; // moderate activity
  const category = getBMICategory(bmi);
  const idealWeight = getIdealWeight(heightCm, gender);
  const pctOnScale = Math.min((bmi / 40) * 100, 100);

  // Navy formula body fat estimate
  function getBodyFat() {
    if (!heightCm || !weightKg) return '—';
    // Simple estimation
    if (gender === 'Male') {
      const bf = 1.2 * bmi + 0.23 * age - 16.2;
      return Math.max(0, bf).toFixed(1);
    } else {
      const bf = 1.2 * bmi + 0.23 * age - 5.4;
      return Math.max(0, bf).toFixed(1);
    }
  }

  async function getAIAnalysis() {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const prompt = `Analyze these fitness stats and provide personalized advice:
- BMI: ${bmi.toFixed(1)} (${category.label})
- BMR: ${Math.round(bmr)} kcal/day
- TDEE (moderate): ${Math.round(tdee)} kcal/day
- Age: ${age}, Gender: ${gender}
- Weight: ${weightKg}kg, Height: ${heightCm}cm
- Ideal weight range: ${idealWeight[0].toFixed(0)}-${idealWeight[1].toFixed(0)}kg

Provide a response with:
1. What this BMI means for them specifically (2 sentences)
2. Top 3 actionable steps to reach/maintain ideal weight
3. Recommended workout type for their current stats
4. Daily calorie target (cut/maintain/bulk)

Keep it encouraging, specific, and practical. Use bullet points.`;

      const result = await callOpenAIRaw(prompt, 800);
      setAiResult(result);
    } catch (err) {
      setAiError(err.message === 'NO_API_KEY' ? 'API key not configured. Please add your VITE_GROQ_API_KEY to the .env file.' : '❌ AI is taking a break. Try again.');
    } finally {
      setAiLoading(false);
    }
  }

  const stats = [
    { label: 'BMR', value: Math.round(bmr), unit: 'kcal/day', desc: 'Calories at rest' },
    { label: 'TDEE', value: Math.round(tdee), unit: 'kcal/day', desc: 'Moderate activity' },
    { label: 'Ideal Weight', value: `${idealWeight[0].toFixed(0)}–${idealWeight[1].toFixed(0)}`, unit: 'kg', desc: 'Healthy range' },
    { label: 'Body Fat Est.', value: getBodyFat(), unit: '%', desc: 'Estimation only' },
  ];

  return (
    <>
      <div className="page-wrapper" style={{ background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 16px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
            <p className="font-mono" style={{ color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.15em', marginBottom: '8px' }}>BODY ANALYSIS</p>
            <h1 className="font-display" style={{ fontSize: 'clamp(40px, 7vw, 64px)', color: 'var(--text)' }}>BMI CALCULATOR</h1>
          </motion.div>

          <div className="bmi-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* Inputs */}
            <div className="card" style={{ padding: '28px' }}>
              <h3 className="font-display" style={{ fontSize: '22px', color: 'var(--text)', marginBottom: '24px' }}>YOUR STATS</h3>

              {/* Height slider */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Height</label>
                  <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '16px' }}>{heightCm} cm</span>
                </div>
                <input type="range" min="140" max="230" value={heightCm} onChange={(e) => setHeightCm(+e.target.value)} />
              </div>

              {/* Weight slider */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weight</label>
                  <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '16px' }}>{weightKg} kg</span>
                </div>
                <input type="range" min="30" max="200" value={weightKg} onChange={(e) => setWeightKg(+e.target.value)} />
              </div>

              {/* Age */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Age</label>
                  <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '16px' }}>{age}</span>
                </div>
                <input type="range" min="10" max="90" value={age} onChange={(e) => setAge(+e.target.value)} />
              </div>

              {/* Gender */}
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Gender</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Male', 'Female'].map((g) => (
                    <motion.button
                      key={g}
                      onClick={() => setGender(g)}
                      whileTap={{ scale: 0.97 }}
                      className={`toggle-btn ${gender === g ? 'active' : ''}`}
                    >
                      {g}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* BMI Result */}
            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p className="font-mono" style={{ color: 'var(--muted)', fontSize: '12px', letterSpacing: '0.12em', marginBottom: '12px' }}>YOUR BMI</p>

              <motion.div
                key={bmi.toFixed(0)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="font-display"
                style={{ fontSize: 'clamp(72px, 12vw, 96px)', color: category.color, lineHeight: 1 }}
              >
                {bmi > 0 ? bmi.toFixed(1) : '—'}
              </motion.div>

              <motion.p
                key={category.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display"
                style={{ fontSize: '28px', color: category.color, marginBottom: '28px', letterSpacing: '0.05em' }}
              >
                {bmi > 0 ? category.label : '—'}
              </motion.p>

              {/* Scale bar */}
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  {['Under', 'Normal', 'Over', 'Obese'].map((l) => (
                    <span key={l} style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{l}</span>
                  ))}
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, #60a5fa 0%, #E8FF3B 37%, #fb923c 62%, #FF4545 100%)', position: 'relative', marginBottom: '8px' }}>
                  {bmi > 0 && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        left: `calc(${pctOnScale}% - 8px)`,
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: `3px solid ${category.color}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                      animate={{ left: `calc(${pctOnScale}% - 8px)` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {['<18.5', '18.5', '25', '30+'].map((l) => (
                    <span key={l} style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Body Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {stats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ padding: '20px', textAlign: 'center' }}
              >
                <p style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{s.label}</p>
                <div className="font-display" style={{ fontSize: '32px', color: 'var(--accent)', lineHeight: 1, marginBottom: '2px' }}>{s.value}</div>
                <div className="font-mono" style={{ color: 'var(--muted)', fontSize: '12px' }}>{s.unit}</div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '4px' }}>{s.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* AI Analysis */}
          <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="font-display" style={{ fontSize: '24px', color: 'var(--text)' }}>AI BODY ANALYSIS</h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>Get personalized recommendations based on your stats</p>
              </div>
              {!aiResult && (
                <motion.button
                  onClick={getAIAnalysis}
                  disabled={aiLoading || !bmi}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  style={{ opacity: !bmi ? 0.4 : 1 }}
                >
                  {aiLoading ? 'Analyzing...' : 'Get AI Analysis →'}
                </motion.button>
              )}
            </div>

            {aiLoading && <LoadingDots text="Analyzing your body stats..." />}

            {aiError && (
              <div style={{ padding: '16px', background: 'rgba(255,69,69,0.08)', border: '1px solid rgba(255,69,69,0.2)', borderRadius: '10px' }}>
                <p style={{ color: 'var(--accent2)' }}>
                  {aiError}
                </p>
              </div>
            )}

            {aiResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="ai-prose" style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', color: 'var(--text)', lineHeight: 1.8 }}>
                  {aiResult.split('\n').map((line, i) => {
                    if (!line.trim()) return <br key={i} />;
                    return <p key={i} style={{ marginBottom: '8px' }}>{line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}</p>;
                  })}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <motion.button onClick={() => setAiResult(null)} whileTap={{ scale: 0.97 }} className="btn-ghost" style={{ fontSize: '13px', padding: '8px 16px' }}>
                    Recalculate
                  </motion.button>
                  <motion.button onClick={() => navigate('/workout')} whileTap={{ scale: 0.97 }} className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
                    Build Workout Plan →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {!aiResult && !aiLoading && !aiError && (
              <p style={{ color: 'var(--muted)', fontSize: '14px', fontStyle: 'italic' }}>
                Adjust the sliders above and click "Get AI Analysis" for personalized recommendations.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
