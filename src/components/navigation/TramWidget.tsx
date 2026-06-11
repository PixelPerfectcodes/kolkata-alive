"use client";

import { useState, useEffect, useRef } from "react";
import { Train, Volume2, VolumeX, Eye, HelpCircle, X, Sparkles, Navigation } from "lucide-react";

export function TramWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sepiaMode, setSepiaMode] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toggle CSS filter sepia mode on root body
  const toggleSepia = () => {
    setSepiaMode(!sepiaMode);
    if (!sepiaMode) {
      document.documentElement.style.filter = "sepia(0.35) contrast(0.95) brightness(1.02)";
    } else {
      document.documentElement.style.filter = "none";
    }
  };

  const toggleAmbient = () => {
    setAmbientAudio(!ambientAudio);
    if (audioRef.current) {
      if (!ambientAudio) {
        audioRef.current.play().catch(() => {
          // Fallback if browser blocks autoplay
          console.log("Audio play blocked by browser.");
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  useEffect(() => {
    // Inject nice sitar ambient loop
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"); // safe public mp3
    audio.loop = true;
    audio.volume = 0.15;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Control Box */}
      {isOpen && (
        <div className="victorian-frame bg-cream p-5 rounded-lg shadow-2xl mb-4 w-72 animate-fade-in text-charcoal border border-gold select-none">
          <div className="flex items-center justify-between border-b border-gold/20 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Train className="w-5 h-5 text-green" />
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider">Esplanade Control Tower</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:text-red transition-colors text-charcoal/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-charcoal/70 leading-relaxed mb-4">
            Toggle heritage lens systems and audio immersion tools.
          </p>

          <div className="space-y-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleAmbient}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                ambientAudio
                  ? "bg-green text-cream border-green"
                  : "bg-gold/10 hover:bg-gold/20 border-gold/30 text-charcoal"
              }`}
            >
              <span className="flex items-center gap-2">
                {ambientAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Sitar Adda Ambience
              </span>
              <span className="text-[10px] font-mono">{ambientAudio ? "ON" : "OFF"}</span>
            </button>

            {/* Sepia Mode Toggle */}
            <button
              onClick={toggleSepia}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                sepiaMode
                  ? "bg-red text-cream border-red"
                  : "bg-gold/10 hover:bg-gold/20 border-gold/30 text-charcoal"
              }`}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Sepia Nostalgia Lens
              </span>
              <span className="text-[10px] font-mono">{sepiaMode ? "ON" : "OFF"}</span>
            </button>

            {/* Travel card snippet */}
            <div className="p-3 bg-charcoal text-cream rounded-md border border-gold/30 text-[10px] font-mono flex items-center justify-between mt-4">
              <span className="flex items-center gap-1.5 text-gold">
                <Sparkles className="w-3.5 h-3.5" />
                TRAMWAY NO. 36
              </span>
              <span>20 PAISA</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating circular Tram button with pulsing ring */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green hover:bg-red text-cream rounded-full border-2 border-gold flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group relative"
        aria-label="Tram settings"
      >
        <div className="absolute inset-0 rounded-full border-2 border-gold opacity-30 group-hover:animate-ping pointer-events-none" />
        <Train className="w-6 h-6 transition-transform group-hover:rotate-12" />
        
        {/* Visual indicator when active */}
        {(ambientAudio || sepiaMode) && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red rounded-full border-2 border-cream flex items-center justify-center text-[9px] font-bold text-cream">
            !
          </span>
        )}
      </button>
    </div>
  );
}
