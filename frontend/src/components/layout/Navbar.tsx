import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Moon, PenLine, Sun, Search } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-paper/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        {!mobileSearchOpen && (
          <Link
            to="/"
            className="font-serif text-2xl font-semibold tracking-tight animate-fade-in text-ink shrink-0"
          >
            Akhyan
          </Link>
        )}

        {mobileSearchOpen && (
          <div className="relative flex-1 mr-4 max-w-md animate-fade-in">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full h-9 rounded-full border border-border bg-surface pl-10 pr-16 text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-accent hover:underline"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Desktop Search */}
          <div className="relative hidden md:block w-48 lg:w-60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories..."
              className="w-full h-9 rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Mobile Search Trigger */}
          {!mobileSearchOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden h-9 w-9 p-0 rounded-full text-muted hover:text-ink"
            >
              <Search size={18} />
            </Button>
          )}

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted hover:text-ink"
          >
            <Link to="/">
              Home
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            className="h-9 w-9 p-0 rounded-full text-muted hover:text-ink"
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </Button>

          {user ? (
            <>
              <Button
                asChild
                leftIcon={<PenLine size={16} />}
              >
                <Link to="/create">
                  Write
                </Link>
              </Button>

              <Link
                to="/profile"
                className="text-sm text-muted hover:text-ink font-medium transition-colors"
              >
                {user.username}
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-muted hover:text-ink font-medium cursor-pointer transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="text-muted hover:text-ink"
              >
                <Link to="/login">
                  Login
                </Link>
              </Button>

              <Button asChild>
                <Link to="/signup">
                  Join
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
