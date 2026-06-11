"use client";

import { useEffect, useRef } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  isSpeaking: boolean;
  currentTime: number;
  duration: number;
  visualizerData: number[];
  onPlayPause: () => void;
  onStop: () => void;
  title?: string;
  subtitle?: string;
}

export function AudioPlayer({
  isPlaying,
  isSpeaking,
  currentTime,
  duration,
  visualizerData,
  onPlayPause,
  onStop,
  title = "Audio Narrative",
  subtitle = "Vintage Broadcast System",
}: AudioPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render the canvas-based audio wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = (width / 32) - 2;

      // Draw subtle vintage background gridlines
      ctx.strokeStyle = "rgba(197, 155, 39, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 10; i < height; i += 12) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw custom orange/gold neon audio bars
      for (let i = 0; i < 32; i++) {
        const val = visualizerData[i] || 2;
        // Map height to fit the canvas beautifully
        const barHeight = isPlaying ? (val / 100) * height * 0.75 + 4 : 4;
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        // Vintage gold/orange gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, "#B93C2A"); // Faded postbox red
        gradient.addColorStop(0.5, "#C59B27"); // Heritage Gold
        gradient.addColorStop(1, "#1B4332"); // Tram Green

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [visualizerData, isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="victorian-frame p-6 bg-cream shadow-xl rounded-lg max-w-md w-full mx-auto relative overflow-hidden flex flex-col gap-4">
      {/* Vacuum-tube Radio background glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold/15 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Broadcasting Header */}
      <div className="flex items-center justify-between border-b border-gold/20 pb-3">
        <div className="flex flex-col">
          <span className="font-serif text-sm uppercase tracking-widest text-gold font-bold">
            {subtitle}
          </span>
          <h4 className="font-serif text-lg font-bold text-charcoal truncate max-w-[240px]">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-1 bg-charcoal text-cream px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider animate-pulse">
          <Volume2 className="w-3.5 h-3.5" />
          {isPlaying ? "ON AIR" : "STBY"}
        </div>
      </div>

      {/* Visualizer Oscilloscope screen */}
      <div className="h-20 bg-charcoal/95 border-2 border-gold/45 rounded-lg flex items-center justify-center p-2 shadow-inner relative">
        <canvas ref={canvasRef} width={380} height={70} className="w-full h-full block" />
        <div className="absolute top-1 left-2 font-mono text-[8px] text-gold/60 uppercase">
          Signal Waveform Matrix
        </div>
        <div className="absolute bottom-1 right-2 font-mono text-[9px] text-red/80 font-bold uppercase tracking-widest animate-pulse">
          {isPlaying ? "Modulating..." : "Idle"}
        </div>
      </div>

      {/* Control Dials */}
      <div className="flex items-center justify-between mt-2 gap-4">
        {/* Timestamps */}
        <div className="font-mono text-xs text-charcoal/70 bg-gold/10 px-2 py-1 rounded border border-gold/15">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className="w-12 h-12 flex items-center justify-center bg-red hover:bg-red/90 text-cream rounded-full transition-all duration-300 transform active:scale-95 shadow-md border-2 border-gold/30"
            title={isPlaying ? "Pause Broadcast" : "Play Broadcast"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-cream" /> : <Play className="w-5 h-5 fill-cream ml-0.5" />}
          </button>
          <button
            onClick={onStop}
            disabled={!isSpeaking}
            className="w-10 h-10 flex items-center justify-center bg-charcoal hover:bg-charcoal/90 text-cream rounded-full transition-all duration-300 transform active:scale-95 shadow-md border-2 border-gold/30 disabled:opacity-40 disabled:pointer-events-none"
            title="Stop Broadcast"
          >
            <Square className="w-4 h-4 fill-cream" />
          </button>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="w-full bg-gold/20 h-1.5 rounded-full overflow-hidden relative">
        <div
          className="bg-green h-full rounded-full transition-all duration-100"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>
    </div>
  );
}
