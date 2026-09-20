import React, { useState } from 'react';
import { DotNumber } from '../types/braille';
import { translateBrailleToCharacter } from '../services/brailleReverseTranslator';
import { triggerHapticForCharacter, isVibrationSupported } from '../services/hapticEncoder';
import { BrailleCell } from './BrailleCell';
import { SpeechControls } from './SpeechControls';

export const BrailleToText: React.FC = () => {
  const [selectedDots, setSelectedDots] = useState<DotNumber[]>([]);
  const [textBuffer, setTextBuffer] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNumberMode, setIsNumberMode] = useState<boolean>(false);

  const handleDotToggle = (dot: DotNumber) => {
    setErrorMessage(null);

    // Light tactile feedback on tap if supported
    if (isVibrationSupported()) {
      try {
        navigator.vibrate(25);
      } catch (e) {
        // Ignore
      }
    }

    setSelectedDots((prev) => {
      if (prev.includes(dot)) {
        return prev.filter((d) => d !== dot);
      } else {
        return [...prev, dot].sort((a, b) => a - b);
      }
    });
  };

  const handleAddCharacter = () => {
    setErrorMessage(null);

    if (selectedDots.length === 0) {
      setErrorMessage('Please tap at least one dot to create a character.');
      return;
    }

    const result = translateBrailleToCharacter(selectedDots, isNumberMode);

    if (!result.isValid || !result.char) {
      setErrorMessage('Unsupported Braille pattern');
      return;
    }

    if (result.char === '#') {
      setIsNumberMode(true);
      setSelectedDots([]);
      return;
    }

    // Add character to text buffer
    setTextBuffer((prev) => prev + result.char);
    setIsNumberMode(false); // Reset number mode after character entry
    setSelectedDots([]); // Reset cell for next character
  };

  const handleAddSpace = () => {
    setErrorMessage(null);
    setTextBuffer((prev) => prev + ' ');
    setSelectedDots([]);
    setIsNumberMode(false);
  };

  const handleBackspace = () => {
    setErrorMessage(null);
    setTextBuffer((prev) => prev.slice(0, -1));
  };

  const handleClearCell = () => {
    setErrorMessage(null);
    setSelectedDots([]);
  };

  const handleReset = () => {
    setErrorMessage(null);
    setSelectedDots([]);
    setTextBuffer('');
    setIsNumberMode(false);
  };

  return (
    <div className="mode-section braille-to-text-mode">
      <div className="mode-header">
        <h2>Braille → Text Mode</h2>
        <p className="mode-description">
          Tap the 6 dots to build a Braille pattern, then press <strong>Add Character</strong> to convert to text.
        </p>
      </div>

      {/* Interactive 6-Dot Cell Card */}
      <div className="card cell-input-card">
        <div className="selected-summary-bar">
          <span className="summary-label">Selected dots:</span>
          <span className="summary-value">
            {selectedDots.length > 0 ? selectedDots.join(', ') : 'None'}
          </span>
          {isNumberMode && <span className="number-mode-badge">🔢 Number Mode Active</span>}
        </div>

        {errorMessage && (
          <div className="notice-banner error-notice" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="interactive-cell-stage">
          <BrailleCell
            selectedDots={selectedDots}
            onDotToggle={handleDotToggle}
            interactive={true}
            size="large"
          />
        </div>

        {/* Input Action Controls */}
        <div className="cell-actions-grid">
          <button
            type="button"
            className="btn-action btn-add-char"
            onClick={handleAddCharacter}
          >
            ✓ Add Character
          </button>

          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={handleAddSpace}
          >
            ␣ Space
          </button>

          <button
            type="button"
            className="btn-action btn-secondary"
            onClick={handleBackspace}
            disabled={textBuffer.length === 0}
          >
            ⌫ Backspace
          </button>

          <button
            type="button"
            className="btn-action btn-outline"
            onClick={handleClearCell}
            disabled={selectedDots.length === 0}
          >
            ✕ Clear Cell
          </button>
        </div>
      </div>

      {/* Text Buffer Output Display Card */}
      <div className="card output-buffer-card">
        <div className="buffer-header">
          <span className="card-label">Generated Text:</span>
          <button
            type="button"
            className="btn-text-link"
            onClick={handleReset}
            disabled={textBuffer.length === 0 && selectedDots.length === 0}
          >
            Reset All
          </button>
        </div>

        <div className="text-buffer-display">
          {textBuffer ? textBuffer : <span className="buffer-placeholder">Your typed text will appear here...</span>}
        </div>

        {/* Speech Controls Component */}
        <SpeechControls textToSpeak={textBuffer} />
      </div>
    </div>
  );
};
