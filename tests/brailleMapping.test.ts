import { describe, it, expect } from 'vitest';
import { LETTER_MAPPINGS, REVERSE_MAPPING, normalizePatternKey } from '../src/data/brailleMapping';

describe('Braille Grade 1 Standard Mappings', () => {
  it('correctly maps initial letters a through j to 6-dot patterns', () => {
    expect(LETTER_MAPPINGS['a']).toEqual([1]);
    expect(LETTER_MAPPINGS['b']).toEqual([1, 2]);
    expect(LETTER_MAPPINGS['c']).toEqual([1, 4]);
    expect(LETTER_MAPPINGS['d']).toEqual([1, 4, 5]);
    expect(LETTER_MAPPINGS['e']).toEqual([1, 5]);
    expect(LETTER_MAPPINGS['f']).toEqual([1, 2, 4]);
    expect(LETTER_MAPPINGS['g']).toEqual([1, 2, 4, 5]);
    expect(LETTER_MAPPINGS['h']).toEqual([1, 2, 5]);
    expect(LETTER_MAPPINGS['i']).toEqual([2, 4]);
    expect(LETTER_MAPPINGS['j']).toEqual([2, 4, 5]);
  });

  it('correctly maps reverse dot patterns to uppercase letters', () => {
    expect(REVERSE_MAPPING[normalizePatternKey([1])]).toBe('A');
    expect(REVERSE_MAPPING[normalizePatternKey([1, 2])]).toBe('B');
    expect(REVERSE_MAPPING[normalizePatternKey([1, 4])]).toBe('C');
    expect(REVERSE_MAPPING[normalizePatternKey([1, 4, 5])]).toBe('D');
    expect(REVERSE_MAPPING[normalizePatternKey([1, 2, 5])]).toBe('H');
  });

  it('normalizes dot pattern keys regardless of order', () => {
    expect(normalizePatternKey([2, 1])).toBe('1,2');
    expect(normalizePatternKey([5, 4, 1])).toBe('1,4,5');
    expect(normalizePatternKey([1, 2, 1])).toBe('1,2'); // duplicates stripped
  });
});
