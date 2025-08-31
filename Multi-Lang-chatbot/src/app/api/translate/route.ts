// src/app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { text, fromLang, toLang } = await req.json();

    if (!text || !fromLang || !toLang) {
      return NextResponse.json(
        { error: 'Text, fromLang, and toLang are required' },
        { status: 400 }
      );
    }

    // If same language, return original text
    if (fromLang === toLang) {
      return NextResponse.json({
        translatedText: text,
        originalLanguage: fromLang,
        targetLanguage: toLang,
        confidence: 1.0,
      });
    }

    try {
      const translatedText = await translateWithOllama(text, fromLang, toLang);

      return NextResponse.json({
        translatedText,
        originalLanguage: fromLang,
        targetLanguage: toLang,
        confidence: 0.9,
      });
    } catch (ollamaError) {
      console.error('Ollama translation error:', ollamaError);

      // Fallback to simple translations for demo
      const fallbackTranslation = getFallbackTranslation(text, fromLang, toLang);

      return NextResponse.json({
        translatedText: fallbackTranslation || text,
        originalLanguage: fromLang,
        targetLanguage: toLang,
        confidence: 0.3,
        fallback: true,
      });
    }
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
}

async function translateWithOllama(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  const prompt = `Translate the following text from ${fromLang} to ${toLang}. 
Return only the translated text, without explanations.

Text: "${text}"`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3:latest',
      prompt,
      stream: false,
      temperature: 0.3, // lower temp for translations = more deterministic
      top_p: 0.9,
      num_predict: 300,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.response) {
    throw new Error('No response from Ollama');
  }

  return data.response.trim();
}

// Simple fallback translations for common phrases
function getFallbackTranslation(
  text: string,
  fromLang: string,
  toLang: string
): string | null {
  const lowercaseText = text.toLowerCase().trim();

  const translations: Record<string, Record<string, string>> = {
    hello: {
      es: 'Hola',
      fr: 'Bonjour',
      de: 'Hallo',
      it: 'Ciao',
      pt: 'Olá',
      ru: 'Привет',
      ja: 'こんにちは',
      ko: '안녕하세요',
      zh: '你好',
      ar: 'مرحبا',
      hi: 'नमस्ते',
    },
    'how are you?': {
      es: '¿Cómo estás?',
      fr: 'Comment allez-vous?',
      de: 'Wie geht es dir?',
      it: 'Come stai?',
      pt: 'Como está?',
      ru: 'Как дела?',
      ja: '元気ですか？',
      ko: '어떻게 지내세요?',
      zh: '你好吗？',
      ar: 'كيف حالك؟',
      hi: 'आप कैसे हैं?',
    },
    'thank you': {
      es: 'Gracias',
      fr: 'Merci',
      de: 'Danke',
      it: 'Grazie',
      pt: 'Obrigado',
      ru: 'Спасибо',
      ja: 'ありがとう',
      ko: '감사합니다',
      zh: '谢谢',
      ar: 'شكرا لك',
      hi: 'धन्यवाद',
    },
    goodbye: {
      es: 'Adiós',
      fr: 'Au revoir',
      de: 'Auf Wiedersehen',
      it: 'Arrivederci',
      pt: 'Tchau',
      ru: 'До свидания',
      ja: 'さようなら',
      ko: '안녕히 가세요',
      zh: '再见',
      ar: 'مع السلامة',
      hi: 'अलविदा',
    },
    yes: {
      es: 'Sí',
      fr: 'Oui',
      de: 'Ja',
      it: 'Sì',
      pt: 'Sim',
      ru: 'Да',
      ja: 'はい',
      ko: '네',
      zh: '是的',
      ar: 'نعم',
      hi: 'हाँ',
    },
    no: {
      es: 'No',
      fr: 'Non',
      de: 'Nein',
      it: 'No',
      pt: 'Não',
      ru: 'Нет',
      ja: 'いいえ',
      ko: '아니요',
      zh: '不是',
      ar: 'لا',
      hi: 'नहीं',
    },
  };

  if (translations[lowercaseText] && translations[lowercaseText][toLang]) {
    return translations[lowercaseText][toLang];
  }

  return null;
}
