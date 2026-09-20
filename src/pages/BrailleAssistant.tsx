import React, { useState } from 'react';
import { AppMode, HapticConfig } from '../types/braille';
import { DEFAULT_HAPTIC_CONFIG } from '../services/hapticEncoder';
import { TextToBraille } from '../components/TextToBraille';
import { BrailleToText } from '../components/BrailleToText';

export const BrailleAssistant: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('textToBraille');
  const [hapticConfig, setHapticConfig] = useState<HapticConfig>(DEFAULT_HAPTIC_CONFIG);

  return (
    <div className="braille-assistant-app">
      {/* App Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand-badge">
            <span className="brand-icon">⠃</span>
            <div>
              <h1 className="brand-title">BRAILLE ASSISTANT</h1>
              <p className="brand-subtitle">Software-Only Mobile Accessibility</p>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <nav className="mode-switcher-nav" aria-label="Mode selection">
          <button
            type="button"
            className={`nav-tab-btn ${mode === 'textToBraille' ? 'active' : ''}`}
            onClick={() => setMode('textToBraille')}
            aria-selected={mode === 'textToBraille'}
          >
            🔤 TEXT → BRAILLE
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${mode === 'brailleToText' ? 'active' : ''}`}
            onClick={() => setMode('brailleToText')}
            aria-selected={mode === 'brailleToText'}
          >
            ⠃ BRAILLE → TEXT
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="app-main-content">
        {mode === 'textToBraille' ? (
          <TextToBraille
            hapticConfig={hapticConfig}
            onHapticConfigChange={setHapticConfig}
          />
        ) : (
          <BrailleToText />
        )}
      </main>

      {/* App Footer */}
      <footer className="app-footer">
        <p>Mobile Bidirectional Braille Assistant • Grade 1 English Braille • Software Haptics & Speech</p>
      </footer>
    </div>
  );
};
