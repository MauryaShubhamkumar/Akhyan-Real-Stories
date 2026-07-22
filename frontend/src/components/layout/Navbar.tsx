import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Moon, PenLine, Sun, Search, X, BookOpen } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Button from "../ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      if (searchQuery === currentQ) return;

      const nextParams = new URLSearchParams(searchParams);
      if (searchQuery.trim() === "") {
        nextParams.delete("q");
      } else {
        nextParams.set("q", searchQuery);
      }
      nextParams.delete("page");

      if (window.location.pathname !== "/search") {
        navigate(`/search?${nextParams.toString()}`);
      } else {
        setSearchParams(nextParams);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 shadow-warm-sm"
          : "border-b border-transparent"
      }`}
      style={{
        background: scrolled
          ? (theme === "dark"
              ? "rgba(20, 18, 16, 0.92)"
              : "rgba(250, 250, 247, 0.92)")
          : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        {/* Logo */}
        {!mobileSearchOpen && (
          <Link
            to="/"
            className="group flex items-center gap-2 shrink-0 animate-fade-in"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent shadow-warm-sm transition-transform duration-200 group-hover:scale-105">
              <BookOpen size={16} className="text-white" />
            </div>
            <span
              className="font-display text-2xl font-bold tracking-tight text-ink"
              style={{ fontStyle: "italic" }}
            >
              Akhyan
            </span>
          </Link>
        )}

        {/* Mobile Search Expanded */}
        {mobileSearchOpen && (
          <div className="relative flex-1 mr-3 max-w-md animate-fade-in">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full h-10 rounded-full border border-border bg-surface pl-10 pr-10 text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              autoFocus
            />
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="h-9 w-44 lg:w-56 rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:w-52 lg:focus:w-64 transition-all duration-300"
            />
          </div>

          {/* Mobile Search Trigger */}
          {!mobileSearchOpen && (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface transition-colors"
            >
              <Search size={18} />
            </button>
          )}

          {/* Home Link */}
          <Link
            to="/"
            className="hidden sm:block text-sm font-medium text-muted hover:text-ink transition-colors duration-200"
          >
            Home
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-ink hover:bg-surface transition-all duration-200"
          >
            {theme === "light" ? (
              <Moon size={17} />
            ) : (
              <Sun size={17} />
            )}
          </button>

          {user ? (
            <>
              <Button
                asChild
                size="sm"
                leftIcon={<PenLine size={15} />}
                className="hidden sm:inline-flex font-semibold text-sm shadow-warm-sm"
              >
                <Link to="/create">Write</Link>
              </Button>

              {/* Write icon on mobile */}
              <Link
                to="/create"
                className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full text-white bg-accent shadow-warm-sm"
              >
                <PenLine size={16} />
              </Link>

              <Link
                to="/profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 border border-accent/30 text-sm font-bold text-accent hover:bg-accent hover:text-white transition-all duration-200"
                title={user.username}
              >
                {user.username.charAt(0).toUpperCase()}
              </Link>

              <button
                onClick={handleLogout}
                className="hidden sm:block text-sm text-muted hover:text-ink font-medium cursor-pointer transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-muted hover:text-ink transition-colors duration-200"
              >
                Sign in
              </Link>

              <Button asChild size="sm" className="font-semibold shadow-warm-sm">
                <Link to="/signup">Join</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
