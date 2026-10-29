// Speech synthesis helper for reading AI voice briefings aloud

class SpeechBriefingEngine {
  private isSpeaking = false;

  speak(text: string, onEnd?: () => void, onError?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      onError?.();
      return;
    }

    // Cancel any previous utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02; // slightly dynamic, crisp pace
    utterance.pitch = 1.0;

    // Pick pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha') || v.name.includes('Karen')) &&
        v.lang.startsWith('en')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    this.isSpeaking = true;

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      console.warn('Speech utterance error:', e);
      onError?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  getSpeakingStatus(): boolean {
    return 'speechSynthesis' in window ? window.speechSynthesis.speaking : false;
  }
}

export const speechEngine = new SpeechBriefingEngine();
