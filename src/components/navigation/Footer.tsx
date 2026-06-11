"use client";

import Link from "next/link";
import { Landmark, Mail, Phone, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream/90 border-t-4 border-gold pt-16 pb-8 relative overflow-hidden">
      {/* Decorative vector background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-repeat bg-[size:30px_30px] bg-center bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22%3E%3Cpath fill=%22%23FAF7F2%22 d=%22M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z%22/%3E%3C/svg%3E')]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-cream/10 pb-12">
          {/* Logo & Narrative Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red flex items-center justify-center border border-gold/30">
                <span className="font-serif text-cream text-lg font-bold">ক</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-widest text-cream">
                KOLKATA <span className="text-gold font-light">ALIVE</span>
              </span>
            </Link>
            <p className="text-sm text-cream/70 leading-relaxed max-w-md font-sans">
              Kolkata Alive is an AI-powered cultural preservation platform dedicated to cataloging the living memories, historic streets, trams, food cultures, and literary soul of the City of Joy.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs font-mono text-gold">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" /> Built for smart heritage preservation
              </span>
            </div>
          </div>

          {/* Useful Links Column */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
              Heritage Walkways
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/explorer" className="hover:text-red hover:underline transition-all">
                  Heritage Directory
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-red hover:underline transition-all">
                  Smart Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/memory" className="hover:text-red hover:underline transition-all">
                  Memory Archives
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-red hover:underline transition-all">
                  Curation & Moderation
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
              Subscribe to Adda
            </h4>
            <p className="text-xs text-cream/65 mb-4 leading-relaxed">
              Receive monthly journals on historic architecture restoration, new community stories, and tram preservation routes.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Your email..."
                className="px-3 py-2 text-xs text-charcoal bg-cream/90 border border-gold/30 rounded-l focus:outline-none w-full"
                required
              />
              <button
                type="submit"
                className="bg-red hover:bg-red/90 text-cream px-3 py-2 rounded-r text-xs uppercase font-bold border border-red tracking-wider transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} Kolkata Alive preservation network. All rights reserved.</p>
          <p className="flex items-center gap-1.5 mt-4 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-red fill-red" /> for the City of Joy.
          </p>
        </div>
      </div>
    </footer>
  );
}
