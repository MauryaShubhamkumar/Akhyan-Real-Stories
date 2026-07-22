import {
  useState,
  type FormEvent,
} from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpen, PenLine, UserCheck, Heart } from "lucide-react";
import type { ComponentType } from "react";

import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui";

const features: Array<{ icon: ComponentType<{ size?: number; className?: string }>; text: string }> = [
  { icon: BookOpen, text: "Read real stories from real people" },
  { icon: PenLine, text: "Share your own experiences freely" },
  { icon: UserCheck, text: "Post anonymously when you need to" },
  { icon: Heart, text: "Connect through human experiences" },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signup(username, email, password);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Unable to create account");
      } else {
        setError("Unable to create account");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)]">
      {/* Left: Feature panel */}
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

        <div className="space-y-8">
          <div>
            <h2
              className="font-display text-3xl font-bold text-ink mb-3"
              style={{ fontStyle: "italic" }}
            >
              Join thousands of storytellers.
            </h2>
            <p
              className="text-muted text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-reading)", fontWeight: 300 }}
            >
              Akhyan is where real people share the moments that shaped them.
              No filters, no performance — just honest stories.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.text} className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-accent"
                    style={{ background: "var(--accent-muted)" }}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="text-sm text-ink font-medium">{f.text}</span>
                </li>
              );
            })}
          </ul>
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
            Join Akhyan.
          </h1>

          <p
            className="text-muted mb-10"
            style={{ fontFamily: "var(--font-reading)", fontWeight: 300 }}
          >
            Stories worth telling. A place to share yours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-semibold text-ink">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                minLength={3}
                maxLength={30}
                placeholder="yourusername"
                className="input-base"
              />
            </div>

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
                minLength={8}
                maxLength={72}
                placeholder="At least 8 characters"
                className="input-base"
              />
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm font-medium text-red-600"
                style={{
                  background: "rgba(220, 38, 38, 0.08)",
                  border: "1px solid rgba(220, 38, 38, 0.15)",
                }}
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
              Create account →
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}