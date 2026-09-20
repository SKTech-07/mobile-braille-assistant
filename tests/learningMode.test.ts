import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translateTextToBraille } from '../src/services/brailleTranslator';
import {
  triggerDotCheckHaptic,
  triggerNextCharacterHaptic,
  DEFAULT_HAPTIC_CONFIG
} from '../src/services/hapticEncoder';

describe('Interactive 6-Dot Vibration Learning Mode Requirements', () => {
  let vibrateMock: any;

  beforeEach(() => {
    vibrateMock = vi.fn();
    vi.stubGlobal('navigator', {
      vibrate: vibrateMock
    });
  });

  it('1. B = [1,2] produces correct vibration results (1:long, 2:long, 3:short, 4:short, 5:short, 6:short)', () => {
    const bChar = translateTextToBraille('B').characters[0];
    expect(bChar.dots).toEqual([1, 2]);

    const activeDots = bChar.dots;
    const vibrationResults: string[] = [];

    // Check dots 1 to 6 in order
    for (let dot = 1; dot <= 6; dot++) {
      const isPresent = activeDots.includes(dot as any);
      triggerDotCheckHaptic(isPresent, DEFAULT_HAPTIC_CONFIG);

      const lastVibeDuration = vibrateMock.mock.calls.at(-1)[0];
      vibrationResults.push(lastVibeDuration === DEFAULT_HAPTIC_CONFIG.longVibe ? 'LONG' : 'SHORT');
    }

    expect(vibrationResults).toEqual(['LONG', 'LONG', 'SHORT', 'SHORT', 'SHORT', 'SHORT']);
  });

  it('2. C = [1,4] produces correct vibration results (1:long, 2:short, 3:short, 4:long, 5:short, 6:short)', () => {
    const cChar = translateTextToBraille('C').characters[0];
    expect(cChar.dots).toEqual([1, 4]);

    const activeDots = cChar.dots;
    const vibrationResults: string[] = [];

    for (let dot = 1; dot <= 6; dot++) {
      const isPresent = activeDots.includes(dot as any);
      triggerDotCheckHaptic(isPresent, DEFAULT_HAPTIC_CONFIG);

      const lastVibeDuration = vibrateMock.mock.calls.at(-1)[0];
      vibrationResults.push(lastVibeDuration === DEFAULT_HAPTIC_CONFIG.longVibe ? 'LONG' : 'SHORT');
    }

    expect(vibrationResults).toEqual(['LONG', 'SHORT', 'SHORT', 'LONG', 'SHORT', 'SHORT']);
  });

  it('3. Next button after non-final character produces SHORT vibration', () => {
    const isFinalChar = false;
    triggerNextCharacterHaptic(isFinalChar, DEFAULT_HAPTIC_CONFIG);

    expect(vibrateMock).toHaveBeenCalledWith(DEFAULT_HAPTIC_CONFIG.shortVibe);
  });

  it('4. Next button after final character produces LONG vibration', () => {
    const isFinalChar = true;
    triggerNextCharacterHaptic(isFinalChar, DEFAULT_HAPTIC_CONFIG);

    expect(vibrateMock).toHaveBeenCalledWith(DEFAULT_HAPTIC_CONFIG.longVibe);
  });

  it('5. Number indicator remains a separate Braille cell', () => {
    const res = translateTextToBraille('12');
    expect(res.characters.length).toBe(3);
    // Cell 0: Number indicator [3,4,5,6]
    expect(res.characters[0].isNumberIndicator).toBe(true);
    expect(res.characters[0].dots).toEqual([3, 4, 5, 6]);
    // Cell 1: Number 1 [1]
    expect(res.characters[1].char).toBe('1');
    expect(res.characters[1].dots).toEqual([1]);
    // Cell 2: Number 2 [1,2]
    expect(res.characters[2].char).toBe('2');
    expect(res.characters[2].dots).toEqual([1, 2]);
  });
});
