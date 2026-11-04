import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function sendToGroq(messages = [], systemPrompt = '') {
  const promptMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;
  const completion = await groq.chat.completions.create({
    messages: promptMessages,
    model: 'llama-3.1-8b-instant',
    max_tokens: 1000,
  });
  return completion.choices?.[0]?.message?.content || '';
}

export default groq;
