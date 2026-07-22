import { Link } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60" style={{ background: "var(--surface)" }}>
      {/* Top gradient accent line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: "linear-gradient(to right, transparent, var(--accent), transparent)",
          opacity: 0.4,
        }}
      />

      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <Link to="/" className="group inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/90 shadow-warm-sm transition-transform duration-200 group-hover:scale-105">
                <BookOpen size={16} className="text-white" />
              </div>
              <span
                className="font-display text-xl font-bold tracking-tight text-ink"
                style={{ fontStyle: "italic" }}
              >
                Akhyan
              </span>
            </Link>

            <p className="text-sm text-muted max-w-xs leading-relaxed font-reading">
              A space for sharing real stories, lived experiences, and honest
              perspectives — either openly or anonymously. Every story matters.
            </p>

            <div className="flex items-center gap-2 text-xs text-muted/70">
              <span>Made with</span>
              <Heart size={11} className="text-red-400 fill-red-400" />
              <span>for storytellers everywhere</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted/60 mb-5">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-muted hover:text-accent transition-colors duration-200 font-medium">
                  Stories Feed
                </Link>
              </li>
              <li>
                <Link to="/?category=love" className="text-muted hover:text-accent transition-colors duration-200">
                  Love Stories
                </Link>
              </li>
              <li>
                <Link to="/?category=struggle" className="text-muted hover:text-accent transition-colors duration-200">
                  Struggles
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-muted hover:text-accent transition-colors duration-200">
                  Write a Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted/60 mb-5">
              Community
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-muted/50 cursor-not-allowed">Guidelines</span>
              </li>
              <li>
                <span className="text-muted/50 cursor-not-allowed">Privacy Policy</span>
              </li>
              <li>
                <span className="text-muted/50 cursor-not-allowed">Terms of Service</span>
              </li>
              <li>
                <span className="text-muted/50 cursor-not-allowed">About</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs text-muted/60">
            &copy; {currentYear} Akhyan. All rights reserved.
          </p>
          <p className="text-xs text-muted/50 font-reading italic">
            "Every life is worth a story."
          </p>
        </div>
      </div>
    </footer>
  );
}
