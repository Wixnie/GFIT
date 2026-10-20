import { suggestionReason } from './suggestions'

/**
 * Get AI coach advice from Groq Cloud API
 * @param {Object} params - { totals, targets, remaining, workouts, profileName }
 * @returns {Promise<string>} - AI-generated meal suggestion
 */
export async function getAICoachAdvice({ totals, targets, remaining, workouts, profileName }) {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    console.log('Groq API key not configured, using fallback')
    return fallback(remaining)
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Sen GFitt sporcu beslenme koçusun. Kullanıcının günlük makro hedeflerini, gün içinde yaptığı antrenmanı ve kalan kalori/protein açığını analiz et. Motive edici, profesyonel, doğrudan Türk mutfağına uygun öneriler içeren ve maksimum 2-3 cümleden oluşan net bir akşam öğünü tavsiyesi ver.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              totals,
              targets,
              remaining,
              workouts: workouts.length,
              profileName
            }),
          },
        ],
      }),
    })

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status}`)
    }

    const data = await res.json()
    return data.choices[0].message.content
  } catch (err) {
    console.error('AI Coach error:', err)
    return fallback(remaining)
  }
}

function fallback(remaining) {
  return suggestionReason(remaining)
}
