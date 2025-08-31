/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'chat-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'translate-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'multilingual-gradient': 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 35%, #45b7d1 70%, #96ceb4 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'translate': 'translateY(-2px) 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}