import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { callOpenAIRaw } from '../utils/openai';
import { useApp } from '../context/AppContext';
import LoadingDots from '../components/LoadingDots';
import Footer from '../components/Footer';

const LOADING_TEXTS = [
  'Analyzing your goals...',
  'Building your split...',
  'Optimizing rest days...',
  'Finalizing your plan...',
];

const GOALS = ['Lose Fat', 'Build Muscle', 'Increase Endurance', 'Stay Fit'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const TIMES = ['30 min', '45 min', '60 min', '90 min'];
const EQUIPMENT = ['No Equipment', 'Dumbbells', 'Barbell', 'Full Gym'];
const FOCUS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

function ToggleGroup({ options, value, onChange, multi = false }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {options.map((opt) => {
        const isActive = multi ? (value || []).includes(opt) : value === opt;
        return (
          <motion.button
            key={opt}
            onClick={() => {
              if (multi) {
                const arr = value || [];
                onChange(isActive ? arr.filter((x) => x !== opt) : [...arr, opt]);
              } else {
                onChange(opt);
              }
            }}
            whileTap={{ scale: 0.97 }}
            className={`toggle-btn ${isActive ? 'active' : ''}`}
          >
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <label
        style={{
          display: 'block',
          color: 'var(--muted)',
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '12px',
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Workout() {
  const { setSavedWorkout, savedWorkout } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loadingText, setLoadingText] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(savedWorkout || null);
  const [activeDay, setActiveDay] = useState(0);

  const [form, setForm] = useState({
    goal: '',
    level: '',
    age: '',
    weight: '',
    weightUnit: 'kg',
    daysPerWeek: 4,
    sessionTime: '60 min',
    equipment: [],
    focusAreas: [],
  });

  function setField(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function generatePlan() {
    setLoading(true);
    setError(null);
    let textIdx = 0;

    const interval = setInterval(() => {
      textIdx = (textIdx + 1) % LOADING_TEXTS.length;
      setLoadingText(textIdx);
    }, 2000);

    try {
      const prompt = `Create a detailed ${form.daysPerWeek}-day per week workout plan for:
- Goal: ${form.goal}
- Level: ${form.level}
- Age: ${form.age}, Weight: ${form.weight}${form.weightUnit}
- Session duration: ${form.sessionTime}
- Available equipment: ${form.equipment.join(', ') || 'none specified'}
- Focus areas: ${form.focusAreas.join(', ') || 'full body'}

Format the response as JSON with this structure:
{
  "planName": "string",
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "string",
      "exercises": [
        {
          "name": "string",
          "sets": 3,
          "reps": "8-12",
          "rest": "60s",
          "tip": "string"
        }
      ]
    }
  ],
  "tips": ["string"],
  "progressionNote": "string"
}
Return ONLY valid JSON, no markdown, no code blocks.`;

      const raw = await callOpenAIRaw(prompt, 1800);
      const parsed = JSON.parse(raw.trim());
      setPlan(parsed);
      setSavedWorkout(parsed);
      setActiveDay(0);
      setStep(4);
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setError('API key not configured. Please add your VITE_GROQ_API_KEY to the .env file.');
      } else {
        setError('❌ Failed to generate. Try again.');
      }
      setStep(3);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  function startOver() {
    setPlan(null);
    setSavedWorkout(null);
    setStep(1);
    setForm({
      goal: '',
      level: '',
      age: '',
      weight: '',
      weightUnit: 'kg',
      daysPerWeek: 4,
      sessionTime: '60 min',
      equipment: [],
      focusAreas: [],
    });
  }

  const progress = step <= 3 ? ((step - 1) / 2) * 100 : 100;

  return (
    <>
      <div className="page-wrapper" style={{ background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>

          {/* Header */}
          {step <= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '40px' }}
            >
              <p className="font-mono" style={{ color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.15em', marginBottom: '8px' }}>
                AI WORKOUT GENERATOR
              </p>
              <h1 className="font-display" style={{ fontSize: 'clamp(40px, 7vw, 64px)', color: 'var(--text)', marginBottom: '24px' }}>
                BUILD YOUR PLAN
              </h1>

              {/* Progress bar */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                {['About You', 'Your Setup', 'Confirm'].map((label, i) => (
                  <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div
                      style={{
                        height: '3px',
                        borderRadius: '2px',
                        background: i + 1 <= step ? 'var(--accent)' : 'var(--border)',
                        transition: 'background 0.3s',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: i + 1 === step ? 'var(--accent)' : 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
                      {i + 1}. {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="card" style={{ padding: '32px' }}>
                  <Field label="Your Goal">
                    <ToggleGroup options={GOALS} value={form.goal} onChange={(v) => setField('goal', v)} />
                  </Field>
                  <Field label="Fitness Level">
                    <ToggleGroup options={LEVELS} value={form.level} onChange={(v) => setField('level', v)} />
                  </Field>
                  <div className="inputs-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Field label="Age">
                      <input type="number" value={form.age} onChange={(e) => setField('age', e.target.value)} placeholder="e.g. 25" className="input-dark" min="10" max="100" />
                    </Field>
                    <Field label={`Weight (${form.weightUnit})`}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="number" value={form.weight} onChange={(e) => setField('weight', e.target.value)} placeholder="e.g. 75" className="input-dark" style={{ flex: 1 }} />
                        <ToggleGroup options={['kg', 'lbs']} value={form.weightUnit} onChange={(v) => setField('weightUnit', v)} />
                      </div>
                    </Field>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(2)}
                    disabled={!form.goal || !form.level || !form.age || !form.weight}
                    className="btn-primary"
                    style={{ opacity: !form.goal || !form.level || !form.age || !form.weight ? 0.4 : 1 }}
                  >
                    Next →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="card" style={{ padding: '32px' }}>
                  <Field label={`Days per Week — `}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                      <span className="font-display" style={{ fontSize: '48px', color: 'var(--accent)', lineHeight: 1, minWidth: '48px' }}>
                        {form.daysPerWeek}
                      </span>
                      <input type="range" min="2" max="6" value={form.daysPerWeek} onChange={(e) => setField('daysPerWeek', +e.target.value)} style={{ flex: 1 }} />
                    </div>
                  </Field>
                  <Field label="Session Duration">
                    <ToggleGroup options={TIMES} value={form.sessionTime} onChange={(v) => setField('sessionTime', v)} />
                  </Field>
                  <Field label="Equipment (select all that apply)">
                    <ToggleGroup options={EQUIPMENT} value={form.equipment} onChange={(v) => setField('equipment', v)} multi />
                  </Field>
                  <Field label="Focus Areas (optional)">
                    <ToggleGroup options={FOCUS} value={form.focusAreas} onChange={(v) => setField('focusAreas', v)} multi />
                  </Field>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(3)} className="btn-primary">
                    Review Plan →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Confirm */}
            {step === 3 && !loading && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="card" style={{ padding: '32px' }}>
                  <h2 className="font-display" style={{ fontSize: '28px', color: 'var(--text)', marginBottom: '24px' }}>
                    YOUR SELECTIONS
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {[
                      { label: 'Goal', value: form.goal },
                      { label: 'Level', value: form.level },
                      { label: 'Age', value: form.age },
                      { label: 'Weight', value: `${form.weight} ${form.weightUnit}` },
                      { label: 'Days/Week', value: form.daysPerWeek },
                      { label: 'Session Time', value: form.sessionTime },
                      { label: 'Equipment', value: form.equipment.join(', ') || 'Not specified' },
                      { label: 'Focus', value: form.focusAreas.join(', ') || 'Full Body' },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</p>
                        <p style={{ color: 'var(--accent)', fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: 500 }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,69,69,0.08)', border: '1px solid rgba(255,69,69,0.2)', borderRadius: '10px' }}>
                      <p style={{ color: 'var(--accent2)' }}>
                        {error}
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button onClick={() => setStep(2)} className="btn-ghost">← Back</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={generatePlan} className="btn-primary" style={{ fontSize: '16px' }}>
                    Generate My Plan →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Loading state */}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div className="font-display" style={{ fontSize: '64px', color: 'var(--accent)', marginBottom: '24px' }}>⚡</div>
                <h2 className="font-display" style={{ fontSize: '32px', color: 'var(--text)', marginBottom: '16px' }}>
                  BUILDING YOUR PLAN
                </h2>
                <LoadingDots text={LOADING_TEXTS[loadingText]} />
              </motion.div>
            )}

            {/* PLAN DISPLAY */}
            {step === 4 && plan && (
              <motion.div key="plan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ marginBottom: '32px' }}>
                  <p className="font-mono" style={{ color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.12em', marginBottom: '8px' }}>YOUR PERSONALIZED PLAN</p>
                  <h1 className="font-display" style={{ fontSize: 'clamp(40px, 7vw, 64px)', color: 'var(--text)' }}>
                    {plan.planName?.toUpperCase()}
                  </h1>
                </div>

                {/* Day tabs */}
                <div className="day-tabs" style={{ marginBottom: '24px' }}>
                  {plan.weeklySchedule?.map((dayPlan, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveDay(i)}
                      whileTap={{ scale: 0.97 }}
                      className={`toggle-btn ${activeDay === i ? 'active' : ''}`}
                    >
                      {dayPlan.day}
                    </motion.button>
                  ))}
                </div>

                {/* Active day exercises */}
                {plan.weeklySchedule?.[activeDay] && (
                  <motion.div
                    key={activeDay}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}>
                      <h3 className="font-display" style={{ fontSize: '24px', color: 'var(--accent)', marginBottom: '4px' }}>
                        {plan.weeklySchedule[activeDay].day?.toUpperCase()}
                      </h3>
                      <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
                        {plan.weeklySchedule[activeDay].focus}
                      </p>

                      {plan.weeklySchedule[activeDay].exercises?.length === 0 ? (
                        <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Rest Day — Recovery & mobility work</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {plan.weeklySchedule[activeDay].exercises?.map((ex, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07 }}
                              className="card"
                              style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
                            >
                              <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text)', marginBottom: '4px' }}>
                                  {ex.name}
                                </p>
                                {ex.tip && (
                                  <p style={{ color: 'var(--muted)', fontSize: '13px', fontStyle: 'italic' }}>💡 {ex.tip}</p>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
                                <div style={{ textAlign: 'center' }}>
                                  <div className="font-mono" style={{ color: 'var(--accent)', fontSize: '18px', fontWeight: 500 }}>
                                    {ex.sets}×{ex.reps}
                                  </div>
                                  <div style={{ color: 'var(--muted)', fontSize: '11px' }}>Sets × Reps</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                  <div className="font-mono" style={{ color: 'var(--muted)', fontSize: '14px' }}>{ex.rest}</div>
                                  <div style={{ color: 'var(--muted)', fontSize: '11px' }}>Rest</div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Tips & Progression */}
                {(plan.tips?.length > 0 || plan.progressionNote) && (
                  <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    {plan.tips?.length > 0 && (
                      <>
                        <h3 className="font-display" style={{ fontSize: '22px', color: 'var(--text)', marginBottom: '12px' }}>COACH TIPS</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                          {plan.tips.map((tip, i) => (
                            <li key={i} style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '8px', paddingLeft: '16px', position: 'relative' }}>
                              <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>→</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {plan.progressionNote && (
                      <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(232,255,59,0.06)', borderRadius: '8px', border: '1px solid rgba(232,255,59,0.15)' }}>
                        <p style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>PROGRESSION NOTE</p>
                        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{plan.progressionNote}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <motion.button onClick={startOver} whileTap={{ scale: 0.97 }} className="btn-ghost">
                    ↺ Start Over
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/chat')}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary"
                  >
                    Ask AI Coach →
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
}
