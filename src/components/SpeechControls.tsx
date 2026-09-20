import React from 'react';
import { isSpeechSupported, speakText, cancelSpeech } from '../services/speechService';

interface SpeechControlsProps {
  textToSpeak: string;
}

export const SpeechControls: React.FC<SpeechControlsProps> = ({ textToSpeak }) => {
  const speechAvailable = isSpeechSupported();
  const [speechStatus, setSpeechStatus] = React.useState<string | null>(null);

  const handleSpeak = () => {
    if (!speechAvailable) {
      setSpeechStatus('Text-to-Speech is not supported on this browser/device.');
      return;
    }

    if (!textToSpeak || textToSpeak.trim() === '') {
      setSpeechStatus('No text to speak.');
      return;
    }

    setSpeechStatus('Speaking...');
    const success = speakText(textToSpeak, { rate: 0.95 });

    if (!success) {
      setSpeechStatus('Unable to play speech synthesis.');
    } else {
      setTimeout(() => setSpeechStatus(null), 3000);
    }
  };

  const handleStop = () => {
    cancelSpeech();
    setSpeechStatus(null);
  };

  return (
    <div className="speech-controls-card">
      <div className="speech-actions">
        <button
          type="button"
          className="btn-action btn-speak"
          onClick={handleSpeak}
          disabled={!textToSpeak || textToSpeak.trim() === ''}
          aria-label="Speak text aloud"
        >
          🔊 Speak
        </button>

        <button
          type="button"
          className="btn-action btn-outline"
          onClick={handleStop}
          aria-label="Stop speech"
        >
          ⏹ Stop Speech
        </button>
      </div>

      {!speechAvailable && (
        <div className="notice-banner warning-notice">
          ⚠️ Text-to-Speech API is not supported on this browser/device.
        </div>
      )}

      {speechStatus && speechAvailable && (
        <div className="notice-banner info-notice">
          {speechStatus}
        </div>
      )}
    </div>
  );
};
