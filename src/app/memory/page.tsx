"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { TramWidget } from "@/components/navigation/TramWidget";
import { Memory } from "@/lib/mockData";
import { subscribeMemories, addMemory, likeMemory } from "@/lib/dbService";
import { BookOpen, Sparkles, Image as ImageIcon, Heart, MessageSquare, Plus, Check } from "lucide-react";
import canvasConfetti from "canvas-confetti";

export default function MemoryArchive() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newStory, setNewStory] = useState("");
  const [newPhoto, setNewPhoto] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Subscribe to approved memories in real-time
    const unsubscribe = subscribeMemories((data) => {
      setMemories(data);
    }, { status: "approved" });

    return () => unsubscribe();
  }, []);

  const handleLike = async (id: string) => {
    await likeMemory(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newStory || !newAuthor) return;

    setIsSubmitting(true);
    
    try {
      await addMemory({
        title: newTitle,
        story: newStory,
        userName: `${newAuthor} (Heritage Contributor)`,
        userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100",
        photoUrl: newPhoto || "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=300",
        likesCount: 1,
        commentsCount: 0,
        locationId: "",
        status: "pending" // Submitted for curation moderation in admin terminal!
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      
      canvasConfetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Reset form
      setNewTitle("");
      setNewStory("");
      setNewPhoto("");
      setNewAuthor("");

      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      console.error("Failed to submit memoir:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Memory Scrapbook Page Header */}
      <section className="bg-charcoal text-cream pt-20 pb-16 relative overflow-hidden border-b-4 border-gold select-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="font-serif text-xs uppercase tracking-widest text-gold font-bold">Oral Preservation Network</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black">Community Memory Scrapbook</h1>
          <p className="text-xs sm:text-sm text-cream/70 max-w-xl mx-auto font-light leading-relaxed">
            Preserve and browse precious hand-written letters, old photographs, tram stories, and local audio testimonies shared by Kolkata's citizens across generations.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left Side: Nostalgic Upload memory card form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="victorian-frame p-6 bg-cream rounded-lg shadow border border-gold relative select-none">
            
            <div className="text-center border-b border-gold/25 pb-3 mb-6">
              <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center justify-center gap-1.5">
                <BookOpen className="w-4 h-4 text-red" /> Preserves Archive
              </span>
              <h3 className="font-serif text-sm font-black uppercase text-charcoal">Contribute Oral Memoir</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-gold">Memoir Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My first monsoon at Esplanade..."
                  className="px-3 py-2 bg-cream text-charcoal border border-gold/30 rounded focus:outline-none w-full text-xs placeholder:text-charcoal/40 font-serif italic"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-gold">Your Story</label>
                <textarea
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="Write your nostalgic memory here..."
                  rows={5}
                  className="px-3 py-2 bg-cream text-charcoal border border-gold/30 rounded focus:outline-none w-full text-xs placeholder:text-charcoal/40 font-serif italic"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-gold">Historic Photograph Link (Optional)</label>
                <input
                  type="url"
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  placeholder="Paste Unsplash image URL..."
                  className="px-3 py-2 bg-cream text-charcoal border border-gold/30 rounded focus:outline-none w-full text-xs placeholder:text-charcoal/40 font-serif italic"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-gold">Contributor Pen-name</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Satyajit Banerjee"
                  className="px-3 py-2 bg-cream text-charcoal border border-gold/30 rounded focus:outline-none w-full text-xs placeholder:text-charcoal/40 font-serif italic"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 text-cream rounded text-xs font-bold uppercase tracking-wider transition-all border shadow flex items-center justify-center gap-1.5 ${
                  isSuccess
                    ? "bg-green border-green"
                    : "bg-red border-red hover:bg-red/90"
                }`}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-cream border-t-gold rounded-full animate-spin" />
                ) : isSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-cream" />
                    <span>Queued! Approve in /admin</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-cream" />
                    <span>Upload to Scrapbook</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Page layouts of scrapbook memory cards */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center gap-1.5 border-b border-gold/25 pb-2">
              <Sparkles className="w-4 h-4 text-gold fill-gold/20" /> Active Preserved Memory Ledger
            </span>

            <div className="space-y-8">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="victorian-frame p-6 bg-cream text-charcoal rounded-lg shadow-md border border-gold/20 space-y-4 animate-fade-in relative flex flex-col md:flex-row gap-6"
                >
                  {/* Left Side: Nostalgic Polaroids crop image layout */}
                  <div className="w-full md:w-44 flex-shrink-0 select-none">
                    <div className="p-2 bg-cream border-2 border-gold/30 shadow-lg rounded transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                      <div className="aspect-[4/5] bg-charcoal/10 overflow-hidden rounded relative">
                        <img
                          src={mem.photoUrl}
                          alt={mem.title}
                          className="w-full h-full object-cover grayscale brightness-95"
                        />
                      </div>
                      <div className="text-center pt-2 font-mono text-[7px] text-charcoal/50">
                        {new Date(mem.createdAt).toLocaleDateString()} ARCHIVE
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Narrative text story */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={mem.userAvatar}
                          alt={mem.userName}
                          className="w-6 h-6 rounded-full border border-gold/30 object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-charcoal leading-tight">{mem.userName}</span>
                          <span className="text-[7px] font-mono text-charcoal/40 uppercase">Preservation Member</span>
                        </div>
                      </div>

                      <h3 className="font-serif text-lg font-black text-charcoal">
                        {mem.title}
                      </h3>
                      
                      <p className="font-serif text-xs italic text-charcoal/80 leading-relaxed indent-4 text-justify">
                        "{mem.story}"
                      </p>
                    </div>

                    {/* Reactions buttons */}
                    <div className="flex items-center gap-4 pt-3 border-t border-gold/15 text-[10px] font-mono text-charcoal/70 select-none">
                      <button
                        onClick={() => handleLike(mem.id)}
                        className="flex items-center gap-1 hover:text-red transition-colors font-bold uppercase"
                      >
                        <Heart className="w-3.5 h-3.5 text-red fill-red/20 hover:fill-red" />
                        <span>{mem.likesCount} Loves</span>
                      </button>

                      <div className="flex items-center gap-1 uppercase font-bold">
                        <MessageSquare className="w-3.5 h-3.5 text-green" />
                        <span>{mem.commentsCount} Comments</span>
                      </div>
                    </div>
                  </div>

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
