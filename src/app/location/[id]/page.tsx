"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { TramWidget } from "@/components/navigation/TramWidget";
import { useSpeech } from "@/hooks/useSpeech";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { mockLocations, Location, Memory } from "@/lib/mockData";
import { subscribeMemories, addMemory } from "@/lib/dbService";
import { ArrowLeft, Volume2, Globe, Calendar, BookOpen, Quote, HelpCircle, ChevronRight, MessageSquare, Plus } from "lucide-react";

export default function LocationDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [location, setLocation] = useState<Location | null>(null);
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [relatedMemories, setRelatedMemories] = useState<Memory[]>([]);
  
  // Custom comments states
  const [newComment, setNewComment] = useState("");
  const [localMemories, setLocalMemories] = useState<Memory[]>([]);

  const speech = useSpeech();

  useEffect(() => {
    const spot = mockLocations.find((l) => l.id === id);
    if (!spot) {
      // Fallback redirect to explorer if not found
      return;
    }
    setLocation(spot);

    // Load bookmarks
    const saved = localStorage.getItem("kolkata_alive_bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    // Subscribe to approved memories for this specific location in real-time
    const unsubscribe = subscribeMemories((data) => {
      setLocalMemories(data);
      setRelatedMemories(data);
    }, { status: "approved", locationId: id });

    return () => unsubscribe();
  }, [id]);

  if (!location) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-gold border-t-red rounded-full animate-spin mb-4" />
        <span className="font-serif text-sm text-gold uppercase animate-pulse">
          Opening Historical Log...
        </span>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(location.id);

  const toggleBookmark = () => {
    let next: string[];
    if (isBookmarked) {
      next = bookmarks.filter((b) => b !== location.id);
    } else {
      next = [...bookmarks, location.id];
    }
    setBookmarks(next);
    localStorage.setItem("kolkata_alive_bookmarks", JSON.stringify(next));
  };

  const handlePlayVoice = () => {
    const textToSpeak = language === "bn" ? location.storyBn : location.storyEn;
    speech.speak(textToSpeak, language);
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !location) return;

    try {
      await addMemory({
        title: "Shared Story",
        story: newComment,
        userName: "You (Heritage Preserver)",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
        photoUrl: location.imageUrl,
        likesCount: 1,
        commentsCount: 0,
        locationId: location.id,
        status: "approved" // Comments at locations are approved instantly for social adda!
      });
      setNewComment("");
    } catch (error) {
      console.error("Failed to add memory comment:", error);
    }
  };

  return (
    <>
      <Header />

      {/* Parallax Hero Image Block */}
      <section className="relative h-[65vh] flex items-end justify-start text-cream overflow-hidden border-b-8 border-gold">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 scale-y-100 transition-transform duration-1000"
          style={{ backgroundImage: `url('${location.imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full space-y-3">
          <Link
            href="/explorer"
            className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-gold hover:text-cream transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Archive Directory
          </Link>
          
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-serif text-3xl sm:text-6xl font-black text-cream">
              {location.name}
            </h1>
            <span className="font-serif text-xl sm:text-3xl text-gold italic">
              {location.bengaliName}
            </span>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <span className="bg-red text-cream text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow">
              {location.category}
            </span>
            <button
              onClick={toggleBookmark}
              className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded border transition-all ${
                isBookmarked
                  ? "bg-gold text-charcoal border-gold shadow"
                  : "bg-cream/10 border-cream/35 text-cream hover:bg-cream/20"
              }`}
            >
              {isBookmarked ? "💾 Log Bookmarked" : "🔖 Save Bookmark"}
            </button>
          </div>
        </div>
      </section>

      {/* Main preservation columns */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left Side: Detail texts, timeline, refs */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Section: Immersive Story Telling */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gold/25 pb-3">
              <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> Cognitive Narrative Layer
              </span>
              
              {/* English vs Bengali toggle */}
              <div className="flex items-center gap-1 bg-gold/10 p-1.5 rounded border border-gold/15">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 text-[9px] uppercase font-bold transition-all rounded ${
                    language === "en" ? "bg-red text-cream shadow" : "text-charcoal/70 hover:text-charcoal"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("bn")}
                  className={`px-2.5 py-1 text-[9px] uppercase font-bold transition-all rounded ${
                    language === "bn" ? "bg-red text-cream shadow" : "text-charcoal/70 hover:text-charcoal"
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            <div className="newspaper-cols text-sm leading-relaxed text-charcoal/85 space-y-4">
              <p className="font-serif italic text-base leading-relaxed text-charcoal/95 border-l-4 border-gold pl-4 pt-1 mb-4">
                {location.shortDescription}
              </p>
              <p className="font-serif text-justify indent-8 text-charcoal/80 leading-loose">
                {language === "bn" ? location.storyBn : location.storyEn}
              </p>
            </div>

            {/* Float Narration Audio triggers */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handlePlayVoice}
                className="flex items-center gap-1.5 px-4 py-2 bg-charcoal hover:bg-red text-cream text-xs uppercase font-bold tracking-wider rounded border border-gold/30 transition-all shadow"
              >
                <Volume2 className="w-4 h-4 animate-pulse text-gold" />
                <span>{speech.isPlaying ? "Stop Broadcast" : "BroadCast Story Voice"}</span>
              </button>
            </div>
          </div>

          {/* Section: Historical Timeline milestones */}
          <div className="space-y-8 select-none">
            <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center gap-2 border-b border-gold/25 pb-3">
              <Calendar className="w-3.5 h-3.5" /> Historical Chronological Log
            </span>

            <div className="relative border-l border-gold/45 pl-6 ml-4 space-y-8">
              {location.timeline.map((item, idx) => (
                <div key={item.year} className="relative animate-fade-in">
                  {/* Timeline dot */}
                  <div className="absolute -left-[30px] top-1 w-4.5 h-4.5 bg-cream border-2 border-gold rounded-full flex items-center justify-center shadow">
                    <div className="w-1.5 h-1.5 bg-red rounded-full" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-serif text-sm font-bold text-red bg-red/10 px-2 py-0.5 rounded border border-red/15">
                      {item.year}
                    </span>
                    <h4 className="font-serif text-base font-extrabold text-charcoal">
                      {item.title}
                    </h4>
                    <p className="text-xs text-charcoal/70 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Literature References bookshelf */}
          <div className="space-y-6">
            <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center gap-2 border-b border-gold/25 pb-3">
              <BookOpen className="w-3.5 h-3.5" /> Library References catalog
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {location.literatureReferences.map((ref) => (
                <div key={ref.title} className="victorian-frame p-5 bg-cream rounded shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5">
                      <Quote className="w-4 h-4 text-gold fill-gold/25" />
                      <h4 className="font-serif text-sm font-black text-charcoal uppercase tracking-wide">
                        {ref.title}
                      </h4>
                    </div>
                    <p className="text-xs font-mono text-red italic">by {ref.author}</p>
                    <p className="text-xs text-charcoal/70 leading-relaxed">{ref.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Radio, Map coords, Community notes */}
        <div className="lg:col-span-1 space-y-10">
          
          {/* Retro radio block */}
          {speech.isSpeaking ? (
            <div className="space-y-4">
              <span className="block font-mono text-[9px] text-charcoal/50 uppercase tracking-widest">
                Active Sound visualizer
              </span>
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
                title={location.name}
                subtitle={`${location.category.toUpperCase()} BROADCAST`}
              />
            </div>
          ) : (
            <div className="victorian-frame p-6 bg-cream rounded shadow text-center space-y-4 select-none">
              <span className="font-serif text-xs uppercase tracking-widest text-gold font-bold">Audio Broadcast Node</span>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Tune in to hear the immersive bilingual history narration for this landmark.
              </p>
              <button
                onClick={handlePlayVoice}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-red text-cream rounded text-xs font-bold uppercase tracking-wider transition-all shadow hover:bg-red/90"
              >
                <Volume2 className="w-4 h-4 text-cream" />
                <span>Hear Broadcast Stream</span>
              </button>
            </div>
          )}

          {/* Mini-map layout coordinate drawer */}
          <div className="victorian-frame p-5 bg-cream rounded shadow space-y-4 select-none">
            <span className="font-serif text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1">
              🗺️ Coordinates Preserves
            </span>
            <div className="h-40 bg-charcoal/10 rounded border border-gold/20 flex flex-col justify-center items-center relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70 filter grayscale contrast-125"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=300')" }}
              />
              <div className="absolute inset-0 bg-cream/10 z-0" />
              {/* Marker pin */}
              <div className="relative z-10 flex flex-col items-center gap-1 text-center bg-cream/95 p-2 rounded shadow border border-gold/30">
                <span className="font-serif text-[10px] font-black text-charcoal leading-tight">
                  {location.name.split(" (")[0]}
                </span>
                <span className="font-mono text-[8px] text-green font-bold">
                  {location.coordinates.lat.toFixed(4)}° N, {location.coordinates.lng.toFixed(4)}° E
                </span>
              </div>
            </div>
            <Link
              href="/map"
              className="w-full inline-flex justify-center items-center gap-1 text-[10px] uppercase font-bold text-red border border-red/35 py-2.5 rounded hover:bg-red hover:text-cream transition-all text-center"
            >
              <span>Explore Trail Route Map</span>
            </Link>
          </div>

          {/* Bulletin note scrapbook entries */}
          <div className="space-y-6">
            <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center gap-1.5 border-b border-gold/25 pb-2">
              <MessageSquare className="w-4 h-4" /> Community Scrapbook Notes
            </span>

            {/* Form */}
            <form onSubmit={handleAddMemory} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Pin a memory to this board..."
                className="px-3 py-2 bg-cream border border-gold/30 rounded focus:outline-none w-full text-xs placeholder:text-charcoal/40 font-serif italic"
              />
              <button
                type="submit"
                className="bg-green hover:bg-green/95 text-cream px-3 rounded border border-green flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* List */}
            <div className="space-y-4">
              {localMemories.map((mem) => (
                <div key={mem.id} className="p-4 bg-gold/5 border-l-4 border-gold rounded shadow-sm space-y-3 font-serif">
                  <div className="flex items-center gap-2">
                    <img
                      src={mem.userAvatar}
                      alt={mem.userName}
                      className="w-6 h-6 rounded-full border border-gold/30 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-charcoal">{mem.userName}</span>
                      <span className="text-[7px] font-mono text-charcoal/50">
                        {new Date(mem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs italic text-charcoal/80 leading-relaxed">
                    "{mem.story}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <TramWidget />
      <Footer />
    </>
  );
}
