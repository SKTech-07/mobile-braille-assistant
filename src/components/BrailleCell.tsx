import React from 'react';
import { DotNumber } from '../types/braille';

export interface BrailleCellProps {
  // Mode selection
  mode?: 'interactive' | 'learning';

  // Props for Interactive Selection Mode (Braille -> Text)
  selectedDots?: DotNumber[];
  playingDots?: DotNumber[];
  onDotToggle?: (dot: DotNumber) => void;

  // Props for Interactive Learning Mode (Text -> Braille)
  currentDotIndex?: DotNumber | null;
  checkedDots?: DotNumber[];
  activeDots?: DotNumber[];           // Dots present in current character
  invalidDotFlash?: DotNumber | null;  // Flashes briefly if user taps wrong dot order

  interactive?: boolean;
  size?: 'normal' | 'large';
  label?: string;
}

export const BrailleCell: React.FC<BrailleCellProps> = ({
  mode = 'interactive',
  selectedDots = [],
  playingDots = [],
  onDotToggle,
  currentDotIndex = null,
  checkedDots = [],
  activeDots = [],
  invalidDotFlash = null,
  interactive = true,
  size = 'large',
  label
}) => {
  const leftColumnDots: DotNumber[] = [1, 2, 3];
  const rightColumnDots: DotNumber[] = [4, 5, 6];

  const handleDotClick = (dot: DotNumber) => {
    if (interactive && onDotToggle) {
      onDotToggle(dot);
    }
  };

  const renderDotButton = (dot: DotNumber) => {
    let dotStateClass = 'state-inactive';
    let badgeContent: React.ReactNode = null;
    let ariaStatus = 'Unchecked';
    let isPressed = false;

    if (mode === 'learning') {
      const isChecked = checkedDots.includes(dot);
      const isCurrentTarget = dot === currentDotIndex;
      const isPresentInChar = activeDots.includes(dot);
      const isInvalidFlash = dot === invalidDotFlash;

      if (isChecked) {
        if (isPresentInChar) {
          dotStateClass = 'state-checked-present';
          badgeContent = '✓';
          ariaStatus = 'Checked (Present)';
          isPressed = true;
        } else {
          dotStateClass = 'state-checked-absent';
          badgeContent = '○';
          ariaStatus = 'Checked (Absent)';
        }
      } else if (isCurrentTarget) {
        dotStateClass = 'state-current';
        badgeContent = '🎯';
        ariaStatus = 'Current Target';
      } else {
        dotStateClass = 'state-unchecked';
        ariaStatus = 'Unchecked';
      }

      if (isInvalidFlash) {
        dotStateClass += ' state-invalid-flash';
      }
    } else {
      // Interactive Mode (Braille -> Text)
      const isSelected = selectedDots.includes(dot);
      const isPlaying = playingDots.includes(dot);

      if (isPlaying) {
        dotStateClass = 'state-playing';
        ariaStatus = 'Playing';
      } else if (isSelected) {
        dotStateClass = 'state-selected';
        badgeContent = '✓';
        ariaStatus = 'Selected';
        isPressed = true;
      } else {
        dotStateClass = 'state-inactive';
        ariaStatus = 'Inactive';
      }
    }

    return (
      <button
        key={`braille-dot-${dot}`}
        type="button"
        className={`braille-dot-btn dot-${dot} ${dotStateClass}`}
        onClick={() => handleDotClick(dot)}
        disabled={!interactive}
        aria-label={`Dot ${dot}, ${ariaStatus}`}
        aria-pressed={isPressed}
      >
        <span className="dot-circle">
          <span className="dot-inner"></span>
          {badgeContent && <span className="dot-check-badge">{badgeContent}</span>}
        </span>
        <span className="dot-number-label">{dot}</span>
      </button>
    );
  };

  return (
    <div className={`braille-cell-container size-${size}`}>
      {label && <div className="braille-cell-header">{label}</div>}

      <div className="braille-cell-grid">
        <div className="braille-cell-column">
          {leftColumnDots.map(renderDotButton)}
        </div>
        <div className="braille-cell-column">
          {rightColumnDots.map(renderDotButton)}
        </div>
      </div>
    </div>
  );
};
