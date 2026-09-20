export type DotNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type BraillePattern = DotNumber[];

export interface BrailleCharacter {
  char: string;
  dots: BraillePattern;
  isNumberIndicator?: boolean;
  isNumber?: boolean;
  description?: string;
}

export interface HapticConfig {
  shortVibe: number;       // duration of short vibration for dots 1, 2, 3 (ms)
  longVibe: number;        // duration of long vibration for dots 4, 5, 6 (ms)
  intraDotPause: number;   // pause between multiple vibrations within the same dot count (ms)
  dotPause: number;        // pause between different dot numbers in a character (ms)
  charPause: number;       // pause between characters during sequence playback (ms)
}

export type PlaybackState = 'idle' | 'playing' | 'paused';

export type AppMode = 'textToBraille' | 'brailleToText';

export interface TranslationResult {
  characters: BrailleCharacter[];
  originalText: string;
  unknownChars: string[];
}

export interface ReverseTranslationResult {
  char: string | null;
  isValid: boolean;
  errorReason?: string;
}
