const langToggle = document.getElementById('lang-toggle');
const startBtn = document.getElementById('start-btn');
const speechResult = document.getElementById('speech-result');
const translationResult = document.getElementById('translation-result');
const statusIndicator = document.getElementById('status-indicator');
const errorMsg = document.getElementById('error-msg');
const inputLangTag = document.getElementById('input-lang-tag');
const langLabelLeft = document.getElementById('lang-label-left');
const langLabelRight = document.getElementById('lang-label-right');

let recognition;
let isListening = false;
let debounceTimer;

// Initialize Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        isListening = true;
        startBtn.textContent = 'Stop Listening';
        startBtn.classList.add('listening');
        statusIndicator.classList.add('active');
        errorMsg.textContent = '';
    };

    recognition.onend = () => {
        isListening = false;
        startBtn.textContent = 'Start Listening';
        startBtn.classList.remove('listening');
        statusIndicator.classList.remove('active');
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        errorMsg.textContent = `Error: ${event.error}`;
        stopListening();
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        const currentText = finalTranscript || interimTranscript;
        if (currentText) {
            speechResult.textContent = currentText;
            
            // Translate after a short delay to avoid overwhelming the API
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                translateText(currentText);
            }, 500);
        }
    };
} else {
    errorMsg.textContent = 'Web Speech API is not supported in this browser.';
    startBtn.disabled = true;
}

function updateLanguages() {
    const isEnToFi = !langToggle.checked;
    
    if (isEnToFi) {
        recognition.lang = 'en-US';
        inputLangTag.textContent = 'Listening (English)...';
        langLabelLeft.classList.add('active');
        langLabelRight.classList.remove('active');
    } else {
        recognition.lang = 'fi-FI';
        inputLangTag.textContent = 'Listening (Finnish)...';
        langLabelLeft.classList.remove('active');
        langLabelRight.classList.add('active');
    }

    // Clear areas when switching
    speechResult.textContent = '';
    translationResult.textContent = '';
}

async function translateText(text) {
    if (!text.trim()) return;

    const isEnToFi = !langToggle.checked;
    const sourceLang = isEnToFi ? 'en' : 'fi';
    const targetLang = isEnToFi ? 'fi' : 'en';

    // Using MyMemory API (Free and fast for small requests)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseData) {
            translationResult.textContent = data.responseData.translatedText;
        }
    } catch (error) {
        console.error('Translation error:', error);
        errorMsg.textContent = 'Translation failed. Please check your connection.';
    }
}

function startListening() {
    updateLanguages();
    recognition.start();
}

function stopListening() {
    recognition.stop();
}

startBtn.addEventListener('click', () => {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
});

langToggle.addEventListener('change', () => {
    updateLanguages();
    if (isListening) {
        stopListening();
        // Wait a bit for it to stop before restarting with new language
        setTimeout(() => startListening(), 300);
    }
});

// Initial state
updateLanguages();
