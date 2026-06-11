"use client";

import { useState, useEffect, useRef } from "react";

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>([]);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const visualizerInterval = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      audioRef.current = new Audio();
    }
    return () => {
      stop();
    };
  }, []);

  // Simulate audio frequency spectrum data for the canvas visualizer
  const startVisualizer = () => {
    if (visualizerInterval.current) clearInterval(visualizerInterval.current);
    visualizerInterval.current = setInterval(() => {
      const frequencies = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 80) + 10
      );
      setVisualizerData(frequencies);
    }, 100);
  };

  const stopVisualizer = () => {
    if (visualizerInterval.current) {
      clearInterval(visualizerInterval.current);
      visualizerInterval.current = null;
    }
    setVisualizerData(Array(32).fill(1));
  };

  const speak = async (text: string, language: "en" | "bn" = "en") => {
    stop();
    setIsPlaying(true);
    setIsSpeaking(true);
    startVisualizer();

    try {
      // Try hitting ElevenLabs proxy route
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceId: language === "bn" ? "21m00Tcm4TlvDq8ikWAM" : "pNInz6obpgqjMhk4s55t",
        }),
      });

      const data = await response.clone().json().catch(() => null);

      if (data && data.useWebSpeechFallback) {
        // Fall back to Web Speech API
        triggerWebSpeech(text, language);
      } else {
        // Play ElevenLabs audio buffer stream
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
          audioRef.current.onended = () => {
            stop();
          };
          audioRef.current.ontimeupdate = () => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
              setDuration(audioRef.current.duration || 0);
            }
          };
        }
      }
    } catch (error) {
      console.warn("ElevenLabs stream failed, falling back to WebSpeech.", error);
      triggerWebSpeech(text, language);
    }
  };

  const triggerWebSpeech = (text: string, language: "en" | "bn") => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    // Clean text from complex markers
    const cleanText = text.replace(/[*#]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Pick a local language voice if possible
    utterance.lang = language === "bn" ? "bn-IN" : "en-IN";

    // Approximate duration based on word count
    const words = cleanText.split(" ").length;
    const approxDuration = (words / 140) * 60; // 140 WPM
    setDuration(approxDuration);

    let progressInterval: any;
    utterance.onstart = () => {
      let elapsed = 0;
      progressInterval = setInterval(() => {
        elapsed += 0.1;
        setCurrentTime(Math.min(elapsed, approxDuration));
      }, 100);
    };

    utterance.onend = () => {
      clearInterval(progressInterval);
      stop();
    };

    utterance.onerror = () => {
      clearInterval(progressInterval);
      stop();
    };

    synthRef.current.speak(utterance);
  };

  const pause = () => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopVisualizer();
    } else if (synthRef.current) {
      synthRef.current.pause();
      setIsPlaying(false);
      stopVisualizer();
    }
  };

  const resume = () => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play();
      setIsPlaying(true);
      startVisualizer();
    } else if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
      setIsPlaying(true);
      startVisualizer();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsSpeaking(false);
    setCurrentTime(0);
    stopVisualizer();
  };

  return {
    isPlaying,
    isSpeaking,
    currentTime,
    duration,
    visualizerData,
    speak,
    pause,
    resume,
    stop,
  };
}
