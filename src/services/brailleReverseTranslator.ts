import { DotNumber, ReverseTranslationResult } from '../types/braille';
import {
  REVERSE_MAPPING,
  REVERSE_NUMBER_MAPPING,
  normalizePatternKey,
  NUMBER_INDICATOR_PATTERN
} from '../data/brailleMapping';

/**
 * Translates a user-selected 6-dot Braille pattern into a single character.
 * If the pattern is invalid or unsupported, returns isValid: false with error message.
 */
export function translateBrailleToCharacter(
  dots: DotNumber[],
  isNumberMode = false
): ReverseTranslationResult {
  if (!dots || dots.length === 0) {
    return {
      char: ' ',
      isValid: true
    };
  }

  const key = normalizePatternKey(dots);

  // 1. Check Number Indicator pattern [3,4,5,6]
  const numIndKey = normalizePatternKey(NUMBER_INDICATOR_PATTERN);
  if (key === numIndKey) {
    return {
      char: '#',
      isValid: true
    };
  }

  // 2. If in Number Mode, lookup in reverse number table first
  if (isNumberMode && key in REVERSE_NUMBER_MAPPING) {
    return {
      char: REVERSE_NUMBER_MAPPING[key],
      isValid: true
    };
  }

  // 3. Lookup in standard reverse mapping
  if (key in REVERSE_MAPPING) {
    const resultChar = REVERSE_MAPPING[key];
    if (resultChar === '[SPACE]') {
      return { char: ' ', isValid: true };
    }
    return {
      char: resultChar,
      isValid: true
    };
  }

  // 4. Invalid / Unsupported Braille pattern
  return {
    char: null,
    isValid: false,
    errorReason: 'Unsupported Braille pattern'
  };
}
