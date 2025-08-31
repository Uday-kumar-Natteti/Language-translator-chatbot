# Multilingual Chatbot

A fully functional AI-powered multilingual chatbot built with Next.js, TypeScript, and Ollama. Break language barriers with real-time translation and natural conversation in 12+ languages.

## Features

- **Real-time Multilingual Chat**: Communicate naturally in multiple languages
- **AI-Powered Translation**: Using Ollama with llama3:latest for accurate translations
- **Auto-translation**: Automatic translation between user and bot languages
- **Text-to-Speech**: Voice output for messages in different languages
- **12+ Supported Languages**: English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi
- **Contextual Conversations**: AI remembers conversation context for better responses
- **Modern UI**: Responsive design with smooth animations and gradients
- **Message Management**: Copy, translate, and speak individual messages

## Prerequisites

Before running this project, you need to have Ollama installed and running locally.

### Install Ollama

1. **Download Ollama** from [https://ollama.ai](https://ollama.ai)
2. **Install for your platform**:
   - **macOS**: Download the .pkg installer
   - **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`
   - **Windows**: Download the installer from the website

3. **Pull the llama3 model**:
   ```bash
   ollama pull llama3:latest
   ```

4. **Verify installation**:
   ```bash
   ollama list
   ```
   You should see `llama3:latest` in the list.

5. **Start Ollama service** (if not running automatically):
   ```bash
   ollama serve
   ```

## Project Setup

1. **Clone or create the project directory**:
   ```bash
   mkdir multilingual-chatbot
   cd multilingual-chatbot
   ```

2. **Copy all the provided files** into the appropriate directories following the folder structure

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
multilingual-chatbot/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next-env.d.ts
├── README.md
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── api/
    │       ├── translate/
    │       │   └── route.ts
    │       ├── chat/
    │       │   └── route.ts
    │       └── languages/
    │           └── route.ts
    ├── components/
    │   ├── ChatMessage.tsx
    │   ├── LanguageSelector.tsx
    │   └── TranslationIndicator.tsx
    └── types/
        └── chat.ts
```

## How It Works

### Translation System
- Uses Ollama with llama3:latest for high-quality translations
- Fallback to basic phrase translations if Ollama is unavailable
- Supports bidirectional translation between any supported language pairs

### Chat System
- AI responses generated using Ollama's llama3:latest model
- Language-specific system prompts for natural responses in each language
- Context-aware conversations that remember previous messages
- Automatic translation of responses based on user preferences

### Key Components

1. **ChatMessage**: Individual message component with translation and TTS features
2. **LanguageSelector**: Dropdown for selecting input/output languages
3. **TranslationIndicator**: Visual indicator showing translation direction

## Usage

1. **Select Your Languages**: Choose your input language and the bot's response language
2. **Start Chatting**: Type messages in your language - they'll be automatically translated
3. **Toggle Auto-translate**: Enable/disable automatic translation of bot responses
4. **Use Voice**: Click the speaker icon to hear messages read aloud
5. **Manual Translation**: Click translate icon on any message for manual translation

## Supported Languages

- English (🇺🇸)
- Spanish (🇪🇸) 
- French (🇫🇷)
- German (🇩🇪)
- Italian (🇮🇹)
- Portuguese (🇵🇹)
- Russian (🇷🇺)
- Japanese (🇯🇵)
- Korean (🇰🇷)
- Chinese (🇨🇳)
- Arabic (🇸🇦)
- Hindi (🇮🇳)

## Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check if llama3:latest is installed: `ollama list`
- Verify Ollama is accessible at `http://localhost:11434`

### Translation Not Working
- Check browser console for API errors
- Ensure Ollama service is running
- Fallback translations will be used if Ollama is unavailable

### Performance Issues
- llama3:latest requires significant RAM (8GB+ recommended)
- Consider using smaller models like `llama3:8b` for faster responses
- Close other memory-intensive applications

## Customization

### Adding New Languages
1. Add language to `AVAILABLE_LANGUAGES` array in `page.tsx`
2. Add language mappings in `languages/route.ts`
3. Add fallback translations in `translate/route.ts`

### Modifying AI Behavior
- Update system prompts in `chat/route.ts`
- Adjust temperature and other parameters in Ollama API calls
- Customize response generation logic

## Production Deployment

For production deployment:
1. Set up Ollama on your server
2. Configure environment variables for API endpoints
3. Consider using external translation services for better reliability
4. Implement rate limiting and authentication as needed

## License

This project is open source and available under the MIT License.