"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { subscribeAuthState, AppUser } from "@/lib/authService";
import { Landmark, Map, Compass, BookOpen, User, Menu, X, Shield } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  useEffect(() => {
    // Subscribe to active user session in real-time
    const unsubscribe = subscribeAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const menuItems = [
    { name: "Explore", href: "/explorer", icon: Compass },
    { name: "Map", href: "/map", icon: Map },
    { name: "Memories", href: "/memory", icon: BookOpen },
    { name: "Dashboard", href: "/admin", icon: Shield },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass-sheet border-b border-gold/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Title */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-red flex items-center justify-center border-2 border-gold/40 shadow group-hover:rotate-12 transition-transform duration-300">
                <span className="font-serif text-cream text-lg font-bold">ক</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-widest text-charcoal flex items-center gap-1 group-hover:text-red transition-colors">
                  KOLKATA <span className="text-gold font-light">ALIVE</span>
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-green">
                  Preservation & AI Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Large Screen Nav Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 relative group ${
                    active ? "text-red" : "text-charcoal/80 hover:text-red"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {/* Hover ink underline bar */}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2px] bg-red transition-transform duration-300 origin-center ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Auth CTA button */}
            {currentUser ? (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-1.5 hover:text-red transition-all duration-300"
              >
                <img
                  src={currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-gold/30 object-cover shadow-sm"
                />
                <span className="text-xs font-serif italic text-charcoal/80 hidden lg:inline">
                  {currentUser.displayName || currentUser.email?.split("@")[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-red text-cream rounded-full border border-gold/20 text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/login"
              className="p-2 text-charcoal hover:text-red transition-colors flex items-center"
              title="Profile"
            >
              {currentUser ? (
                <img
                  src={currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full border border-gold/30 object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-charcoal hover:text-red transition-colors rounded-lg border border-gold/10"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glass-sheet border-b border-gold/10 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all ${
                  active
                    ? "bg-red/10 text-red border border-red/20"
                    : "text-charcoal/80 hover:bg-gold/10 hover:text-charcoal"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          {currentUser ? (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all text-charcoal/80 hover:bg-gold/10 hover:text-charcoal mt-4 border border-gold/15"
            >
              <img
                src={currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"}
                alt="Avatar"
                className="w-6 h-6 rounded-full border border-gold/30 object-cover"
              />
              <span className="font-serif italic">
                {currentUser.displayName || currentUser.email?.split("@")[0]}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-charcoal text-cream rounded-lg text-sm font-semibold uppercase tracking-wider transition-all hover:bg-red border border-gold/15 shadow mt-4"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}</div>
      )}
    </header>
  );
}
