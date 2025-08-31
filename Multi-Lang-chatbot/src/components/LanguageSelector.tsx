'use client'

import { Language } from '@/types/chat'
import { ChevronDown, Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface LanguageSelectorProps {
  selectedLanguage: Language
  languages: Language[]
  onLanguageChange: (language: Language) => void
  label?: string
  disabled?: boolean
}

export default function LanguageSelector({ 
  selectedLanguage, 
  languages, 
  onLanguageChange, 
  label,
  disabled = false
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [])

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select language, currently ${selectedLanguage.name}`}
        className={`w-full px-4 py-3 rounded-lg border 
          ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 'hover:border-blue-400 cursor-pointer border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{selectedLanguage.flag}</span>
          <div className="text-left">
            <div className="font-semibold text-gray-800">{selectedLanguage.name}</div>
            <div className="text-sm text-gray-500">{selectedLanguage.nativeName}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {selectedLanguage.code.toUpperCase()}
          </span>
          <ChevronDown 
            size={20} 
            className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          role="listbox"
        >
          <div className="p-2">
            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
              <Globe size={16} />
              <span>Select Language</span>
            </div>
            <hr className="my-2" />
            
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                role="option"
                aria-selected={selectedLanguage.code === language.code}
                aria-label={`Select ${language.name}`}
                className={`w-full px-3 py-2 rounded-lg flex items-center space-x-3 hover:bg-blue-50 transition-colors
                  ${selectedLanguage.code === language.code ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`}
              >
                <span className="text-xl">{language.flag}</span>
                <div className="text-left flex-1">
                  <div className="font-medium">{language.name}</div>
                  <div className="text-sm text-gray-500">{language.nativeName}</div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {language.code.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
