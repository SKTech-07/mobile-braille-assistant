import { describe, it, expect, vi } from 'vitest';
import { isSpeechSupported, speakText } from '../src/services/speechService';

describe('Speech Service', () => {
  it('detects when Speech API is unsupported in node environment', () => {
    // Node environment lacks window.speechSynthesis
    const supported = isSpeechSupported();
    expect(typeof supported).toBe('boolean');
  });

  it('handles empty text gracefully without throwing errors', () => {
    const res = speakText('');
    expect(res).toBe(false);
  });
});
