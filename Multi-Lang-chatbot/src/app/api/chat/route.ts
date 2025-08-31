// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ChatContext {
  id: string;
  text: string;
  isUser: boolean;
  originalLanguage: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, language, context } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await generateChatResponseWithOllama(message, language, context);

    return NextResponse.json({
      message: response,
      language,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate chat response' },
      { status: 500 }
    );
  }
}

async function generateChatResponseWithOllama(
  message: string,
  language: string,
  context?: ChatContext[]
): Promise<string> {
  try {
    // Build conversation context
    const contextString =
      context?.map(ctx => `${ctx.isUser ? 'User' : 'Assistant'}: ${ctx.text}`).join('\n') +
        '\n' || '';

    const languagePrompts: Record<string, string> = {
      en: "You are a helpful multilingual assistant. Respond in English.",
      es: "Eres un asistente multilingüe. Responde en español.",
      fr: "Vous êtes un assistant multilingue. Répondez en français.",
      de: "Sie sind ein mehrsprachiger Assistent. Antworten Sie auf Deutsch.",
      it: "Sei un assistente multilingue. Rispondi in italiano.",
      pt: "Você é um assistente multilíngue. Responda em português.",
      ru: "Вы многоязычный ассистент. Отвечайте по-русски.",
      ja: "あなたは多言語アシスタントです。日本語で答えてください。",
      ko: "당신은 다국어 지원 도우미입니다. 한국어로 답변하세요.",
      zh: "你是一个多语言助手。请用中文回答。",
      ar: "أنت مساعد متعدد اللغات. أجب بالعربية.",
      hi: "आप एक बहुभाषी सहायक हैं। हिंदी में उत्तर दें।",
    };

    const systemPrompt = languagePrompts[language] || languagePrompts.en;

    const fullPrompt = `${systemPrompt}

${contextString}User: ${message}
Assistant:`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: fullPrompt,
        stream: false,
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();

    let cleanResponse =
      data.response || 'I apologize, but I cannot process your request right now.';

    return cleanResponse.replace(/^Assistant:/i, '').trim();
  } catch (error) {
    console.error('Ollama chat error:', error);
    return getFallbackChatResponse(message, language);
  }
}

function getFallbackChatResponse(message: string, language: string): string {
  const fallback: Record<string, string[]> = {
    en: [
      "I'm having trouble connecting to my language model right now.",
      "That's interesting! Let's continue once the service is restored.",
      "I hear you! I’ll be ready to help when my connection is back.",
    ],
    es: ["Tengo problemas para conectarme al modelo de lenguaje en este momento."],
    fr: ["J'ai des difficultés à me connecter au modèle de langage."],
  };

  const responses = fallback[language] || fallback.en;
  return responses[Math.floor(Math.random() * responses.length)];
}
