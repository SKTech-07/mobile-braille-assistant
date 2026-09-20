import React from 'react';
import { HapticConfig } from '../types/braille';
import { isVibrationSupported } from '../services/hapticEncoder';

interface HapticControlsProps {
  config: HapticConfig;
  onChange: (newConfig: HapticConfig) => void;
}

export const HapticControls: React.FC<HapticControlsProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const vibrationAvailable = isVibrationSupported();

  const handleTestShort = () => {
    if (vibrationAvailable) {
      try {
        navigator.vibrate(config.shortVibe);
      } catch (e) {}
    }
  };

  const handleTestLong = () => {
    if (vibrationAvailable) {
      try {
        navigator.vibrate(config.longVibe);
      } catch (e) {}
    }
  };

  return (
    <div className="haptic-controls-container">
      <button
        type="button"
        className="btn-secondary btn-sm toggle-settings-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        ⚙️ Haptic Duration Settings {isOpen ? '▲' : '▼'}
      </button>

      {isOpen && (
        <div className="haptic-settings-card">
          <div className="settings-title">Vibration Durations (ms)</div>

          <div className="setting-row">
            <label htmlFor="shortVibeInput">Short Vibration (Dot Absent / Non-Final Next):</label>
            <div className="slider-wrapper">
              <input
                id="shortVibeInput"
                type="range"
                min="30"
                max="200"
                step="10"
                value={config.shortVibe}
                onChange={(e) => onChange({ ...config, shortVibe: Number(e.target.value) })}
              />
              <span className="unit-label">{config.shortVibe} ms</span>
            </div>
          </div>

          <div className="setting-row">
            <label htmlFor="longVibeInput">Long Vibration (Dot Present / Final Next):</label>
            <div className="slider-wrapper">
              <input
                id="longVibeInput"
                type="range"
                min="100"
                max="500"
                step="20"
                value={config.longVibe}
                onChange={(e) => onChange({ ...config, longVibe: Number(e.target.value) })}
              />
              <span className="unit-label">{config.longVibe} ms</span>
            </div>
          </div>

          <div className="test-vibe-bar">
            <div className="test-btn-group">
              <button
                type="button"
                className="btn-action btn-outline btn-sm"
                onClick={handleTestShort}
              >
                📳 Test Short (70ms)
              </button>
              <button
                type="button"
                className="btn-action btn-outline btn-sm"
                onClick={handleTestLong}
              >
                📳 Test Long (220ms)
              </button>
            </div>

            {!vibrationAvailable && (
              <span className="vibe-unsupported-note">
                (Vibration API unsupported on this browser — timing simulated visually)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
