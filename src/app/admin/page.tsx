"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { TramWidget } from "@/components/navigation/TramWidget";
import { mockLocations, mockMemories, Memory } from "@/lib/mockData";
import { subscribeMemories, updateMemoryStatus } from "@/lib/dbService";
import { Shield, Sparkles, Database, BarChart2, Users, Check, X, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [pendingMemories, setPendingMemories] = useState<Memory[]>([]);
  const [activeTab, setActiveTab] = useState<"moderation" | "analytics" | "database">("moderation");
  const [moderationLog, setModerationLog] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to pending memories in real-time
    const unsubscribe = subscribeMemories((data) => {
      setPendingMemories(data);
    }, { status: "pending" });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string, title: string) => {
    await updateMemoryStatus(id, "approved");
    setModerationLog([`APPROVED: "${title}" added to memory Ledger.`, ...moderationLog]);
  };

  const handleReject = async (id: string, title: string) => {
    await updateMemoryStatus(id, "rejected");
    setModerationLog([`REJECTED: "${title}" archived and excluded from Ledger.`, ...moderationLog]);
  };

  return (
    <>
      <Header />

      {/* Admin Dashboard Page Header */}
      <section className="bg-charcoal text-cream pt-20 pb-16 relative overflow-hidden border-b-4 border-gold select-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="font-serif text-xs uppercase tracking-widest text-gold font-bold flex items-center justify-center gap-1.5">
            <Shield className="w-4 h-4 text-gold" /> Heritage Curation Terminal
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black">Preservation Control Center</h1>
          <p className="text-xs sm:text-sm text-cream/70 max-w-xl mx-auto font-light leading-relaxed">
            Manage vector semantic files, moderate crowdsourced oral archives, track preservation metrics, and update local metadata.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-4 select-none">
          <div className="victorian-frame p-4 bg-cream rounded shadow border border-gold">
            
            <div className="space-y-1 mt-2">
              <button
                onClick={() => setActiveTab("moderation")}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeTab === "moderation"
                    ? "bg-red text-cream border-red shadow"
                    : "bg-gold/5 hover:bg-gold/10 border-gold/15 text-charcoal"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Pending Approvals ({pendingMemories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeTab === "analytics"
                    ? "bg-red text-cream border-red shadow"
                    : "bg-gold/5 hover:bg-gold/10 border-gold/15 text-charcoal"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Curation Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab("database")}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeTab === "database"
                    ? "bg-red text-cream border-red shadow"
                    : "bg-gold/5 hover:bg-gold/10 border-gold/15 text-charcoal"
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Vector Database</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic Panel Content */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Tab 1: Moderation Queue */}
          {activeTab === "moderation" && (
            <div className="space-y-6">
              <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center gap-1.5 border-b border-gold/25 pb-2">
                📂 Crowdsourced Approvals Queue
              </span>

              {pendingMemories.length === 0 ? (
                <div className="victorian-frame p-12 text-center bg-cream rounded border border-gold/25 select-none">
                  <Check className="w-12 h-12 text-green mx-auto mb-4" />
                  <h4 className="font-serif text-lg font-bold text-charcoal">Queue is completely clear</h4>
                  <p className="text-xs text-charcoal/70 max-w-sm mx-auto mt-2">
                    All citizen submitted memories have been processed, indexed, and formatted for public display.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingMemories.map((mem) => (
                    <div
                      key={mem.id}
                      className="victorian-frame p-6 bg-cream text-charcoal rounded-lg shadow-sm border border-gold/20 flex flex-col md:flex-row gap-6 items-start justify-between"
                    >
                      <div className="flex-1 space-y-3 font-serif">
                        <div className="flex items-center gap-2">
                          <img
                            src={mem.userAvatar}
                            alt={mem.userName}
                            className="w-7 h-7 rounded-full border border-gold/30 object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-charcoal leading-tight">{mem.userName}</span>
                            <span className="text-[7px] font-mono text-charcoal/50">SUBMITTED MEMOIR LOG</span>
                          </div>
                        </div>
                        <h4 className="font-serif text-base font-extrabold text-charcoal">
                          {mem.title}
                        </h4>
                        <p className="text-xs italic text-charcoal/80 leading-relaxed">
                          "{mem.story}"
                        </p>
                      </div>

                      {/* Moderation dial triggers */}
                      <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto select-none">
                        <button
                          onClick={() => handleApprove(mem.id, mem.title)}
                          className="flex-1 md:w-28 flex items-center justify-center gap-1 py-2 bg-green hover:bg-green/95 text-cream text-[10px] uppercase font-bold tracking-wider rounded border border-green transition-all shadow"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(mem.id, mem.title)}
                          className="flex-1 md:w-28 flex items-center justify-center gap-1 py-2 bg-red hover:bg-red/90 text-cream text-[10px] uppercase font-bold tracking-wider rounded border border-red transition-all shadow"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Log ledger section */}
              {moderationLog.length > 0 && (
                <div className="p-5 bg-charcoal text-cream rounded border border-gold/30 space-y-3 select-none">
                  <h4 className="font-mono text-[10px] text-gold uppercase tracking-widest border-b border-gold/20 pb-1">
                    Curation Terminal Actions Log
                  </h4>
                  <div className="font-mono text-[9px] text-cream/70 space-y-1.5 max-h-36 overflow-y-auto">
                    {moderationLog.map((log, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-gold font-bold">&gt;&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Analytics graphs */}
          {activeTab === "analytics" && (
            <div className="space-y-6 select-none">
              <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center gap-1.5 border-b border-gold/25 pb-2">
                📈 Platform Curation Analytics
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="victorian-frame p-5 bg-cream rounded shadow text-center space-y-2">
                  <Database className="w-8 h-8 text-gold mx-auto" />
                  <h4 className="font-serif text-2xl font-black text-charcoal">
                    {mockLocations.length}
                  </h4>
                  <p className="text-[10px] font-mono text-charcoal/60 uppercase">Indexed Vector Nodes</p>
                </div>

                <div className="victorian-frame p-5 bg-cream rounded shadow text-center space-y-2">
                  <Users className="w-8 h-8 text-green mx-auto" />
                  <h4 className="font-serif text-2xl font-black text-charcoal">
                    {mockMemories.length + 2}
                  </h4>
                  <p className="text-[10px] font-mono text-charcoal/60 uppercase">Citizen Memoirs Logged</p>
                </div>

                <div className="victorian-frame p-5 bg-cream rounded shadow text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-red mx-auto" />
                  <h4 className="font-serif text-2xl font-black text-charcoal">
                    98.4%
                  </h4>
                  <p className="text-[10px] font-mono text-charcoal/60 uppercase">Preservation Score</p>
                </div>
              </div>

              {/* Chart simulation layout */}
              <div className="victorian-frame p-6 bg-cream rounded shadow space-y-4">
                <h4 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider border-b border-gold/20 pb-2">
                  Geo-Preservation Category Weights
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-charcoal/80 mb-1">
                      <span>LITERATURE & CINEMA</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gold/15 h-3 rounded overflow-hidden">
                      <div className="bg-red h-full rounded" style={{ width: "35%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-charcoal/80 mb-1">
                      <span>ARCHITECTURE & HISTORIC LANDMARKS</span>
                      <span>28%</span>
                    </div>
                    <div className="w-full bg-gold/15 h-3 rounded overflow-hidden">
                      <div className="bg-green h-full rounded" style={{ width: "28%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-charcoal/80 mb-1">
                      <span>FOOD CULTURE PRESERVATION</span>
                      <span>22%</span>
                    </div>
                    <div className="w-full bg-gold/15 h-3 rounded overflow-hidden">
                      <div className="bg-gold h-full rounded" style={{ width: "22%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Vector Database listings */}
          {activeTab === "database" && (
            <div className="space-y-6 select-none">
              <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center gap-1.5 border-b border-gold/25 pb-2">
                🗄️ Semantic File Directory Listings
              </span>

              <div className="victorian-frame p-5 bg-cream rounded shadow space-y-3">
                <h4 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wide border-b border-gold/20 pb-2">
                  RAG Vector Store Indexes
                </h4>
                <div className="space-y-2.5 max-h-96 overflow-y-auto font-mono text-[10px] text-charcoal/85">
                  {mockLocations.map((loc) => (
                    <div key={loc.id} className="p-3 bg-gold/10 border border-gold/15 rounded flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-charcoal uppercase">{loc.name.split(" (")[0]}</span>
                        <span className="text-[8px] text-charcoal/50">ID: {loc.id}</span>
                      </div>
                      <span className="bg-charcoal text-cream px-2 py-0.5 rounded text-[8px] uppercase">
                        {loc.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <TramWidget />
      <Footer />
    </>
  );
}
