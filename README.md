# TransLive | Live Voice Language Translator

TransLive is a premium, real-time voice translation application that bridges communication between **English** and **Finnish**. Designed with a focus on speed, precision, and aesthetics, it provides a seamless translation experience directly in your browser.

## ✨ Features

- 🎤 **Live Speech Recognition**: Captures voice input instantly using the Web Speech API.
- 🌍 **Instant Translation**: Powered by the fast and reliable MyMemory API.
- 🔄 **Bilingual Toggle**: Effortlessly switch between English → Finnish and Finnish → English modes.
- 💎 **Premium UI/UX**:
  - **Glassmorphism**: Elegant, semi-transparent card designs.
  - **Dark Mode**: A sleek and modern obsidian-dark theme.
  - **Animated Atmosphere**: Dynamic background color blobs that respond to your presence.
  - **Micro-animations**: Glowing status indicators for real-time feedback.
- 📱 **Fully Responsive**: Optimized for both desktop and mobile viewing.

## 🚀 How to Run

### Option 1: Using a Local Server (Recommended)
To use the Web Speech API features effectively, it's best to run the app through a local development server:
1. Open your terminal in the project directory.
2. Run `npx serve` (if you have Node.js installed) or use a Live Server extension in VS Code.
3. Open the provided `localhost` link in your browser.

### Option 2: Opening Directly
You can also simply double-click `index.html` to open it in any modern browser (Chrome or Edge are recommended for the best Speech API support).

## 🛠️ Built With

- **HTML5**: Semantic structure for better accessibility and SEO.
- **Vanilla CSS3**: Custom design system including glassmorphism and animations.
- **Vanilla JavaScript**: Lightweight and fast logic for speech handling and API integration.
- **Web Speech API**: Browser-native transcription for low-latency performance.
- **MyMemory API**: A free, fast, and multi-lingual translation engine.

## 📝 Usage

1. **Choose your language**: Use the toggle at the top to select either English or Finnish as your input language.
2. **Start Listening**: Click the **"Start Listening"** button and grant microphone permission when prompted.
3. **Speak**: Speak clearly into your microphone. Your words will appear in the left card, and the translation will automatically show up on the right.
4. **Stop**: Click **"Stop Listening"** when you're finished.

---

> [!IMPORTANT]
> A microphone and a stable internet connection are required for transcription and translation to work.
