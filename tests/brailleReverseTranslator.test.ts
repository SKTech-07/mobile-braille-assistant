import { describe, it, expect } from 'vitest';
import { translateBrailleToCharacter } from '../src/services/brailleReverseTranslator';

describe('Braille to Text Reverse Translator', () => {
  it('translates dot selection 1,2 to B', () => {
    const res = translateBrailleToCharacter([1, 2]);
    expect(res.isValid).toBe(true);
    expect(res.char).toBe('B');
  });

  it('translates dot selection 1,4 to C', () => {
    const res = translateBrailleToCharacter([1, 4]);
    expect(res.isValid).toBe(true);
    expect(res.char).toBe('C');
  });

  it('translates dot selection 1,2,5 to H', () => {
    const res = translateBrailleToCharacter([1, 2, 5]);
    expect(res.isValid).toBe(true);
    expect(res.char).toBe('H');
  });

  it('handles empty dot selection as space', () => {
    const res = translateBrailleToCharacter([]);
    expect(res.isValid).toBe(true);
    expect(res.char).toBe(' ');
  });

  it('returns invalid status and error message for unsupported dot patterns', () => {
    // [3, 4, 5] is not a valid standard Grade 1 letter mapping in reverse table
    const res = translateBrailleToCharacter([3, 4, 5]);
    expect(res.isValid).toBe(false);
    expect(res.char).toBeNull();
    expect(res.errorReason).toBe('Unsupported Braille pattern');
  });
});
