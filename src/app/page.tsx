"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { TramWidget } from "@/components/navigation/TramWidget";
import { useSpeech } from "@/hooks/useSpeech";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { mockLocations } from "@/lib/mockData";
import { Compass, Sparkles, BookOpen, Send, Mic, Play, Volume2, ArrowRight } from "lucide-react";

export default function Home() {
  const [selectedSpot, setSelectedSpot] = useState(mockLocations[0]);
  const [prompt, setPrompt] = useState("");
  const [aiStory, setAiStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStoryLanguage, setActiveStoryLanguage] = useState<"en" | "bn">("en");

  const speech = useSpeech();

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    speech.stop();
    setAiStory("");
    
    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: selectedSpot.id,
          prompt: prompt,
          language: activeStoryLanguage,
        }),
      });
      const data = await response.json();
      
      // Simulate typewriter character-by-character delay for high-end cinematic feel
      const fullText = data.story;
      let currentText = "";
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < fullText.length) {
          currentText += fullText[index];
          setAiStory(currentText);
          index++;
        } else {
          clearInterval(interval);
          setIsGenerating(false);
        }
      }, 10);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const handlePlayVoice = () => {
    const textToSpeak = aiStory || (activeStoryLanguage === "bn" ? selectedSpot.storyBn : selectedSpot.storyEn);
    speech.speak(textToSpeak, activeStoryLanguage);
  };

  return (
    <>
      <Header />

      {/* Cinematic Full-screen Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-charcoal text-cream overflow-hidden border-b-8 border-gold">
        {/* Parallax Image Background Filter */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-10000 ease-out"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        {/* Gradient dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(20,19,18,0.85)_100%)]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 space-y-8 select-none">
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-[2px] w-8 sm:w-16 bg-gold" />
            <span className="font-serif text-xs sm:text-sm uppercase tracking-widest text-gold font-bold">
              Living Preservation Hub
            </span>
            <span className="h-[2px] w-8 sm:w-16 bg-gold" />
          </div>

          <h1 className="font-serif text-4xl sm:text-7xl font-extrabold tracking-tight leading-none text-cream">
            Experience Kolkata <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-red to-gold font-light italic">
              Beyond Maps
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-cream/80 max-w-2xl mx-auto font-light leading-relaxed">
            Walk the vintage tracks, listen to long-forgotten oral histories, explore literature, and capture local memories in a living digital preserve.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/explorer"
              className="px-8 py-3.5 bg-red hover:bg-red/90 text-cream rounded-full border border-gold/40 text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-red/20 transform hover:-translate-y-0.5"
            >
              Explore Heritage
            </Link>
            <Link
              href="/map"
              className="px-8 py-3.5 bg-cream/10 hover:bg-cream/20 text-cream rounded-full border border-cream/30 text-sm font-semibold tracking-wider uppercase backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Start Journey
            </Link>
          </div>
        </div>

        {/* Vintage Postcard Stamp decoration */}
        <div className="absolute bottom-6 left-6 hidden lg:block opacity-75 animate-float">
          <div className="vintage-stamp victorian-frame w-40 p-3 text-center text-charcoal border-2">
            <div className="font-serif text-[10px] font-bold tracking-widest uppercase">Calcutta G.P.O</div>
            <div className="text-[14px] font-serif text-red font-extrabold py-1">20 PAISA</div>
            <div className="text-[8px] font-mono border-t border-gold/40 pt-1 uppercase">Heritage Dept</div>
          </div>
        </div>
      </section>

      {/* Featured Heritage Locations Parallax grid */}
      <section className="py-24 bg-cream max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="font-serif text-xs uppercase tracking-widest text-red font-bold">
            Curated Archival Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-black text-charcoal tracking-tight leading-none">
            Featured Heritage Spots
          </h2>
          <p className="text-sm sm:text-base text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
            Each landmark is a universe of historical anecdotes, literature references, and living Bengali memories.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockLocations.slice(0, 3).map((spot) => (
            <Link
              key={spot.id}
              href={`/location/${spot.id}`}
              className="victorian-frame bg-cream p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Image Container with golden tint hover */}
                <div className="relative h-56 rounded-md overflow-hidden border border-gold/20">
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-3 left-3 bg-red text-cream text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md">
                    {spot.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-xl font-extrabold text-charcoal group-hover:text-red transition-colors">
                      {spot.name}
                    </h3>
                  </div>
                  <p className="font-serif text-xs text-gold font-semibold uppercase tracking-widest">
                    {spot.bengaliName}
                  </p>
                  <p className="text-xs text-charcoal/70 leading-relaxed line-clamp-3">
                    {spot.shortDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-red uppercase tracking-wider mt-4 group-hover:gap-2 transition-all">
                <span>Immerse Inside</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive AI Storyteller Sandbox (Core preserved feature) */}
      <section className="py-24 bg-charcoal text-cream border-t-8 border-b-8 border-gold relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left panel: Control Board */}
          <div className="space-y-6">
            <span className="font-serif text-xs uppercase tracking-widest text-gold font-bold">
              Interactive Cognitive Engine
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-cream leading-tight">
              AI-Powered Cultural <br />
              <span className="text-gold italic font-light">Storytelling Sandbox</span>
            </h2>
            <p className="text-sm text-cream/70 leading-relaxed font-light">
              Select a historic landmark, type a specific thematic query (e.g., "Write about old bookstores at twilight"), and our Hugging Face RAG pipeline will compose a customized local narrative in English or Bengali.
            </p>

            {/* Selector list */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase text-gold">Select Landmark</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {mockLocations.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedSpot(spot)}
                    className={`px-3 py-2 rounded text-left text-xs uppercase font-semibold tracking-wider transition-all border ${
                      selectedSpot.id === spot.id
                        ? "bg-gold text-charcoal border-gold font-bold shadow-lg"
                        : "bg-cream/5 hover:bg-cream/10 border-cream/10 text-cream"
                    }`}
                  >
                    {spot.name.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input field */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-gold">Custom Story Focus (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. at twilight in the monsoon rain..."
                  className="px-4 py-3 bg-cream/5 border border-cream/15 rounded focus:outline-none w-full text-xs placeholder:text-cream/40"
                />
                <button
                  onClick={handleGenerateStory}
                  disabled={isGenerating}
                  className="bg-red hover:bg-red/90 text-cream px-5 rounded border border-red/35 flex items-center justify-center disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lang toggler */}
            <div className="flex gap-2 items-center">
              <span className="text-xs font-mono text-cream/70 uppercase">Narrative Dialect:</span>
              <button
                onClick={() => setActiveStoryLanguage("en")}
                className={`px-2.5 py-1 text-[10px] uppercase font-bold border rounded ${
                  activeStoryLanguage === "en" ? "bg-cream text-charcoal" : "border-cream/25 text-cream"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveStoryLanguage("bn")}
                className={`px-2.5 py-1 text-[10px] uppercase font-bold border rounded ${
                  activeStoryLanguage === "bn" ? "bg-cream text-charcoal" : "border-cream/25 text-cream"
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Right panel: Digital Scroll Screen */}
          <div className="space-y-6 flex flex-col items-center">
            {/* The Old Scroll Board */}
            <div className="victorian-frame p-6 bg-cream text-charcoal rounded-lg w-full max-w-lg min-h-[250px] shadow-2xl relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gold/25 pb-2">
                  <span className="font-serif text-[10px] text-red font-bold uppercase tracking-widest">
                    Live RAG Output Node
                  </span>
                  <span className="text-[9px] font-mono text-charcoal/65">
                    Similarity: 98%
                  </span>
                </div>
                
                <h4 className="font-serif text-lg font-bold text-charcoal border-l-4 border-gold pl-2">
                  {selectedSpot.name} ({selectedSpot.bengaliName})
                </h4>

                <div className="text-xs leading-relaxed text-charcoal/85 min-h-[120px]">
                  {isGenerating ? (
                    <div className="flex flex-col gap-2 items-center justify-center py-8">
                      <div className="w-8 h-8 rounded-full border-2 border-gold border-t-red animate-spin" />
                      <span className="font-serif text-[10px] text-gold uppercase animate-pulse">
                        Parsing archives...
                      </span>
                    </div>
                  ) : (
                    <p className="animate-fade-in font-serif italic">
                      {aiStory || (activeStoryLanguage === "bn" ? selectedSpot.storyBn : selectedSpot.storyEn)}
                    </p>
                  )}
                </div>
              </div>

              {/* Play buttons */}
              <div className="flex items-center justify-between border-t border-gold/25 pt-4 mt-4">
                <button
                  onClick={handlePlayVoice}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-4 py-2 bg-charcoal hover:bg-red text-cream text-xs uppercase font-bold tracking-wider rounded border border-gold/30 transition-all disabled:opacity-40"
                >
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>{speech.isPlaying ? "Stop Narration" : "Hear AI Narration"}</span>
                </button>
              </div>
            </div>

            {/* Audio Wave Visualizer dials */}
            {speech.isSpeaking && (
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
                onStop={speech.stop}
                title={selectedSpot.name}
                subtitle={`${selectedSpot.category.toUpperCase()} BROADCAST`}
              />
            )}
          </div>
        </div>
      </section>

      {/* Literature & Cinema retro bookshelf section */}
      <section className="py-24 bg-cream max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          
          {/* Narrative description */}
          <div className="space-y-4">
            <span className="font-serif text-xs uppercase tracking-widest text-red font-bold">
              Archival Literary Matrix
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-charcoal leading-tight">
              Boi Para Reference <br />
              <span className="text-gold italic font-light">& Cinematic Records</span>
            </h2>
            <p className="text-sm text-charcoal/70 leading-relaxed font-sans">
              Kolkata's soul lies within the yellowed pages of its literature and the frames of parallel cinema. Scroll through iconic references connected directly to our geo-cultural nodes.
            </p>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase font-bold text-red border-b border-red/45 pb-0.5 hover:text-charcoal hover:border-charcoal transition-all"
            >
              Scan Bookshelf <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Spine books bookshelf shelf columns */}
          <div className="lg:col-span-2 flex items-end justify-center gap-2 pt-12 border-b-8 border-gold/45 px-4 overflow-x-auto min-h-[320px]">
            {/* Book Spine 1 */}
            <div className="w-16 bg-red text-cream p-3 rounded-t border-t-2 border-x-2 border-gold/40 flex flex-col justify-between items-center text-center shadow-lg h-[260px] transform hover:-translate-y-4 transition-transform duration-300 cursor-pointer">
              <span className="font-serif text-[10px] uppercase tracking-widest font-bold rotate-90 origin-center whitespace-nowrap pt-12 text-gold">
                GITANJALI
              </span>
              <span className="text-[7px] font-mono uppercase tracking-wider text-cream/70">
                R. Tagore
              </span>
            </div>

            {/* Book Spine 2 */}
            <div className="w-16 bg-charcoal text-cream p-3 rounded-t border-t-2 border-x-2 border-gold/40 flex flex-col justify-between items-center text-center shadow-lg h-[280px] transform hover:-translate-y-4 transition-transform duration-300 cursor-pointer">
              <span className="font-serif text-[10px] uppercase tracking-widest font-bold rotate-90 origin-center whitespace-nowrap pt-12 text-cream">
                THE NAMESAKE
              </span>
              <span className="text-[7px] font-mono uppercase tracking-wider text-gold">
                J. Lahiri
              </span>
            </div>

            {/* Book Spine 3 */}
            <div className="w-16 bg-green text-cream p-3 rounded-t border-t-2 border-x-2 border-gold/40 flex flex-col justify-between items-center text-center shadow-lg h-[240px] transform hover:-translate-y-4 transition-transform duration-300 cursor-pointer">
              <span className="font-serif text-[10px] uppercase tracking-widest font-bold rotate-90 origin-center whitespace-nowrap pt-8 text-gold">
                CHOKHER BALI
              </span>
              <span className="text-[7px] font-mono uppercase tracking-wider text-cream/70">
                R. Tagore
              </span>
            </div>

            {/* Book Spine 4 */}
            <div className="w-16 bg-gold text-charcoal p-3 rounded-t border-t-2 border-x-2 border-charcoal/20 flex flex-col justify-between items-center text-center shadow-lg h-[270px] transform hover:-translate-y-4 transition-transform duration-300 cursor-pointer">
              <span className="font-serif text-[10px] uppercase tracking-widest font-bold rotate-90 origin-center whitespace-nowrap pt-12 text-charcoal font-bold">
                CITY OF JOY
              </span>
              <span className="text-[7px] font-mono uppercase tracking-wider text-charcoal/70">
                D. Lapierre
              </span>
            </div>

            {/* Book Spine 5 */}
            <div className="w-16 bg-red text-cream p-3 rounded-t border-t-2 border-x-2 border-gold/40 flex flex-col justify-between items-center text-center shadow-lg h-[290px] transform hover:-translate-y-4 transition-transform duration-300 cursor-pointer">
              <span className="font-serif text-[10px] uppercase tracking-widest font-bold rotate-90 origin-center whitespace-nowrap pt-12 text-gold">
                SHADOW LINES
              </span>
              <span className="text-[7px] font-mono uppercase tracking-wider text-cream/70">
                A. Ghosh
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials block designed as vintage newspaper */}
      <section className="py-24 bg-cream/40 border-t border-gold/15 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="victorian-frame p-8 bg-cream rounded shadow-lg text-charcoal">
          <div className="text-center border-b-2 border-charcoal pb-4 mb-8">
            <h3 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-wider">
              The Bengal Gazette
            </h3>
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest border-t border-charcoal/20 pt-1.5 mt-1.5">
              <span>Established 1780</span>
              <span>Preservation Editorial Column</span>
              <span>Price: One Anna</span>
            </div>
          </div>

          <div className="newspaper-cols leading-relaxed space-y-6">
            <div className="space-y-3 break-inside-avoid">
              <h4 className="font-serif text-lg font-bold border-b border-charcoal/10 pb-1 uppercase tracking-tight">
                "An Emotional Time Machine"
              </h4>
              <p className="text-xs text-charcoal/80 font-serif italic leading-relaxed">
                "Kolkata Alive represents what digital conservation should be. The ambient sitar music, the paper textures, and the authentic stories about tram loops made me feel as if I were sitting at a College Street cafe again, even though I am thousands of miles away in Boston."
              </p>
              <div className="text-[10px] font-mono font-bold text-red uppercase text-right">
                — Dr. Debanjan Mitra, Cultural Historian
              </div>
            </div>

            <div className="space-y-3 break-inside-avoid">
              <h4 className="font-serif text-lg font-bold border-b border-charcoal/10 pb-1 uppercase tracking-tight">
                "Breathes Soul Into Tourism"
              </h4>
              <p className="text-xs text-charcoal/80 font-serif italic leading-relaxed">
                "Most tourism portals feel like a cold catalog of names. Kolkata Alive uses AI in the most artistic way possible—to give voice to old potters, to draw out literature, and to let you capture memories of your grandparents. Extremely stunning."
              </p>
              <div className="text-[10px] font-mono font-bold text-red uppercase text-right">
                — Sunita Sen, Local Heritage Guide
              </div>
            </div>
          </div>
        </div>
      </section>

      <TramWidget />
      <Footer />
    </>
  );
}
