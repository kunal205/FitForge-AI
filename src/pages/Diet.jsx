import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { callOpenAIRaw } from '../utils/openai';
import { useApp } from '../context/AppContext';
import MacroChart from '../components/MacroChart';
import LoadingDots from '../components/LoadingDots';
import Footer from '../components/Footer';

const GOALS = ['Lose Fat', 'Maintain', 'Gain Muscle', 'Bulk'];
const GENDERS = ['Male', 'Female'];
const ACTIVITIES = ['Sedentary', 'Light', 'Moderate', 'Very Active'];
const DIET_TYPES = ['No Restriction', 'Vegetarian', 'Vegan', 'Keto', 'High Protein'];
const ALLERGIES = ['Dairy', 'Gluten', 'Nuts', 'Eggs'];
const MEALS_OPTIONS = ['2', '3', '4', '5', '6'];
const LOADING_TEXTS = ['Calculating your TDEE...', 'Selecting optimal foods...', 'Balancing your macros...', 'Finalizing meal plan...'];

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
      <label style={{ display: 'block', color: 'var(--muted)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Diet() {
  const { setSavedDiet, savedDiet } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(0);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(savedDiet || null);

  const [form, setForm] = useState({
    goal: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: '',
    dietType: '',
    allergies: [],
    mealsPerDay: '3',
  });

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function generateDiet() {
    setLoading(true);
    setError(null);
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_TEXTS.length;
      setLoadingText(idx);
    }, 2000);

    try {
      const prompt = `Create a detailed daily meal plan for:
- Goal: ${form.goal}
- Age: ${form.age}, Weight: ${form.weight}kg, Height: ${form.height}cm
- Gender: ${form.gender}, Activity: ${form.activity}
- Diet type: ${form.dietType || 'No Restriction'}
- Allergies: ${form.allergies.join(', ') || 'none'}
- Meals per day: ${form.mealsPerDay}

Calculate TDEE and appropriate calorie target.
Format as JSON:
{
  "dailyCalories": 2200,
  "macros": { "protein": 165, "carbs": 220, "fat": 73 },
  "meals": [
    {
      "meal": "Breakfast",
      "time": "7:00 AM",
      "foods": [
        { "name": "Greek Yogurt", "amount": "200g", "calories": 140, "protein": 17 }
      ],
      "totalCalories": 450
    }
  ],
  "hydration": "string",
  "supplements": ["string"],
  "tips": ["string"]
}
Return ONLY valid JSON, no markdown, no code blocks.`;

      const raw = await callOpenAIRaw(prompt, 1800);
      const parsed = JSON.parse(raw.trim());
      setPlan(parsed);
      setSavedDiet(parsed);
      setStep(3);
    } catch (err) {
      setError(err.message === 'NO_API_KEY' ? 'API key not configured. Please add your VITE_GROQ_API_KEY to the .env file.' : '❌ Failed to generate. Try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  function startOver() {
    setPlan(null);
    setSavedDiet(null);
    setStep(1);
    setForm({ goal: '', age: '', weight: '', height: '', gender: '', activity: '', dietType: '', allergies: [], mealsPerDay: '3' });
  }

  return (
    <>
      <div className="page-wrapper" style={{ background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 16px' }}>

          {step <= 2 && !loading && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
              <p className="font-mono" style={{ color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.15em', marginBottom: '8px' }}>
                AI DIET PLANNER
              </p>
              <h1 className="font-display" style={{ fontSize: 'clamp(40px, 7vw, 64px)', color: 'var(--text)', marginBottom: '24px' }}>
                BUILD YOUR DIET
              </h1>
              {/* Progress */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Body & Goals', 'Preferences'].map((label, i) => (
                  <div key={label} style={{ flex: 1 }}>
                    <div style={{ height: '3px', borderRadius: '2px', background: i + 1 <= step ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s', marginBottom: '4px' }} />
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
            {step === 1 && !loading && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="card" style={{ padding: '32px' }}>
                  <Field label="Your Goal">
                    <ToggleGroup options={GOALS} value={form.goal} onChange={(v) => setField('goal', v)} />
                  </Field>
                  <div className="inputs-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                    {[
                      { label: 'Age', key: 'age', placeholder: 'e.g. 25' },
                      { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 75' },
                      { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175' },
                    ].map(({ label, key, placeholder }) => (
                      <Field key={key} label={label}>
                        <input type="number" value={form[key]} onChange={(e) => setField(key, e.target.value)} placeholder={placeholder} className="input-dark" />
                      </Field>
                    ))}
                  </div>
                  <Field label="Gender">
                    <ToggleGroup options={GENDERS} value={form.gender} onChange={(v) => setField('gender', v)} />
                  </Field>
                  <Field label="Activity Level">
                    <ToggleGroup options={ACTIVITIES} value={form.activity} onChange={(v) => setField('activity', v)} />
                  </Field>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(2)}
                    disabled={!form.goal || !form.age || !form.weight || !form.height || !form.gender || !form.activity}
                    className="btn-primary"
                    style={{ opacity: !form.goal || !form.age || !form.weight || !form.height || !form.gender || !form.activity ? 0.4 : 1 }}
                  >
                    Next →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && !loading && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="card" style={{ padding: '32px' }}>
                  <Field label="Diet Type">
                    <ToggleGroup options={DIET_TYPES} value={form.dietType} onChange={(v) => setField('dietType', v)} />
                  </Field>
                  <Field label="Allergies (multi-select)">
                    <ToggleGroup options={ALLERGIES} value={form.allergies} onChange={(v) => setField('allergies', v)} multi />
                  </Field>
                  <Field label="Meals per Day">
                    <ToggleGroup options={MEALS_OPTIONS} value={form.mealsPerDay} onChange={(v) => setField('mealsPerDay', v)} />
                  </Field>
                </div>

                {error && (
                  <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,69,69,0.08)', border: '1px solid rgba(255,69,69,0.2)', borderRadius: '10px' }}>
                    <p style={{ color: 'var(--accent2)' }}>
                      {error}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button onClick={() => setStep(1)} className="btn-ghost">← Back</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={generateDiet} className="btn-primary" style={{ fontSize: '16px' }}>
                    Generate Diet Plan →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div className="font-display" style={{ fontSize: '64px', color: 'var(--accent)', marginBottom: '24px' }}>🥗</div>
                <h2 className="font-display" style={{ fontSize: '32px', color: 'var(--text)', marginBottom: '16px' }}>CRAFTING YOUR DIET</h2>
                <LoadingDots text={LOADING_TEXTS[loadingText]} />
              </motion.div>
            )}

            {/* PLAN DISPLAY */}
            {step === 3 && plan && !loading && (
              <motion.div key="plan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ marginBottom: '28px' }}>
                  <p className="font-mono" style={{ color: 'var(--accent)', fontSize: '12px', letterSpacing: '0.12em', marginBottom: '8px' }}>YOUR PERSONALIZED DIET</p>
                  <h1 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 56px)', color: 'var(--text)' }}>
                    {plan.dailyCalories} KCAL / DAY
                  </h1>
                </div>

                {/* Macros */}
                <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                  <h3 className="font-display" style={{ fontSize: '22px', color: 'var(--text)', marginBottom: '20px' }}>DAILY MACROS</h3>
                  {plan.macros && (
                    <MacroChart
                      protein={plan.macros.protein}
                      carbs={plan.macros.carbs}
                      fat={plan.macros.fat}
                    />
                  )}
                </div>

                {/* Meals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {plan.meals?.map((meal, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', gap: '16px' }}
                    >
                      {/* Timeline dot */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', marginTop: '20px', flexShrink: 0 }} />
                        {i < (plan.meals.length - 1) && (
                          <div style={{ width: '1px', flex: 1, background: 'var(--border)', marginTop: '4px' }} />
                        )}
                      </div>

                      <div className="card" style={{ flex: 1, padding: '20px', marginBottom: '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <h3 className="font-display" style={{ fontSize: '22px', color: 'var(--text)' }}>{meal.meal}</h3>
                            <span className="font-mono" style={{ color: 'var(--muted)', fontSize: '12px' }}>{meal.time}</span>
                          </div>
                          <div style={{ background: 'rgba(232,255,59,0.1)', border: '1px solid rgba(232,255,59,0.2)', borderRadius: '6px', padding: '4px 12px' }}>
                            <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '14px' }}>{meal.totalCalories} kcal</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {meal.foods?.map((food, j) => (
                            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: j < meal.foods.length - 1 ? '1px solid var(--border)' : 'none', flexWrap: 'wrap', gap: '8px' }}>
                              <span style={{ color: 'var(--text)', fontSize: '14px', flex: 1, minWidth: '160px' }}>{food.name}</span>
                              <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
                                <span style={{ color: 'var(--muted)', fontSize: '13px', minWidth: '60px' }}>{food.amount}</span>
                                <span className="font-mono" style={{ color: 'var(--muted)', fontSize: '13px', minWidth: '60px' }}>{food.calories} kcal</span>
                                <span className="font-mono" style={{ color: 'var(--accent)', fontSize: '13px', minWidth: '60px' }}>{food.protein}g P</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Hydration + Supplements + Tips */}
                {(plan.hydration || plan.supplements?.length > 0 || plan.tips?.length > 0) && (
                  <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    {plan.hydration && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: 'var(--accent)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>💧 Hydration</p>
                        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{plan.hydration}</p>
                      </div>
                    )}
                    {plan.supplements?.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: 'var(--accent)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>💊 Supplements</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {plan.supplements.map((s, i) => (
                            <span key={i} style={{ padding: '4px 12px', background: 'rgba(232,255,59,0.08)', border: '1px solid rgba(232,255,59,0.15)', borderRadius: '100px', color: 'var(--muted)', fontSize: '13px' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {plan.tips?.length > 0 && (
                      <div>
                        <p style={{ color: 'var(--accent)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>💡 Tips</p>
                        {plan.tips.map((t, i) => (
                          <p key={i} style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '6px', paddingLeft: '16px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>→</span> {t}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <motion.button onClick={startOver} whileTap={{ scale: 0.97 }} className="btn-ghost">↺ Start Over</motion.button>
                  <motion.button onClick={() => navigate('/chat')} whileTap={{ scale: 0.97 }} className="btn-primary">Ask AI Coach →</motion.button>
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
