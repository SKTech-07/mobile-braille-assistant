import { describe, it, expect } from 'vitest';
import { translateTextToBraille } from '../src/services/brailleTranslator';

describe('Text to Braille Translator', () => {
  it('correctly converts "bc" to b [1,2] and c [1,4]', () => {
    const res = translateTextToBraille('bc');
    expect(res.characters.length).toBe(2);
    expect(res.characters[0].char).toBe('B');
    expect(res.characters[0].dots).toEqual([1, 2]);
    expect(res.characters[1].char).toBe('C');
    expect(res.characters[1].dots).toEqual([1, 4]);
  });

  it('correctly converts "hello"', () => {
    const res = translateTextToBraille('hello');
    expect(res.characters.length).toBe(5);
    expect(res.characters[0]).toEqual({ char: 'H', dots: [1, 2, 5], description: 'Letter H' });
    expect(res.characters[1]).toEqual({ char: 'E', dots: [1, 5], description: 'Letter E' });
    expect(res.characters[2]).toEqual({ char: 'L', dots: [1, 2, 3], description: 'Letter L' });
    expect(res.characters[3]).toEqual({ char: 'L', dots: [1, 2, 3], description: 'Letter L' });
    expect(res.characters[4]).toEqual({ char: 'O', dots: [1, 3, 5], description: 'Letter O' });
  });

  it('handles spaces correctly', () => {
    const res = translateTextToBraille('b c');
    expect(res.characters.length).toBe(3);
    expect(res.characters[1].char).toBe(' ');
    expect(res.characters[1].dots).toEqual([]);
  });

  it('handles numbers with number indicator [3,4,5,6]', () => {
    const res = translateTextToBraille('12');
    expect(res.characters.length).toBe(3);
    expect(res.characters[0].isNumberIndicator).toBe(true);
    expect(res.characters[0].dots).toEqual([3, 4, 5, 6]);
    expect(res.characters[1].char).toBe('1');
    expect(res.characters[1].dots).toEqual([1]);
    expect(res.characters[2].char).toBe('2');
    expect(res.characters[2].dots).toEqual([1, 2]);
  });

  it('handles empty input', () => {
    const res = translateTextToBraille('');
    expect(res.characters).toEqual([]);
  });

  it('handles long text correctly without error', () => {
    const longText = 'the quick brown fox jumps over the lazy dog 12345';
    const res = translateTextToBraille(longText);
    expect(res.characters.length).toBeGreaterThan(40);
  });
});
