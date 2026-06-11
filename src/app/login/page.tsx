"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { TramWidget } from "@/components/navigation/TramWidget";
import { subscribeAuthState, signUpWithEmail, signInWithEmail, signInWithGoogle, signOutUser, AppUser } from "@/lib/authService";
import { Landmark, Mail, Lock, User, Globe, Bookmark, Heart, BookOpen, Compass } from "lucide-react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Subscribe to auth state changes in real time
    const unsubscribe = subscribeAuthState((user) => {
      setCurrentUser(user);
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setEmail("");
      setPassword("");
      setFullName("");
      setError("");
    } catch (err) {
      console.error("Sign out failure:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-cream py-20 flex items-center justify-center min-h-[80vh] px-4">
        
        {isLoggedIn ? (
          /* Logged In User Profile Dashboard Screen */
          <div className="victorian-frame p-8 bg-cream rounded-lg shadow-2xl max-w-2xl w-full border border-gold space-y-8 animate-fade-in text-charcoal">
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-gold/25 pb-6">
              <img
                src={currentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full border-2 border-gold object-cover shadow-md select-none"
              />
              <div className="text-center sm:text-left space-y-1">
                <span className="font-serif text-[10px] text-red font-bold uppercase tracking-widest bg-red/10 px-2 py-0.5 rounded border border-red/15">
                  Senior Archivist Member
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-charcoal">
                  {currentUser?.displayName || currentUser?.email?.split("@")[0] || "Soumya Mukherjee"}
                </h2>
                <p className="text-xs font-mono text-charcoal/60 select-all">
                  {currentUser?.email || "soumya.mukherjee@preservation.net"}
                </p>
              </div>
            </div>

            {/* Profile bookmarks, logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 select-none">
              
              {/* Saved trails */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider border-b border-gold/20 pb-1.5 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-gold fill-gold/20" /> Active Saved Trails Bookmarks
                </h4>
                <div className="space-y-2.5 font-mono text-[10px] text-charcoal/85">
                  <div className="p-2.5 bg-gold/10 border border-gold/15 rounded flex justify-between items-center">
                    <span>COLLEGE STREET BOI PARA</span>
                    <span className="text-[8px] bg-red text-cream px-1.5 py-0.5 rounded uppercase">literature</span>
                  </div>
                  <div className="p-2.5 bg-gold/10 border border-gold/15 rounded flex justify-between items-center">
                    <span>VICTORIA MEMORIAL ROADMAP</span>
                    <span className="text-[8px] bg-green text-cream px-1.5 py-0.5 rounded uppercase">architecture</span>
                  </div>
                </div>
              </div>

              {/* Contribution statistics */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-bold text-charcoal uppercase tracking-wider border-b border-gold/20 pb-1.5 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red fill-red/20" /> Contribution Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center font-mono">
                  <div className="p-3 bg-charcoal/5 border border-gold/15 rounded">
                    <h5 className="text-lg font-black text-charcoal">4</h5>
                    <p className="text-[8px] text-charcoal/50 uppercase">Uploaded Memoirs</p>
                  </div>
                  <div className="p-3 bg-charcoal/5 border border-gold/15 rounded">
                    <h5 className="text-lg font-black text-charcoal">28</h5>
                    <p className="text-[8px] text-charcoal/50 uppercase">Likes Gained</p>
                  </div>
                </div>
              </div>

            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-charcoal hover:bg-red text-cream rounded text-xs font-bold uppercase tracking-wider border border-gold/20 transition-all select-none"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Form for Signing in / Signing up */
          <div className="victorian-frame p-8 bg-cream rounded-lg shadow-2xl max-w-md w-full border border-gold relative select-none">
            
            <div className="text-center border-b border-gold/25 pb-3 mb-6">
              <span className="font-serif text-xs uppercase tracking-widest text-red font-bold flex items-center justify-center gap-1.5">
                <Landmark className="w-4 h-4 text-red" /> Preservation login
              </span>
              <h3 className="font-serif text-lg font-black uppercase text-charcoal">
                {isSignUp ? "Create Archivist Account" : "Access Preservation Hub"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red/10 border border-red/20 rounded text-red text-xs font-serif italic text-center">
                  {error}
                </div>
              )}
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono uppercase text-gold">Full Name</label>
                  <div className="flex gap-2 items-center bg-cream border border-gold/30 rounded px-3 py-2">
                    <User className="w-4 h-4 text-charcoal/40" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name..."
                      className="bg-transparent text-charcoal w-full focus:outline-none text-xs font-serif italic"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-gold">Email Address</label>
                <div className="flex gap-2 items-center bg-cream border border-gold/30 rounded px-3 py-2">
                  <Mail className="w-4 h-4 text-charcoal/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@preservation.net"
                    className="bg-transparent text-charcoal w-full focus:outline-none text-xs font-serif italic"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-gold">Password</label>
                <div className="flex gap-2 items-center bg-cream border border-gold/30 rounded px-3 py-2">
                  <Lock className="w-4 h-4 text-charcoal/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="bg-transparent text-charcoal w-full focus:outline-none text-xs font-serif italic"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-red hover:bg-red/90 text-cream rounded text-xs font-bold uppercase tracking-wider border border-red transition-all shadow flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-cream border-t-gold rounded-full animate-spin" />
                ) : (
                  <span>{isSignUp ? "Register" : "Sign In"}</span>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-5">
              <span className="h-[1px] bg-gold/25 w-full absolute" />
              <span className="bg-cream px-3 text-[10px] font-mono text-charcoal/50 uppercase relative z-10">or</span>
            </div>

            {/* Google OAuth trigger */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 bg-cream hover:bg-gold/10 border border-gold/30 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-charcoal shadow-sm"
            >
              <Globe className="w-4 h-4 text-red" />
              <span>Continue with Google</span>
            </button>

            <div className="text-center mt-5 text-[11px] font-serif italic text-charcoal/70">
              {isSignUp ? "Already have an account?" : "Don't have an archivist account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-red hover:underline font-bold focus:outline-none"
              >
                {isSignUp ? "Sign In" : "Register Now"}
              </button>
            </div>

          </div>
        )}

      </main>

      <TramWidget />
      <Footer />
    </>
  );
}
