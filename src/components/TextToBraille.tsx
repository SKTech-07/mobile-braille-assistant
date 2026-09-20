import React, { useState, useEffect } from 'react';
import { BrailleCharacter, HapticConfig, DotNumber } from '../types/braille';
import { translateTextToBraille } from '../services/brailleTranslator';
import {
  triggerDotCheckHaptic,
  triggerNextCharacterHaptic,
  isVibrationSupported
} from '../services/hapticEncoder';
import { BrailleCell } from './BrailleCell';
import { HapticControls } from './HapticControls';

interface TextToBrailleProps {
  hapticConfig: HapticConfig;
  onHapticConfigChange: (config: HapticConfig) => void;
}

export const TextToBraille: React.FC<TextToBrailleProps> = ({
  hapticConfig,
  onHapticConfigChange
}) => {
  const [inputText, setInputText] = useState('BC');
  const [brailleSequence, setBrailleSequence] = useState<BrailleCharacter[]>([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Interactive Learning Mode Dot State
  const [currentDotIndex, setCurrentDotIndex] = useState<DotNumber | 7>(1);
  const [checkedDots, setCheckedDots] = useState<DotNumber[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [invalidDotFlash, setInvalidDotFlash] = useState<DotNumber | null>(null);

  const vibrationAvailable = isVibrationSupported();

  // Initial conversion
  useEffect(() => {
    handleConvert();
  }, []);

  const handleConvert = () => {
    const result = translateTextToBraille(inputText);
    setBrailleSequence(result.characters);
    setCurrentCharIndex(0);
    setCurrentDotIndex(1);
    setCheckedDots([]);
    setIsCompleted(false);
    setInvalidDotFlash(null);
  };

  const currentCharacter: BrailleCharacter | undefined = brailleSequence[currentCharIndex];
  const activeDots: DotNumber[] = currentCharacter?.dots || [];

  // Handle dot tap in strict 1 -> 6 order
  const handleDotTap = (tappedDot: DotNumber) => {
    if (isCompleted || currentDotIndex > 6) return;

    // Strict order check
    if (tappedDot !== currentDotIndex) {
      // Flash invalid dot indicator briefly without advancing sequence or vibrating
      setInvalidDotFlash(tappedDot);
      setTimeout(() => setInvalidDotFlash(null), 300);
      return;
    }

    // Correct expected dot tapped!
    const isPresent = activeDots.includes(tappedDot);

    // Trigger dot vibration (LONG = present, SHORT = absent)
    triggerDotCheckHaptic(isPresent, hapticConfig);

    // Mark dot as checked and advance dot index
    setCheckedDots((prev) => [...prev, tappedDot]);
    const nextDot = (currentDotIndex + 1) as DotNumber | 7;
    setCurrentDotIndex(nextDot);
  };

  // Next Character Button Handler
  const handleNextCharacter = () => {
    if (currentDotIndex <= 6) return; // Must complete dots 1-6 first

    const isFinalChar = currentCharIndex >= brailleSequence.length - 1;

    // Trigger Next Character vibration (SHORT = non-final, LONG = final)
    triggerNextCharacterHaptic(isFinalChar, hapticConfig);

    if (!isFinalChar) {
      // Load next character
      setCurrentCharIndex((prev) => prev + 1);
      setCurrentDotIndex(1);
      setCheckedDots([]);
    } else {
      // Complete entire text
      setIsCompleted(true);
    }
  };

  const isCharComplete = currentDotIndex > 6;

  return (
    <div className="mode-section text-to-braille-mode">
      <div className="mode-header">
        <h2>Text → Braille Learning Mode</h2>
        <p className="mode-description">
          Check dots 1 to 6 in order to learn the Braille pattern. Feel <strong>LONG vibration</strong> if present, or <strong>SHORT vibration</strong> if absent.
        </p>
      </div>

      {/* Vibration Unsupported Banner */}
      {!vibrationAvailable && (
        <div className="notice-banner warning-notice">
          ⚠️ Vibration is not supported on this device/browser. Interactive visual checking will still work.
        </div>
      )}

      {/* Input Section */}
      <div className="card input-card">
        <label htmlFor="textInput" className="card-label">Enter text:</label>
        <div className="input-group">
          <input
            id="textInput"
            type="text"
            className="main-text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type text e.g. 'BC' or 'HELLO'"
          />
          <button
            type="button"
            className="btn-action btn-primary"
            onClick={handleConvert}
          >
            Convert to Braille
          </button>
        </div>
      </div>

      {/* Interactive Braille Cell & Learning Display Card */}
      {brailleSequence.length > 0 && (
        <div className="card display-card">
          {/* Progress Row */}
          <div className="progress-bar-row">
            <span className="progress-badge">
              Character {currentCharIndex + 1} / {brailleSequence.length}
            </span>
            <span className="char-badge">
              Current: <strong>{currentCharacter?.char || 'Space'}</strong>
            </span>
            <span className="dot-progress-badge">
              {isCompleted
                ? 'Text Complete ✓'
                : isCharComplete
                ? 'Character Complete'
                : `Dot ${currentDotIndex} / 6`}
            </span>
          </div>

          {/* Dynamic Instruction Header */}
          <div className="learning-instruction-banner">
            {isCompleted ? (
              <span className="text-complete-msg">🎉 Text complete ✓</span>
            ) : isCharComplete ? (
              <span className="char-complete-msg">Character complete ✓ Press Next Character below.</span>
            ) : (
              <span className="dot-instruction-msg">👉 Tap dot {currentDotIndex}</span>
            )}
          </div>

          {/* 6-Dot Learning Cell Stage */}
          <div className="braille-visual-stage">
            <BrailleCell
              mode="learning"
              currentDotIndex={isCharComplete || isCompleted ? null : (currentDotIndex as DotNumber)}
              checkedDots={checkedDots}
              activeDots={activeDots}
              onDotToggle={handleDotTap}
              invalidDotFlash={invalidDotFlash}
              interactive={!isCompleted && !isCharComplete}
              size="large"
            />
          </div>

          {/* Navigation Action Bar */}
          <div className="learning-navigation-bar">
            <button
              type="button"
              className="btn-action btn-next-char"
              onClick={handleNextCharacter}
              disabled={!isCharComplete || isCompleted}
              aria-label="Next Character"
            >
              {isCompleted
                ? 'Text Complete ✓'
                : currentCharIndex >= brailleSequence.length - 1
                ? 'Finish Text →'
                : 'Next Character →'}
            </button>
          </div>
        </div>
      )}

      {/* Simplified Haptic Timing Controls */}
      <HapticControls config={hapticConfig} onChange={onHapticConfigChange} />
    </div>
  );
};
