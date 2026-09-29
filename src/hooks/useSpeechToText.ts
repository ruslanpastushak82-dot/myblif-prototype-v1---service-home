import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionResultLike = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

// The Web Speech API has no official TS lib. Chrome/Edge expose it as
// webkitSpeechRecognition; Firefox and some Safari builds don't implement it
// at all, so every caller must check `isSupported` and degrade gracefully
// (disabled mic button) instead of throwing.
const getSpeechRecognitionCtor = ():
  | (new () => SpeechRecognitionLike)
  | null => {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (
    (w.SpeechRecognition as new () => SpeechRecognitionLike | undefined) ??
    (w.webkitSpeechRecognition as new () => SpeechRecognitionLike | undefined) ??
    null
  );
};

/**
 * Minimal voice-to-text helper shared by Quick Request's Request Details
 * dictation and the MYBLIF Chat message input. Calling `start()` triggers
 * the browser's own microphone permission prompt (nothing Claude can
 * pre-approve); on success the recognized transcript is passed to
 * `onResult`, which callers append to whatever text field they're driving.
 */
export const useSpeechToText = (onResult: (transcript: string) => void) => {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => getSpeechRecognitionCtor() !== null);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }, [onResult]);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return { isSupported, isListening, start, stop };
};
