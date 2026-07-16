import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/30 mt-auto">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Link
              to="/"
              className="font-serif text-xl font-bold tracking-tight text-ink"
            >
              Akhyan
            </Link>
            <p className="text-sm text-muted max-w-xs leading-relaxed">
              A space for sharing real stories, lived experiences, and honest perspectives—either openly or anonymously.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/70 mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted hover:text-ink transition-colors">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-muted hover:text-ink transition-colors">
                  Write a Story
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/70 mb-4">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted/60">Guidelines</span>
              </li>
              <li>
                <span className="text-muted/60">Privacy Policy</span>
              </li>
              <li>
                <span className="text-muted/60">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {currentYear} Akhyan. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <span>Built with care by Deepmind.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
