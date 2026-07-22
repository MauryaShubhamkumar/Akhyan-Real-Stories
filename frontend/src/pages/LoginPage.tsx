import {
  useState,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpen } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui";

const quotes = [
  { text: "Every person has a story worth telling.", author: "Akhyan" },
  { text: "Vulnerability is the birthplace of connection.", author: "Brené Brown" },
  { text: "Your story matters, even when it feels small.", author: "Akhyan" },
];

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Unable to login");
      } else {
        setError("Unable to login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)]">
      {/* Left: Quote panel */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12"
        style={{
          background: "linear-gradient(160deg, var(--surface) 0%, var(--surface-alt) 100%)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-12"
            style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
          >
            <BookOpen size={13} /> Akhyan
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="text-5xl font-display"
            style={{ color: "var(--accent)", fontStyle: "italic" }}
          >
            "
          </div>
          <blockquote
            className="font-reading text-xl leading-relaxed text-ink"
            style={{ fontStyle: "italic", fontWeight: 300 }}
          >
            {randomQuote.text}
          </blockquote>
          <cite className="text-sm text-muted not-italic font-medium">
            — {randomQuote.author}
          </cite>
        </div>

        <p className="text-xs text-muted/60">
          &copy; {new Date().getFullYear()} Akhyan. Stories worth telling.
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <h1
            className="font-display text-4xl font-bold text-ink mb-2"
            style={{ letterSpacing: "-0.01em" }}
          >
            Welcome back.
          </h1>

          <p
            className="text-muted mb-10"
            style={{ fontFamily: "var(--font-reading)", fontWeight: 300 }}
          >
            Continue reading and sharing stories on Akhyan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-ink">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className="input-base"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="••••••••"
                className="input-base"
              />
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm font-medium text-red-600"
                style={{ background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.15)" }}
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={submitting}
              className="w-full font-semibold shadow-warm-md mt-2"
              size="lg"
            >
              Sign in →
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}