import Groq from 'groq-sdk';

const AI_UNAVAILABLE = 'AI koç şu an kullanılamıyor.';
let groq = null;

try {
  const apiKey = String(import.meta.env.VITE_GROQ_API_KEY || '').trim();
  if (apiKey) {
    groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  }
} catch {
  groq = null;
}

export async function sendToGroq(messages = [], systemPrompt = '') {
  if (!groq) return AI_UNAVAILABLE;
  const promptMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;
  try {
    const completion = await groq.chat.completions.create({
      messages: promptMessages,
      model: 'llama-3.1-8b-instant',
      max_tokens: 1000,
    });
    return completion.choices?.[0]?.message?.content || AI_UNAVAILABLE;
  } catch {
    return AI_UNAVAILABLE;
  }
}

export default groq;
