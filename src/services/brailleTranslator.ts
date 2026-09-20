import { BrailleCharacter, TranslationResult, DotNumber } from '../types/braille';
import {
  LETTER_MAPPINGS,
  NUMBER_MAPPINGS,
  NUMBER_INDICATOR_PATTERN,
  PUNCTUATION_MAPPINGS
} from '../data/brailleMapping';

/**
 * Translates an English text string into a sequence of 6-dot Braille characters.
 */
export function translateTextToBraille(text: string): TranslationResult {
  const characters: BrailleCharacter[] = [];
  const unknownChars: string[] = [];

  if (!text) {
    return { characters: [], originalText: '', unknownChars: [] };
  }

  let inNumberMode = false;

  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];
    const lowerChar = rawChar.toLowerCase();

    // 1. Space resets number mode
    if (rawChar === ' ') {
      inNumberMode = false;
      characters.push({
        char: ' ',
        dots: [],
        description: 'Space'
      });
      continue;
    }

    // 2. Number handling (0-9)
    if (/\d/.test(rawChar)) {
      if (!inNumberMode) {
        // Prepend Number Indicator [3,4,5,6]
        characters.push({
          char: '#',
          dots: NUMBER_INDICATOR_PATTERN,
          isNumberIndicator: true,
          description: 'Number Indicator'
        });
        inNumberMode = true;
      }

      const numDots = NUMBER_MAPPINGS[rawChar];
      if (numDots) {
        characters.push({
          char: rawChar,
          dots: numDots,
          isNumber: true,
          description: `Number ${rawChar}`
        });
      }
      continue;
    }

    // Standard non-digit character resets number mode
    inNumberMode = false;

    // 3. Letters (A-Z, a-z)
    if (lowerChar in LETTER_MAPPINGS) {
      characters.push({
        char: rawChar.toUpperCase(),
        dots: LETTER_MAPPINGS[lowerChar],
        description: `Letter ${rawChar.toUpperCase()}`
      });
      continue;
    }

    // 4. Punctuation
    if (rawChar in PUNCTUATION_MAPPINGS) {
      characters.push({
        char: rawChar,
        dots: PUNCTUATION_MAPPINGS[rawChar],
        description: `Punctuation '${rawChar}'`
      });
      continue;
    }

    // 5. Unknown character fallback
    unknownChars.push(rawChar);
    characters.push({
      char: rawChar,
      dots: [],
      description: `Unsupported character '${rawChar}'`
    });
  }

  return {
    characters,
    originalText: text,
    unknownChars
  };
}
