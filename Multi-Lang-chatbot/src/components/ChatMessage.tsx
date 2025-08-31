'use client'

import { Message } from '@/types/chat'
import { Languages, Volume2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ChatMessageProps {
  message: Message
  onTranslate?: (messageId: string) => void
  onSpeak?: (text: string, language: string) => void
}

export default function ChatMessage({ message, onTranslate, onSpeak }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const formatTime = (timestamp: string | number | Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}>
      <div className="max-w-xs lg:max-w-md">
        {/* Main Message Bubble */}
        <div className={`chat-bubble ${message.isUser ? 'user' : 'bot'} relative group`}>
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium leading-relaxed flex-1">
              {message.text}
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleCopy(message.text)}
                className="p-1 rounded hover:bg-white/20 transition-colors"
                title="Copy message"
                aria-label="Copy message"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              
              {onSpeak && (
                <button
                  onClick={() => onSpeak(message.text, message.originalLanguage)}
                  className="p-1 rounded hover:bg-white/20 transition-colors ml-1"
                  title="Speak message"
                  aria-label="Speak message"
                >
                  <Volume2 size={14} />
                </button>
              )}
              
              {onTranslate && !message.isTranslated && (
                <button
                  onClick={() => onTranslate(message.id)}
                  className="p-1 rounded hover:bg-white/20 transition-colors ml-1"
                  title="Translate message"
                  aria-label="Translate message"
                >
                  <Languages size={14} /> {/* ✅ updated */}
                </button>
              )}
            </div>
          </div>
          
          {/* Translation Display */}
          {message.isTranslated && message.translatedText && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs opacity-80 mb-1">
                Translation ({message.targetLanguage?.toUpperCase()}):
              </p>
              <p className="text-sm italic">
                {message.translatedText}
              </p>
            </div>
          )}
        </div>
        
        {/* Message Metadata */}
        <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 ${
          message.isUser ? 'justify-end' : 'justify-start'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          
          {message.originalLanguage && (
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              {message.originalLanguage.toUpperCase()}
            </span>
          )}
          
          {message.isTranslated && (
            <span className="flex items-center space-x-1">
              <Languages size={12} />
              <span>Translated</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
