const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = '/groq/openai/v1/chat/completions';

export const systemPrompt = `You are FitForge AI, an expert personal trainer and nutritionist.
You provide specific, actionable fitness and nutrition advice.
Keep responses concise and practical. Use bullet points for exercises and meal plans.
When suggesting workouts, always include: sets, reps, rest time.
When suggesting meals, always include: calories, protein, carbs, fat.
Speak like a motivating but professional coach. Never give medical advice.`;

async function groqRequest(messages, maxTokens = 800) {
  if (!API_KEY || API_KEY === 'your_groq_api_key_here') {
    throw new Error('NO_API_KEY');
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || `Groq API Error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/** Used by Chat page — accepts full conversation history */
export async function callOpenAI(messages) {
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];
  return groqRequest(fullMessages);
}

/** Used by Workout/Diet/BMI pages — single user prompt */
export async function callOpenAIRaw(userPrompt, maxTokens = 1200) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  return groqRequest(messages, maxTokens);
}
