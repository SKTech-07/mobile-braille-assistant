import { DotNumber, HapticConfig } from '../types/braille';

export const DEFAULT_HAPTIC_CONFIG: HapticConfig = {
  shortVibe: 70,        // 70ms short pulse for absent dot or non-final next character
  longVibe: 220,        // 220ms long pulse for present dot or final next character completion
  intraDotPause: 70,
  dotPause: 250,
  charPause: 700
};

/**
 * Checks if the browser/device supports Web Haptics API (navigator.vibrate)
 */
export function isVibrationSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/**
 * Triggers vibration for a single dot check in Interactive Learning Mode:
 * - If present in Braille character: ONE LONG vibration.
 * - If NOT present in Braille character: ONE SHORT vibration.
 */
export function triggerDotCheckHaptic(
  isPresent: boolean,
  config: HapticConfig = DEFAULT_HAPTIC_CONFIG
): void {
  if (!isVibrationSupported()) return;

  const duration = isPresent ? config.longVibe : config.shortVibe;
  try {
    navigator.vibrate(duration);
  } catch (err) {
    // Graceful fallback
  }
}

/**
 * Triggers vibration for Next Character button press:
 * - Next after a non-final character: ONE SHORT vibration.
 * - Next after the final character: ONE LONG vibration.
 */
export function triggerNextCharacterHaptic(
  isFinalCharacter: boolean,
  config: HapticConfig = DEFAULT_HAPTIC_CONFIG
): void {
  if (!isVibrationSupported()) return;

  const duration = isFinalCharacter ? config.longVibe : config.shortVibe;
  try {
    navigator.vibrate(duration);
  } catch (err) {
    // Graceful fallback
  }
}

/**
 * Legacy/compatibility dot pattern encoder for dots 1-6
 */
export function encodeDotToPattern(dot: DotNumber, config: HapticConfig = DEFAULT_HAPTIC_CONFIG): number[] {
  const isShort = dot >= 1 && dot <= 3;
  const vibeDuration = isShort ? config.shortVibe : config.longVibe;
  const pulseCount = dot <= 3 ? dot : dot - 3;

  const pattern: number[] = [];
  for (let i = 0; i < pulseCount; i++) {
    pattern.push(vibeDuration);
    if (i < pulseCount - 1) {
      pattern.push(config.intraDotPause);
    }
  }
  return pattern;
}

/**
 * Legacy/compatibility combined pattern encoder
 */
export function encodeCharacterToPattern(dots: DotNumber[], config: HapticConfig = DEFAULT_HAPTIC_CONFIG): number[] {
  if (!dots || dots.length === 0) return [];

  const sortedDots = Array.from(new Set(dots)).sort((a, b) => a - b);
  const combinedPattern: number[] = [];

  for (let idx = 0; idx < sortedDots.length; idx++) {
    const dot = sortedDots[idx];
    const dotPattern = encodeDotToPattern(dot, config);
    combinedPattern.push(...dotPattern);

    if (idx < sortedDots.length - 1) {
      combinedPattern.push(config.dotPause);
    }
  }

  return combinedPattern;
}

export function getPatternTotalDuration(pattern: number[]): number {
  return pattern.reduce((acc, val) => acc + val, 0);
}

export async function triggerHapticForCharacter(
  dots: DotNumber[],
  config: HapticConfig = DEFAULT_HAPTIC_CONFIG
): Promise<void> {
  if (!isVibrationSupported()) {
    const pattern = encodeCharacterToPattern(dots, config);
    const duration = getPatternTotalDuration(pattern);
    await new Promise((resolve) => setTimeout(resolve, duration));
    return;
  }

  const pattern = encodeCharacterToPattern(dots, config);
  if (pattern.length === 0) return;

  try {
    navigator.vibrate(pattern);
  } catch (err) {
    // Fallback
  }

  const duration = getPatternTotalDuration(pattern);
  await new Promise((resolve) => setTimeout(resolve, duration));
}

export function stopHaptic(): void {
  if (isVibrationSupported()) {
    try {
      navigator.vibrate(0);
    } catch (e) {
      // Ignore
    }
  }
}
