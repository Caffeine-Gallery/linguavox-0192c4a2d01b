import { backend } from "declarations/backend";

class TranslationApp {
    constructor() {
        this.sourceText = document.getElementById('sourceText');
        this.targetLanguage = document.getElementById('targetLanguage');
        this.translatedText = document.getElementById('translatedText');
        this.translateBtn = document.getElementById('translateBtn');
        this.speakBtn = document.getElementById('speakBtn');
        this.historyList = document.getElementById('historyList');

        this.translateBtn.addEventListener('click', () => this.translate());
        this.speakBtn.addEventListener('click', () => this.speak());

        this.loadTranslationHistory();
    }

    async translate() {
        const text = this.sourceText.value.trim();
        const targetLang = this.targetLanguage.value;

        if (!text) {
            alert('Please enter some text to translate');
            return;
        }

        this.translateBtn.disabled = true;
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
            const data = await response.json();

            if (data.responseStatus === 200) {
                const translatedText = data.responseData.translatedText;
                this.translatedText.value = translatedText;
                this.speakBtn.disabled = false;

                // Save translation to backend
                await backend.saveTranslation(
                    text,
                    translatedText,
                    this.getLanguageName(targetLang)
                );

                await this.loadTranslationHistory();
            } else {
                throw new Error('Translation failed');
            }
        } catch (error) {
            alert('Error during translation. Please try again.');
            console.error('Translation error:', error);
        } finally {
            this.translateBtn.disabled = false;
        }
    }

    speak() {
        const text = this.translatedText.value;
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.targetLanguage.value;
        speechSynthesis.speak(utterance);
    }

    getLanguageName(code) {
        const languages = {
            'de': 'German',
            'fr': 'French',
            'es': 'Spanish'
        };
        return languages[code] || code;
    }

    async loadTranslationHistory() {
        try {
            const translations = await backend.getTranslations();
            this.historyList.innerHTML = translations.reverse().map(translation => `
                <div class="history-item">
                    <p><strong>Original:</strong> ${translation.sourceText}</p>
                    <p><strong>${translation.language}:</strong> ${translation.targetText}</p>
                    <p class="timestamp">${new Date(Number(translation.timestamp) / 1000000).toLocaleString()}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading translation history:', error);
        }
    }
}

// Initialize the app
new TranslationApp();
