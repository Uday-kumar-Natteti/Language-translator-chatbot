export interface Language {
  code: string
  name: string
  flag: string
  nativeName: string
}

export interface Message {
  id: string
  text: string
  translatedText?: string
  timestamp: Date
  isUser: boolean
  originalLanguage: string
  targetLanguage?: string
  isTranslated?: boolean
}

export interface ChatSession {
  id: string
  messages: Message[]
  userLanguage: string
  botLanguage: string
  createdAt: Date
}

export interface TranslationResponse {
  translatedText: string
  originalLanguage: string
  targetLanguage: string
  confidence: number
}

export interface ChatResponse {
  message: string
  language: string
  context?: string
}