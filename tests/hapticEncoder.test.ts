import { describe, it, expect } from 'vitest';
import {
  encodeDotToPattern,
  encodeCharacterToPattern,
  getPatternTotalDuration,
  DEFAULT_HAPTIC_CONFIG
} from '../src/services/hapticEncoder';

describe('Temporal Haptic Encoder', () => {
  it('encodes Dot 1 to 1 short pulse', () => {
    const pattern = encodeDotToPattern(1, DEFAULT_HAPTIC_CONFIG);
    expect(pattern).toEqual([DEFAULT_HAPTIC_CONFIG.shortVibe]);
  });

  it('encodes Dot 2 to 2 short pulses separated by intraDotPause', () => {
    const pattern = encodeDotToPattern(2, DEFAULT_HAPTIC_CONFIG);
    expect(pattern).toEqual([
      DEFAULT_HAPTIC_CONFIG.shortVibe,
      DEFAULT_HAPTIC_CONFIG.intraDotPause,
      DEFAULT_HAPTIC_CONFIG.shortVibe
    ]);
  });

  it('encodes Dot 4 to 1 long pulse', () => {
    const pattern = encodeDotToPattern(4, DEFAULT_HAPTIC_CONFIG);
    expect(pattern).toEqual([DEFAULT_HAPTIC_CONFIG.longVibe]);
  });

  it('encodes B (dots 1,2) with dotPause between dot patterns', () => {
    const pattern = encodeCharacterToPattern([1, 2], DEFAULT_HAPTIC_CONFIG);
    expect(pattern).toEqual([
      DEFAULT_HAPTIC_CONFIG.shortVibe,                          // Dot 1
      DEFAULT_HAPTIC_CONFIG.dotPause,                            // Pause between dot 1 & dot 2
      DEFAULT_HAPTIC_CONFIG.shortVibe,                           // Dot 2 pulse 1
      DEFAULT_HAPTIC_CONFIG.intraDotPause,                       // intra pause
      DEFAULT_HAPTIC_CONFIG.shortVibe                            // Dot 2 pulse 2
    ]);
  });

  it('encodes C (dots 1,4) with dotPause between short and long pulses', () => {
    const pattern = encodeCharacterToPattern([1, 4], DEFAULT_HAPTIC_CONFIG);
    expect(pattern).toEqual([
      DEFAULT_HAPTIC_CONFIG.shortVibe,                          // Dot 1
      DEFAULT_HAPTIC_CONFIG.dotPause,                            // Pause
      DEFAULT_HAPTIC_CONFIG.longVibe                             // Dot 4
    ]);
  });

  it('calculates total duration correctly', () => {
    const pattern = encodeCharacterToPattern([1, 4], DEFAULT_HAPTIC_CONFIG);
    const duration = getPatternTotalDuration(pattern);
    expect(duration).toBe(
      DEFAULT_HAPTIC_CONFIG.shortVibe + DEFAULT_HAPTIC_CONFIG.dotPause + DEFAULT_HAPTIC_CONFIG.longVibe
    );
  });
});
