"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { TramWidget } from "@/components/navigation/TramWidget";
import { useSpeech } from "@/hooks/useSpeech";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { mockLocations, Location } from "@/lib/mockData";
import { Compass, Search, Filter, Volume2, BookMarked, Bookmark, MapPin, Sparkles, BookOpen } from "lucide-react";

export default function Explorer() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeAudioLoc, setActiveAudioLoc] = useState<Location | null>(null);

  const speech = useSpeech();

  // Load bookmarks on mount
  useEffect(() => {
    const saved = localStorage.getItem("kolkata_alive_bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  // Fetch results based on search parameters
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const response = await fetch(
          `/api/rag?query=${encodeURIComponent(query)}&category=${selectedCategory}`
        );
        const data = await response.json();
        setLocations(data.results || []);
      } catch (err) {
        console.error("RAG fetch filter error:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchFilteredData();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedCategory]);

  const toggleBookmark = (id: string) => {
    let next: string[];
    if (bookmarks.includes(id)) {
      next = bookmarks.filter((b) => b !== id);
    } else {
      next = [...bookmarks, id];
    }
    setBookmarks(next);
    localStorage.setItem("kolkata_alive_bookmarks", JSON.stringify(next));
  };

  const handlePlayAudio = (spot: Location) => {
    if (activeAudioLoc?.id === spot.id && speech.isPlaying) {
      speech.stop();
      setActiveAudioLoc(null);
    } else {
      setActiveAudioLoc(spot);
      speech.speak(spot.storyEn, "en");
    }
  };

  const categories = [
    { label: "All Categories", value: "" },
    { label: "Literature", value: "literature" },
    { label: "Architecture", value: "architecture" },
    { label: "Festivals", value: "festivals" },
    { label: "Food Culture", value: "food" },
    { label: "History", value: "history" },
  ];

  return (
    <>
      <Header />

      {/* Explorer Page Header */}
      <section className="bg-charcoal text-cream pt-20 pb-16 relative overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10 select-none">
          <span className="font-serif text-xs uppercase tracking-widest text-gold font-bold">Heritage Catalog Directory</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black">Search the Memory Layers</h1>
          <p className="text-xs sm:text-sm text-cream/70 max-w-xl mx-auto font-light leading-relaxed">
            Locate historical landmarks, explore literature coordinates, retrieve vector indexes, and parse oral preservation recordings.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter Control Board styled like a vintage Tram Ticket */}
        <div className="lg:col-span-1 space-y-6">
          <div className="victorian-frame p-5 bg-cream rounded-lg shadow border border-gold relative select-none">
            {/* The Ticket Punch Holes decoration */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-cream border border-gold rounded-full shadow-inner" />
              ))}
            </div>

            <div className="text-center border-b border-gold/25 pb-3 mb-6 pt-2">
              <span className="font-serif text-xs uppercase tracking-widest text-gold font-bold">Kolkata Tramways</span>
              <h3 className="font-serif text-sm font-extrabold uppercase text-charcoal">Category Punch Ticket</h3>
            </div>

            <div className="space-y-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                      isSelected
                        ? "bg-green text-cream border-green shadow"
                        : "bg-gold/5 hover:bg-gold/10 border-gold/15 text-charcoal"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {/* Punch Hole */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        isSelected ? "bg-cream border-cream scale-110" : "bg-cream/10 border-gold/30"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Travel stats */}
            <div className="border-t border-gold/20 pt-4 mt-6 text-[10px] font-mono text-charcoal/60 leading-relaxed flex flex-col gap-1">
              <div className="flex justify-between">
                <span>INDEX NODES:</span>
                <span className="text-charcoal font-bold">{locations.length}</span>
              </div>
              <div className="flex justify-between">
                <span>FARE PRICE:</span>
                <span className="text-charcoal font-bold">20 PAISA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Search input & Interactive grid */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Search bar */}
          <div className="flex gap-2 bg-cream p-1.5 border border-gold/35 rounded shadow-sm">
            <div className="flex items-center pl-3 text-charcoal/50">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, description, tags, literature references..."
              className="px-2 py-3 bg-transparent text-charcoal w-full focus:outline-none text-sm placeholder:text-charcoal/40 font-serif italic"
            />
          </div>

          {/* Cards list */}
          {locations.length === 0 ? (
            <div className="victorian-frame p-12 text-center bg-cream rounded-lg border border-gold/20">
              <Compass className="w-12 h-12 text-gold mx-auto mb-4 animate-spin" />
              <h4 className="font-serif text-lg font-bold text-charcoal">No preservation records matched</h4>
              <p className="text-xs text-charcoal/70 max-w-sm mx-auto mt-2">
                Try widening your query parameters or choosing a different ticket filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {locations.map((spot) => {
                const isBookmarked = bookmarks.includes(spot.id);
                return (
                  <div
                    key={spot.id}
                    className="victorian-frame bg-cream p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Header visual */}
                      <div className="relative h-44 rounded overflow-hidden border border-gold/15">
                        <img
                          src={spot.imageUrl}
                          alt={spot.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                          {/* Bookmark trigger */}
                          <button
                            onClick={() => toggleBookmark(spot.id)}
                            className="p-1.5 bg-cream/90 hover:bg-cream rounded-full border border-gold/30 text-charcoal shadow hover:scale-105 active:scale-95 transition-all"
                            title={isBookmarked ? "Remove Bookmark" : "Save Trail Bookmark"}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-red text-red border-red" : "text-charcoal"}`} />
                          </button>
                        </div>
                        <span className="absolute bottom-2.5 left-2.5 bg-charcoal text-cream text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded shadow">
                          {spot.category}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="space-y-2">
                        <h3 className="font-serif text-lg font-extrabold text-charcoal">
                          {spot.name}
                        </h3>
                        <p className="font-serif text-[10px] text-gold font-bold uppercase tracking-widest mt-[-4px]">
                          {spot.bengaliName}
                        </p>
                        <p className="text-xs text-charcoal/75 leading-relaxed line-clamp-3">
                          {spot.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between border-t border-gold/15 pt-3.5 mt-4">
                      <button
                        onClick={() => handlePlayAudio(spot)}
                        className="flex items-center gap-1 bg-gold/15 hover:bg-red hover:text-cream text-charcoal px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>
                          {activeAudioLoc?.id === spot.id && speech.isPlaying ? "Stop" : "Audio"}
                        </span>
                      </button>

                      <Link
                        href={`/location/${spot.id}`}
                        className="flex items-center gap-1 text-[10px] uppercase font-bold text-red hover:text-charcoal hover:underline transition-all"
                      >
                        <span>Preserve Log</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Audio Broadcast panel at screen bottom */}
          {activeAudioLoc && speech.isSpeaking && (
            <div className="fixed bottom-6 left-6 z-40 max-w-sm w-full">
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
                  setActiveAudioLoc(null);
                }}
                title={activeAudioLoc.name}
                subtitle={`${activeAudioLoc.category.toUpperCase()} AUDIO`}
              />
            </div>
          )}
        </div>
      </main>

      <TramWidget />
      <Footer />
    </>
  );
}

// Arrow helper icon
function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
