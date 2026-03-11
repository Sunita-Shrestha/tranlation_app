const videoPlayer = document.getElementById('video-player');
const videoContainer = document.getElementById('video-container');
const subtitleOverlay = document.getElementById('subtitle-overlay');
const cameraBtn = document.getElementById('camera-btn');

let recognition;
let isListening = false;
let debounceTimer;
let cameraStream = null;

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
        if (event.error !== 'no-speech') {
            errorMsg.textContent = `Error: ${event.error}`;
            stopListening();
        }
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
            updateSubtitles(currentText);
            
            // Translate after a short delay
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

function updateSubtitles(text) {
    if (!text) {
        subtitleOverlay.innerHTML = '';
        return;
    }
    subtitleOverlay.innerHTML = `<span class="subtitle-entry">${text}</span>`;
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
    subtitleOverlay.innerHTML = '';
}

async function translateText(text) {
    if (!text.trim()) return;

    const isEnToFi = !langToggle.checked;
    const sourceLang = isEnToFi ? 'en' : 'fi';
    const targetLang = isEnToFi ? 'fi' : 'en';

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseData) {
            const translated = data.responseData.translatedText;
            translationResult.textContent = translated;
            // Update subtitles with translation if it's a video
            if (videoPlayer.src) {
               updateSubtitles(`${text}<br><span style="font-size:0.9em;opacity:0.8;">${translated}</span>`);
            }
        }
    } catch (error) {
        console.error('Translation error:', error);
    }
}

function startListening() {
    updateLanguages();
    try {
        recognition.start();
    } catch (e) {
        console.log("Already listening");
    }
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
        setTimeout(() => startListening(), 300);
    }
});

// Video Handling
videoUpload.addEventListener('change', (e) => {
    stopCamera(); // Stop camera if active
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        videoPlayer.src = url;
        videoContainer.style.display = 'block';
        
        // When video plays, start listening
        videoPlayer.onplay = () => {
            startListening();
        };
        
        // When video pauses, stop listening
        videoPlayer.onpause = () => {
            stopListening();
        };

        videoPlayer.onended = () => {
            stopListening();
        };
    }
});

async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoPlayer.srcObject = cameraStream;
        videoPlayer.src = ''; // Clear file src if any
        videoContainer.style.display = 'block';
        videoPlayer.play();
        cameraBtn.querySelector('span').textContent = '🚫 Stop Camera';
        startListening();
    } catch (err) {
        console.error("Camera access denied:", err);
        errorMsg.textContent = "Error: Camera access denied.";
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        videoPlayer.srcObject = null;
        cameraBtn.querySelector('span').textContent = '📷 Live Camera';
        stopListening();
    }
}

cameraBtn.addEventListener('click', () => {
    if (cameraStream) {
        stopCamera();
    } else {
        startCamera();
    }
});

// Initial state
updateLanguages();
