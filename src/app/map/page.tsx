"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { TramWidget } from "@/components/navigation/TramWidget";
import { mockLocations, mockTrails, Location, Trail } from "@/lib/mockData";
import { useSpeech } from "@/hooks/useSpeech";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { Compass, MapPin, Volume2, BookOpen, Navigation, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export default function SmartMap() {
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(mockTrails[0]);
  const [selectedSpot, setSelectedSpot] = useState<Location | null>(mockLocations[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const speech = useSpeech();

  const handlePlayVoice = (spot: Location) => {
    if (speech.isPlaying) {
      speech.stop();
      setIsPlayingAudio(false);
    } else {
      speech.speak(spot.storyEn, "en");
      setIsPlayingAudio(true);
    }
  };

  const handleTrailSelect = (trail: Trail) => {
    setSelectedTrail(trail);
    // Automatically select the first spot of the trail
    const firstSpotId = trail.locations[0];
    const spot = mockLocations.find((l) => l.id === firstSpotId);
    if (spot) {
      setSelectedSpot(spot);
    }
  };

  return (
    <>
      <Header />

      <main className="relative h-[85vh] bg-charcoal text-cream flex flex-col lg:flex-row overflow-hidden select-none border-b-8 border-gold">
        
        {/* Left Side Panel: Interactive Trail Selection & Drawer details */}
        <div className="w-full lg:w-[420px] bg-charcoal border-r border-gold/20 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl relative">
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <div className="flex flex-col">
                <span className="font-serif text-[10px] uppercase tracking-widest text-gold font-bold">Smart Cartography Node</span>
                <h2 className="font-serif text-xl font-extrabold tracking-tight">Geo-Preservation Trails</h2>
              </div>
              <Link href="/explorer" className="p-2 hover:bg-cream/15 text-gold rounded-full border border-gold/15" title="Exit to list">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Trail selector rows */}
            <div className="space-y-2.5">
              <label className="block text-[10px] font-mono uppercase text-gold">Choose Preservation Walk</label>
              {mockTrails.map((trail) => {
                const isSelected = selectedTrail?.id === trail.id;
                return (
                  <button
                    key={trail.id}
                    onClick={() => handleTrailSelect(trail)}
                    className={`w-full text-left p-3.5 rounded border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-gold text-charcoal border-gold font-bold shadow-lg"
                        : "bg-cream/5 hover:bg-cream/10 border-cream/10 text-cream"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs uppercase font-extrabold tracking-wider">{trail.name}</span>
                      <span className={`text-[9px] font-serif ${isSelected ? "text-charcoal/70" : "text-gold"}`}>
                        {trail.bengaliName}
                      </span>
                    </div>
                    <Sparkles className={`w-4 h-4 ${isSelected ? "text-red" : "text-gold/60"}`} />
                  </button>
                );
              })}
            </div>

            {/* Active Landmark panel summary details */}
            {selectedSpot && (
              <div className="victorian-frame p-5 bg-cream text-charcoal rounded-lg border border-gold/30 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-gold/20 pb-2">
                  <span className="bg-red text-cream text-[8px] font-mono uppercase px-2 py-0.5 rounded shadow">
                    {selectedSpot.category}
                  </span>
                  <span className="text-[8px] font-mono text-charcoal/60 uppercase">Trail Stop</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-black text-charcoal leading-tight">
                    {selectedSpot.name}
                  </h3>
                  <p className="font-serif text-[10px] text-gold font-bold uppercase tracking-widest mt-[-2px]">
                    {selectedSpot.bengaliName}
                  </p>
                </div>

                <p className="text-xs text-charcoal/80 leading-relaxed line-clamp-3 italic">
                  "{selectedSpot.shortDescription}"
                </p>

                <div className="flex gap-2 border-t border-gold/20 pt-4">
                  <button
                    onClick={() => handlePlayVoice(selectedSpot)}
                    className="flex-1 flex items-center justify-center gap-1 bg-charcoal hover:bg-red text-cream text-xs uppercase font-bold tracking-wider py-2.5 rounded border border-gold/20 transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speech.isPlaying ? "Stop" : "Listen"}</span>
                  </button>
                  <Link
                    href={`/location/${selectedSpot.id}`}
                    className="flex-1 flex items-center justify-center gap-1 bg-gold/20 hover:bg-gold/30 text-charcoal text-xs uppercase font-bold tracking-wider py-2.5 rounded transition-all text-center"
                  >
                    <span>Immerse</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Audio Visualizer anchor at bottom of sidepanel */}
          {selectedSpot && speech.isSpeaking && (
            <div className="p-4 border-t border-gold/20 bg-charcoal">
              <AudioPlayer
                isPlaying={speech.isPlaying}
                isSpeaking={speech.isSpeaking}
                currentTime={speech.currentTime}
                duration={speech.duration}
                visualizerData={speech.visualizerData}
                onPlayPause={() => {
                  if (speech.isPlaying) speech.pause();
                  else speech.resume();
                }}
                onStop={() => {
                  speech.stop();
                  setIsPlayingAudio(false);
                }}
                title={selectedSpot.name}
                subtitle={`${selectedSpot.category.toUpperCase()} AUDIO`}
              />
            </div>
          )}
        </div>

        {/* Right Side Panel: Cinematic Map simulator */}
        <div className="flex-1 relative h-full w-full bg-charcoal/95 overflow-hidden">
          {/* Grid coordinates indicator grid overlays */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat bg-[size:40px_40px] bg-center bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Crect width=%2240%22 height=%2240%22 fill=%22none%22 stroke=%22%23FAF7F2%22 stroke-width=%221%22/%3E%3C/svg%3E')]" />

          {/* Compass rose decoration */}
          <div className="absolute top-6 right-6 opacity-30 pointer-events-none select-none">
            <Compass className="w-24 h-24 text-gold animate-spin-slow" />
          </div>

          {/* Interactive Simulated Sepia Map Layout */}
          <div className="w-full h-full flex items-center justify-center relative p-8">
            <div className="victorian-frame w-full max-w-4xl aspect-[16/10] bg-cream text-charcoal rounded-lg shadow-2xl relative overflow-hidden flex flex-col justify-between border-4 border-gold">
              
              {/* Paper overlay inside simulator */}
              <div className="absolute inset-0 bg-cover bg-center opacity-[0.25] filter sepia mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1200')" }} />

              {/* Map grid content */}
              <div className="relative flex-1 w-full h-full p-4 flex flex-col justify-between">
                
                {/* Header label */}
                <div className="flex items-center justify-between border-b border-gold/30 pb-2">
                  <span className="font-serif text-[10px] text-red font-bold uppercase tracking-widest">CALCUTTA PROVINCIAL ROADMAP</span>
                  <span className="font-mono text-[9px] text-charcoal/50">GRID MATRIX v1.2</span>
                </div>

                {/* Simulated Pins scattered around the page coordinate spaces */}
                <div className="absolute inset-0 z-10">
                  {mockLocations.map((spot) => {
                    const isSelected = selectedSpot?.id === spot.id;
                    const isTrailStop = selectedTrail?.locations.includes(spot.id);

                    // Position pins dynamically in the aspect bounds to look like a map
                    let xPercent = "50%";
                    let yPercent = "50%";

                    if (spot.id === "college-street") { xPercent = "62%"; yPercent = "45%"; }
                    if (spot.id === "victoria-memorial") { xPercent = "35%"; yPercent = "70%"; }
                    if (spot.id === "kumartuli") { xPercent = "68%"; yPercent = "25%"; }
                    if (spot.id === "flurys-park-street") { xPercent = "40%"; yPercent = "62%"; }
                    if (spot.id === "howrah-bridge") { xPercent = "30%"; yPercent = "35%"; }

                    return (
                      <button
                        key={spot.id}
                        onClick={() => setSelectedSpot(spot)}
                        style={{ left: xPercent, top: yPercent }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group z-10"
                      >
                        {/* Map Marker Pin */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 transform active:scale-95 ${
                            isSelected
                              ? "bg-red border-gold scale-125"
                              : isTrailStop
                              ? "bg-green border-gold scale-110"
                              : "bg-charcoal/80 border-cream"
                          }`}
                        >
                          <MapPin className={`w-4 h-4 ${isSelected ? "text-cream fill-cream animate-bounce" : "text-cream"}`} />
                        </div>
                        {/* Pin tooltip name */}
                        <span
                          className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded shadow pointer-events-none transition-all ${
                            isSelected
                              ? "bg-gold text-charcoal font-black border border-gold"
                              : "bg-charcoal text-cream opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {spot.name.split(" (")[0]}
                        </span>
                      </button>
                    );
                  })}

                  {/* Draw simulated lines representing Trail routes */}
                  {selectedTrail && (
                    <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
                      <div className="w-[80%] h-[80%] border-4 border-dashed border-red/45 rounded-full rotate-12 flex items-center justify-center">
                        <div className="w-[70%] h-[70%] border-2 border-dashed border-green/35 rounded-full rotate-45" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer notes on simulated map */}
                <div className="flex justify-between border-t border-gold/30 pt-2 text-[9px] font-mono text-charcoal/60 mt-auto relative z-20">
                  <span className="flex items-center gap-1"><Navigation className="w-3 h-3 text-red animate-pulse" /> MAP ENGINE SIMULATION</span>
                  <span>COORDS: BENGAL BAY GRID UNIT 3A</span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </main>

      <TramWidget />
      <Footer />
    </>
  );
}
