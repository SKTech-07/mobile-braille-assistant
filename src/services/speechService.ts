/**
 * Checks if Web Speech API text-to-speech is supported by current browser
 */
export function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

export interface SpeechOptions {
  rate?: number;  // 0.5 to 2.0 (default 1.0)
  pitch?: number; // 0.5 to 1.5 (default 1.0)
  lang?: string;  // default 'en-US'
}

/**
 * Speaks text using Web Speech API
 */
export function speakText(text: string, options: SpeechOptions = {}): boolean {
  if (!isSpeechSupported()) {
    return false;
  }

  if (!text || text.trim() === '') {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.lang = options.lang ?? 'en-US';

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Cancels current speech output
 */
export function cancelSpeech(): void {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}
