import { DotNumber, BraillePattern } from '../types/braille';

/**
 * Standard English Braille Grade 1 Mappings
 * 6-dot layout:
 *   1   4
 *   2   5
 *   3   6
 */

// Core letter mapping (lowercase)
export const LETTER_MAPPINGS: Record<string, DotNumber[]> = {
  a: [1],
  b: [1, 2],
  c: [1, 4],
  d: [1, 4, 5],
  e: [1, 5],
  f: [1, 2, 4],
  g: [1, 2, 4, 5],
  h: [1, 2, 5],
  i: [2, 4],
  j: [2, 4, 5],
  k: [1, 3],
  l: [1, 2, 3],
  m: [1, 3, 4],
  n: [1, 3, 4, 5],
  o: [1, 3, 5],
  p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5],
  r: [1, 2, 3, 5],
  s: [2, 3, 4],
  t: [2, 3, 4, 5],
  u: [1, 3, 6],
  v: [1, 2, 3, 6],
  w: [2, 4, 5, 6],
  x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6]
};

// Number indicator: dots 3, 4, 5, 6
export const NUMBER_INDICATOR_PATTERN: DotNumber[] = [3, 4, 5, 6];

// Number mappings (after number indicator)
export const NUMBER_MAPPINGS: Record<string, DotNumber[]> = {
  '1': [1],
  '2': [1, 2],
  '3': [1, 4],
  '4': [1, 4, 5],
  '5': [1, 5],
  '6': [1, 2, 4],
  '7': [1, 2, 4, 5],
  '8': [1, 2, 5],
  '9': [2, 4],
  '0': [2, 4, 5]
};

// Punctuation and Space mappings
export const PUNCTUATION_MAPPINGS: Record<string, DotNumber[]> = {
  ' ': [],
  ',': [2],
  ';': [2, 3],
  ':': [2, 5],
  '.': [2, 5, 6],
  '?': [2, 3, 6],
  '!': [2, 3, 5],
  "'": [3],
  '-': [3, 6],
  '/': [3, 4],
  '(': [2, 3, 5, 6],
  ')': [2, 3, 5, 6],
  '"': [2, 3, 6]
};

/**
 * Helper to normalize dot patterns to canonical string key (e.g. [2, 1] -> "1,2")
 */
export function normalizePatternKey(dots: DotNumber[]): string {
  if (!dots || dots.length === 0) return '';
  return Array.from(new Set(dots))
    .sort((a, b) => a - b)
    .join(',');
}

/**
 * Reverse Mapping Table: Pattern Key -> Character (Uppercase)
 */
export const REVERSE_MAPPING: Record<string, string> = (() => {
  const table: Record<string, string> = {};

  // Letters (uppercase A-Z)
  for (const [char, dots] of Object.entries(LETTER_MAPPINGS)) {
    const key = normalizePatternKey(dots);
    table[key] = char.toUpperCase();
  }

  // Punctuation
  for (const [char, dots] of Object.entries(PUNCTUATION_MAPPINGS)) {
    const key = normalizePatternKey(dots);
    if (char === ' ') {
      table[''] = '[SPACE]';
    } else {
      table[key] = char;
    }
  }

  // Number Indicator
  table[normalizePatternKey(NUMBER_INDICATOR_PATTERN)] = '#';

  return table;
})();

/**
 * Reverse Number Lookup (used when in Number Mode)
 */
export const REVERSE_NUMBER_MAPPING: Record<string, string> = (() => {
  const table: Record<string, string> = {};
  for (const [num, dots] of Object.entries(NUMBER_MAPPINGS)) {
    const key = normalizePatternKey(dots);
    table[key] = num;
  }
  return table;
})();
