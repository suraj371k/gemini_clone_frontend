"use client";
import * as React from "react";
import { Menu, X, MessageCircle, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const { user, clearUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    } catch {}
    clearUser();
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          scrolled
            ? "backdrop-blur-lg bg-gray-900/90 shadow-xl border-b border-gray-700/50 py-2"
            : "py-4 bg-gray-900"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3 group font-bold text-xl">
            <div className="relative transform transition-transform duration-300 group-hover:scale-105">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative flex items-center px-4 py-2 bg-gray-800 ring-1 ring-gray-700 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-semibold tracking-tight">
                  GeminiClone
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 text-base font-medium">
            <Link
              href="/create-room"
              className="flex items-center gap-2 px-4 py-2 rounded-xl 
                text-gray-300 hover:text-blue-400 
                hover:bg-gray-800/50 
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Create room</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 rounded-xl 
                text-gray-300 hover:text-blue-400 
                hover:bg-gray-800/50 
                transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] transform hover:scale-105"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Auth buttons */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-200 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 transition-all duration-300 hover:bg-blue-900/30 hover:border-blue-700">
                  {user.name ?? user.phone ?? "User"}
                </span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="rounded-full border-gray-600 text-black hover:bg-blue-900/30 hover:text-blue-400 hover:border-blue-600 transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="rounded-full border-gray-600 text-black hover:bg-blue-900/30 hover:text-blue-400 hover:border-blue-600 transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-full h-10 w-10 hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-110"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-300" />
              )}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 mt-16 md:hidden">
          <div
            className="fixed inset-0 bg-black/40 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative bg-gray-900 shadow-2xl rounded-b-2xl mx-4 p-6 animate-in slide-in-from-top-5 duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link
                href="/create-room"
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-200 font-medium hover:bg-blue-900/30 hover:text-blue-400 transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Create Room</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-200 font-medium hover:bg-blue-900/30 hover:text-blue-400 transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <div className="pt-4 border-t border-gray-700">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="text-sm font-medium text-gray-400">
                      Signed in as
                    </div>
                    <div className="text-gray-200 font-semibold">
                      {user.name ?? user.phone ?? "User"}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="justify-center border-gray-600 text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 hover:border-blue-600 transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-center border-gray-600 text-gray-200 hover:bg-blue-900/30 hover:text-blue-400 hover:border-blue-600 transition-all duration-300 transform hover:scale-105 font-medium"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        className="w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </>
  );
};

export default Navbar;