// src/app/api/languages/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.toLowerCase();

    if (query) {
      const filteredLanguages = SUPPORTED_LANGUAGES.filter(
        (lang) =>
          lang.name.toLowerCase().includes(query) ||
          lang.nativeName.toLowerCase().includes(query) ||
          lang.code.toLowerCase().includes(query)
      );

      return NextResponse.json({ languages: filteredLanguages });
    }

    return NextResponse.json({ languages: SUPPORTED_LANGUAGES });
  } catch (error) {
    console.error('Languages API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, ...params } = await req.json();

    switch (action) {
      case 'detect':
        if (!params.text) {
          return NextResponse.json(
            { error: 'Text is required for language detection' },
            { status: 400 }
          );
        }
        const detectedLanguage = await detectLanguage(params.text);
        return NextResponse.json({ detectedLanguage });

      case 'validate':
        if (!params.code) {
          return NextResponse.json(
            { error: 'Code is required for validation' },
            { status: 400 }
          );
        }
        const isValid = validateLanguageCode(params.code);
        return NextResponse.json({ isValid });

      case 'getSimilar':
        if (!params.code) {
          return NextResponse.json(
            { error: 'Code is required to find similar languages' },
            { status: 400 }
          );
        }
        const similarLanguages = getSimilarLanguages(params.code);
        return NextResponse.json({ similarLanguages });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Languages API error:', error);
    return NextResponse.json(
      { error: 'Failed to process language request' },
      { status: 500 }
    );
  }
}

async function detectLanguage(text: string): Promise<string> {
  // Basic regex/keyword heuristic
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
  if (/[\uac00-\ud7af]/.test(text)) return 'ko';
  if (/[\u0600-\u06ff]/.test(text)) return 'ar';
  if (/[\u0900-\u097f]/.test(text)) return 'hi';
  if (/[\u0400-\u04ff]/.test(text)) return 'ru';

  const lowerText = text.toLowerCase();
  if (/\b(hola|gracias|por favor)\b/.test(lowerText)) return 'es';
  if (/\b(bonjour|merci)\b/.test(lowerText)) return 'fr';
  if (/\b(hallo|danke)\b/.test(lowerText)) return 'de';
  if (/\b(ciao|grazie)\b/.test(lowerText)) return 'it';
  if (/\b(olá|obrigado)\b/.test(lowerText)) return 'pt';

  return 'en';
}

function validateLanguageCode(code: string): boolean {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}

function getSimilarLanguages(
  code: string
): Array<{ code: string; name: string; flag: string; nativeName: string }> {
  const languageFamilies: Record<string, string[]> = {
    romance: ['es', 'fr', 'it', 'pt'],
    germanic: ['en', 'de', 'nl', 'sv', 'no', 'da'],
    slavic: ['ru', 'pl'],
    east_asian: ['zh', 'ja', 'ko'],
    nordic: ['sv', 'no', 'da', 'fi'],
  };

  for (const family of Object.values(languageFamilies)) {
    if (family.includes(code)) {
      return SUPPORTED_LANGUAGES.filter(
        (lang) => family.includes(lang.code) && lang.code !== code
      );
    }
  }

  return [];
}
