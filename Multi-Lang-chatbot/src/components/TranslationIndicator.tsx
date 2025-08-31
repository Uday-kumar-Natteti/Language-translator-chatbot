'use client'

import { Languages, ArrowRightLeft, Sparkles } from 'lucide-react'
import { Language } from '@/types/chat'

interface TranslationIndicatorProps {
  fromLanguage: Language
  toLanguage: Language
  isTranslating?: boolean
  showSwap?: boolean
  onSwap?: () => void
  className?: string
}

export default function TranslationIndicator({ 
  fromLanguage, 
  toLanguage, 
  isTranslating = false,
  showSwap = false,
  onSwap,
  className = ""
}: TranslationIndicatorProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* From Language */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
        <span className="text-lg">{fromLanguage.flag}</span>
        <div className="text-sm">
          <div className="font-semibold text-blue-800">{fromLanguage.name}</div>
          <div className="text-blue-600 text-xs">{fromLanguage.code.toUpperCase()}</div>
        </div>
      </div>

      {/* Translation Arrow/Indicator */}
      <div className="relative flex items-center min-w-[120px] justify-center">
        {isTranslating ? (
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-sm font-medium">Translating…</span>
          </div>
        ) : showSwap && onSwap ? (
          <button
            onClick={onSwap}
            aria-label="Swap languages"
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
          >
            <ArrowRightLeft 
              size={18} 
              className="text-gray-600 group-hover:text-gray-800 transform group-hover:scale-110 transition-all" 
            />
          </button>
        ) : (
          <div className="flex items-center space-x-1 text-gray-500">
            <Languages size={18} />
            <ArrowRightLeft size={16} />
          </div>
        )}
      </div>

      {/* To Language */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
        <span className="text-lg">{toLanguage.flag}</span>
        <div className="text-sm">
          <div className="font-semibold text-green-800">{toLanguage.name}</div>
          <div className="text-green-600 text-xs">{toLanguage.code.toUpperCase()}</div>
        </div>
      </div>
    </div>
  )
}
