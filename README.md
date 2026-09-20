# ⠃ Mobile Bidirectional Braille Assistant

A software-only, standalone mobile accessibility system that provides bidirectional communication between standard English text and 6-dot Braille patterns.

No external hardware (ESP32, Arduino, Bluetooth, physical Braille display) required — runs 100% in mobile software using the phone's touchscreen, display, built-in vibration actuator, and Web Speech API.

---

## 🌟 Key Features

### Mode 1: Text → Braille
* **Text Input**: Convert text strings (e.g. `"bc"`, `"hello"`, numbers, punctuation) into standard Grade 1 English 6-dot Braille.
* **Visual Cell Display**: High-contrast interactive 6-dot Braille cell showing active dots (`1` to `6`).
* **Temporal Haptic Feedback**: Encodes 6-dot patterns using the single phone vibration motor:
  * **Dots 1–3**: 1, 2, or 3 short vibrations.
  * **Dots 4–6**: 1, 2, or 3 long vibrations.
  * **Multi-dot characters** (e.g. `B = 1,2`, `C = 1,4`) played sequentially with configurable pauses.
* **Playback Engine**: Play, Pause, Stop, Replay, Prev/Next character stepping, adjustable speed ($0.5\times$ to $1.5\times$), character progress tracking (`Character X / N`).

### Mode 2: Interactive Braille → Text → Speech
* **Touch 6-Dot Cell**: Tappable 6-dot cell layout with large touch targets ($\ge 56\text{px}$) optimized for mobile touchscreens.
* **Multi-Dot Selection**: Tap multiple dots before pressing `[✓ Add Character]`.
* **Reverse Lookup**: Converts dot patterns (`[1,2]` $\rightarrow$ `B`, `[1,4]` $\rightarrow$ `C`, `[1,2,5]` $\rightarrow$ `H`) into text buffer.
* **Invalid Pattern Safety**: Displays `"Unsupported Braille pattern"` for unknown dot combinations without producing random characters.
* **Text Output Buffer**: Full text editing controls (`Add Character`, `Space`, `Backspace`, `Clear Cell`, `Reset`).
* **Text-to-Speech**: Integrated `[🔊 Speak]` button using Web Speech API with graceful unsupported browser fallback notifications.

---

## 🏗️ Architecture & Stack

```text
mobile-braille-assistant/
├── public/                     # PWA Web Manifest & Service Worker
├── src/
│   ├── types/braille.ts        # Core TypeScript interfaces
│   ├── data/brailleMapping.ts  # Grade 1 English Braille forward & reverse mapping tables
│   ├── services/
│   │   ├── brailleTranslator.ts       # Text -> BrailleCharacter[]
│   │   ├── brailleReverseTranslator.ts# Dot Pattern -> Character & error checking
│   │   ├── hapticEncoder.ts           # Temporal haptic pattern generator & vibration controller
│   │   └── speechService.ts           # Web Speech API wrapper with fallback detection
│   ├── components/
│   │   ├── BrailleCell.tsx            # Reusable 6-dot cell component
│   │   ├── TextToBraille.tsx          # Mode 1 visual & haptic playback view
│   │   ├── BrailleToText.tsx          # Mode 2 touch dot builder & text buffer view
│   │   ├── HapticControls.tsx         # Configurable haptic timing panel
│   │   └── SpeechControls.tsx         # Text-to-speech component
│   ├── pages/BrailleAssistant.tsx     # Main layout & mode tab switcher
│   ├── styles/                        # Accessible CSS design system & touch button styles
│   ├── App.tsx
│   └── main.tsx
└── tests/                      # Automated Vitest suite
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd mobile-braille-assistant
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in a desktop or mobile browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production & PWA
```bash
npm run build
```

---

## 📳 Temporal Haptic Encoding Reference

Standard 6-dot layout:
```text
1   4
2   5
3   6
```

| Dot | Haptic Signal | Default Duration |
|:---:|:---|:---|
| **Dot 1** | 1 Short pulse | 70 ms |
| **Dot 2** | 2 Short pulses | 70 ms vibration, 70 ms pause, 70 ms vibration |
| **Dot 3** | 3 Short pulses | 3 short pulses |
| **Dot 4** | 1 Long pulse | 220 ms |
| **Dot 5** | 2 Long pulses | 220 ms vibration, 70 ms pause, 220 ms vibration |
| **Dot 6** | 3 Long pulses | 3 long pulses |

**Example Character Encodings**:
* `B` (dots 1, 2): 1 short pulse $\rightarrow$ 250ms pause $\rightarrow$ 2 short pulses
* `C` (dots 1, 4): 1 short pulse $\rightarrow$ 250ms pause $\rightarrow$ 1 long pulse

---

## 📱 Mobile & PWA Compatibility

* Supports Android Chrome, Mobile Safari, Edge, Firefox Mobile, and PWA standalone installation.
* If `navigator.vibrate` is unavailable on a desktop browser or iOS Safari, the app displays a non-blocking notification while continuing visual Braille rendering.
* If `window.speechSynthesis` is unavailable, speech controls show a helpful status message without crashing.
