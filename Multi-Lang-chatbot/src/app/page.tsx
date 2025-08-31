'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Settings, Globe, MessageCircle, Zap, Users, RotateCcw, Volume2 } from 'lucide-react'
import ChatMessage from '@/components/ChatMessage'
import LanguageSelector from '@/components/LanguageSelector'
import TranslationIndicator from '@/components/TranslationIndicator'
import { Message, Language } from '@/types/chat'

const AVAILABLE_LANGUAGES: Language[] = [
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
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' }
]

export default function MultilingualChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [userLanguage, setUserLanguage] = useState<Language>(AVAILABLE_LANGUAGES[0])
  const [botLanguage, setBotLanguage] = useState<Language>(AVAILABLE_LANGUAGES[1])
  const [showSettings, setShowSettings] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [messageCount, setMessageCount] = useState(0)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: 'Hello! I\'m your multilingual AI assistant. I can chat with you in different languages and translate messages in real-time. How can I help you today?',
      timestamp: new Date(),
      isUser: false,
      originalLanguage: 'en'
    }
    setMessages([welcomeMessage])
    setMessageCount(1)
  }, [])

  useEffect(() => {
    // Auto scroll to bottom
    if (chatContainerRef.current) {
      const element = chatContainerRef.current
      element.scrollTop = element.scrollHeight
    }
  }, [messages])

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const translateMessage = async (text: string, fromLang: string, toLang: string) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fromLang, toLang })
      })
      const data = await response.json()
      return data.translatedText || text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: generateMessageId(),
      text: inputText.trim(),
      timestamp: new Date(),
      isUser: true,
      originalLanguage: userLanguage.code
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)
    setIsTyping(true)
    setMessageCount(prev => prev + 1)

    // Simulate bot thinking time
    setTimeout(async () => {
      try {
        // Translate user message if needed
        let messageToSend = userMessage.text
        if (userLanguage.code !== botLanguage.code) {
          messageToSend = await translateMessage(userMessage.text, userLanguage.code, botLanguage.code)
        }

        // Get chatbot response
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: messageToSend,
            language: botLanguage.code,
            context: messages.slice(-5) // Send last 5 messages for context
          })
        })

        const data = await response.json()
        setIsTyping(false)

        let botResponseText = data.message || 'I apologize, but I cannot process your request right now.'
        
        // Translate bot response back to user's language if needed
        if (botLanguage.code !== userLanguage.code && autoTranslate) {
          const translatedResponse = await translateMessage(botResponseText, botLanguage.code, userLanguage.code)
          
          const botMessage: Message = {
            id: generateMessageId(),
            text: translatedResponse,
            translatedText: botResponseText,
            timestamp: new Date(),
            isUser: false,
            originalLanguage: botLanguage.code,
            targetLanguage: userLanguage.code,
            isTranslated: true
          }
          
          setMessages(prev => [...prev, botMessage])
        } else {
          const botMessage: Message = {
            id: generateMessageId(),
            text: botResponseText,
            timestamp: new Date(),
            isUser: false,
            originalLanguage: botLanguage.code
          }
          
          setMessages(prev => [...prev, botMessage])
        }
        setMessageCount(prev => prev + 1)
      } catch (error) {
        setIsTyping(false)
        console.error('Error sending message:', error)
        
        const errorMessage: Message = {
          id: generateMessageId(),
          text: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
          isUser: false,
          originalLanguage: 'en'
        }
        
        setMessages(prev => [...prev, errorMessage])
        setMessageCount(prev => prev + 1)
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  const handleTranslateMessage = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.isTranslated) return

    const targetLanguage = message.isUser ? botLanguage.code : userLanguage.code
    const translatedText = await translateMessage(message.text, message.originalLanguage, targetLanguage)
    
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, translatedText, targetLanguage, isTranslated: true }
        : m
    ))
  }

  const handleSpeak = (text: string, languageCode: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = languageCode
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const swapLanguages = () => {
    const temp = userLanguage
    setUserLanguage(botLanguage)
    setBotLanguage(temp)
  }

  const clearChat = () => {
    setMessages([])
    setMessageCount(0)
    // Re-add welcome message
    const welcomeMessage: Message = {
      id: 'welcome_new',
      text: 'Chat cleared! Ready for a fresh multilingual conversation. What would you like to talk about?',
      timestamp: new Date(),
      isUser: false,
      originalLanguage: 'en'
    }
    setMessages([welcomeMessage])
    setMessageCount(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <Globe className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Multilingual Chatbot</h1>
                <p className="text-sm text-gray-600">Break language barriers with AI</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {messageCount > 1 && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <MessageCircle size={14} />
                  <span>{messageCount} messages</span>
                </div>
              )}
              
              <div className="hidden lg:block">
                <TranslationIndicator 
                  fromLanguage={userLanguage}
                  toLanguage={botLanguage}
                  showSwap
                  onSwap={swapLanguages}
                />
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6 shadow-lg">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Chat Settings</h3>
              <button
                onClick={clearChat}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Clear all messages"
              >
                <RotateCcw size={16} />
                <span className="text-sm">Clear Chat</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <LanguageSelector
                selectedLanguage={userLanguage}
                languages={AVAILABLE_LANGUAGES}
                onLanguageChange={setUserLanguage}
                label="Your Language"
              />
              
              <LanguageSelector
                selectedLanguage={botLanguage}
                languages={AVAILABLE_LANGUAGES}
                onLanguageChange={setBotLanguage}
                label="Bot Response Language"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoTranslate"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="autoTranslate" className="text-sm text-gray-700">
                  Auto-translate bot responses to your language
                </label>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> You can speak in your language and I'll understand and respond in the bot's selected language, 
                  then translate it back if auto-translate is enabled.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Features Banner */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Real-time Chat</h3>
                <p className="text-sm text-gray-600">Instant responses</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Auto Translation</h3>
                <p className="text-sm text-gray-600">Seamless communication</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">12+ Languages</h3>
                <p className="text-sm text-gray-600">Global support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Globe size={18} />
                </div>
                <div>
                  <h3 className="font-semibold">Chat Session Active</h3>
                  <p className="text-sm text-white/80">
                    You: {userLanguage.flag} {userLanguage.name} → Bot: {botLanguage.flag} {botLanguage.name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {autoTranslate && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Auto-translate ON
                  </span>
                )}
                <button
                  onClick={() => handleSpeak('Hello, this is a test of text to speech', userLanguage.code)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  title="Test text-to-speech"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="h-96 md:h-[500px] overflow-y-auto p-6 chat-container"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Multilingual Chat</h3>
                  <p className="text-gray-500">Type a message below to begin the conversation</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onTranslate={handleTranslateMessage}
                  onSpeak={handleSpeak}
                />
              ))
            )}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Type your message in ${userLanguage.name}...`}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-lg">{userLanguage.flag}</span>
                </div>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className="p-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                style={{
                  background: isLoading ? '#9CA3AF' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
              <span>Press Enter to send • Shift+Enter for new line</span>
              <span className="flex items-center space-x-2">
                <span>Translating to {botLanguage.name}</span>
                <span>{botLanguage.flag}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Language Examples */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Try These Multilingual Examples</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Quick Phrases:</h4>
              <div className="space-y-2">
                {[
                  { text: 'Hello, how are you?', lang: 'English' },
                  { text: 'Hola, ¿cómo estás?', lang: 'Spanish' },
                  { text: 'Bonjour, comment allez-vous?', lang: 'French' },
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(example.text)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="font-medium text-gray-800">{example.text}</div>
                    <div className="text-sm text-gray-500">{example.lang}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Ask About:</h4>
              <div className="space-y-2">
                {[
                  'How do you say "thank you" in Japanese?',
                  'Tell me about French culture',
                  'Translate this to Spanish please'
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(suggestion)}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                  >
                    <div className="text-sm text-blue-800">{suggestion}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
