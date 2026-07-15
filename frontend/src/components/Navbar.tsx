import { Link, useNavigate } from "react-router-dom";
import { Moon, PenLine, Sun } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-paper/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link
          to="/"
          className="font-serif text-2xl font-semibold tracking-tight"
        >
          Akhyan
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-ink"
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>

          {user ? (
            <>
              <Link
                to="/create"
                className="flex items-center gap-2 rounded-full btn-primary px-5 py-2.5 text-sm font-medium"
              >
                <PenLine size={16} />
                Write
              </Link>

              <Link
                to="/profile"
                className="text-sm text-muted hover:text-ink"
              >
                {user.username}
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-muted hover:text-ink"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-5 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:bg-surface hover:text-ink"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-full btn-primary px-5 py-2.5 text-sm font-medium"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}