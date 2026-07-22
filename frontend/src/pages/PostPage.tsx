import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  Flag,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  ArrowUp,
  Clock,
  BookOpen,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ShareMenu from "../components/shared/ShareMenu";
import {
  getPost,
  getPostReaction,
  reactToPost,
  reportContent,
} from "../features/posts/api";
import { getComments, createComment } from "../features/comments/api";
import StoryCategoryBadge from "../components/story/StoryCategoryBadge";

import type { Comment, Post } from "../types";

type Reaction = "like" | "dislike" | null;

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const articleRef = useRef<HTMLElement>(null);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(100, progress));
      setShowBackToTop(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadPage = async () => {
      setLoading(true);
      setError("");

      try {
        const requests = [getPost(id), getComments(id)];
        const [postData, commentsData] = await Promise.all(requests);

        setPost(postData.post);
        setComments(commentsData.comments);

        if (user) {
          const reactionData = await getPostReaction(id);
          setReaction(reactionData.reaction);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message ?? "Unable to load story");
        } else {
          setError("Unable to load story");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadPage();
  }, [id, user]);

  const handleReaction = async (
    selectedReaction: Exclude<Reaction, null>
  ) => {
    if (!user) { navigate("/login"); return; }
    if (!post || !id) return;

    const nextReaction = reaction === selectedReaction ? null : selectedReaction;

    try {
      const data = await reactToPost(id, nextReaction ?? "none");
      setReaction(nextReaction);
      setPost({ ...post, counts: data.counts });
    } catch {
      setError("Unable to update reaction");
    }
  };

  const handleComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) { navigate("/login"); return; }
    if (!id || !commentBody.trim()) return;

    setSubmittingComment(true);

    try {
      const data = await createComment(id, commentBody);
      setComments((current) => [data.comment, ...current]);
      setCommentBody("");
    } catch {
      setError("Unable to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReport = async () => {
    if (!user) { navigate("/login"); return; }
    if (!id) return;

    const reason = window.prompt("Why are you reporting this story?");
    if (!reason) return;

    try {
      await reportContent({ targetType: "post", targetId: id, reason });
      window.alert("Report submitted. Thank you.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        window.alert(error.response?.data?.message ?? "Unable to submit report");
      }
    }
  };

  const handleCommentReport = async (commentId: string) => {
    if (!user) { navigate("/login"); return; }

    const reason = window.prompt("Why are you reporting this comment?");
    if (!reason) return;

    try {
      await reportContent({ targetType: "comment", targetId: commentId, reason });
      window.alert("Report submitted.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        window.alert(error.response?.data?.message ?? "Unable to submit report");
      }
    }
  };

  if (loading) {
    return (
      <>
        {/* Reading progress placeholder */}
        <div className="reading-progress-bar" style={{ width: "0%" }} />
        <main className="mx-auto max-w-3xl px-5 py-20 text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-accent animate-float"
            style={{ background: "var(--surface)" }}
          >
            <BookOpen size={28} />
          </div>
          <p
            className="font-display text-xl text-muted"
            style={{ fontStyle: "italic" }}
          >
            Loading story...
          </p>
        </main>
      </>
    );
  }

  if (error && !post) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </main>
    );
  }

  if (!post) return null;

  const authorName = post.isAnonymous
    ? "Anonymous"
    : post.author?.username ?? "Unknown";

  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className="reading-progress-bar"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Back to Top FAB */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fab-back-to-top animate-fade-in"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <main className="mx-auto max-w-2xl px-5 py-12 md:py-16">
        <article ref={articleRef}>
          {/* Category */}
          <div className="mb-6 animate-fade-up">
            <StoryCategoryBadge category={post.category} />
          </div>

          {/* Title */}
          <h1
            className="font-display text-4xl md:text-5xl lg:text-[3.2rem] font-bold leading-[1.1] text-ink animate-fade-up delay-75"
            style={{ letterSpacing: "-0.02em" }}
          >
            {post.title}
          </h1>

          {/* Author card */}
          <div
            className="mt-8 mb-10 flex items-center justify-between flex-wrap gap-4 animate-fade-up delay-150"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white shadow-warm-sm"
                style={{
                  background: post.isAnonymous
                    ? "linear-gradient(135deg, #6b7280, #4b5563)"
                    : "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              >
                {authorInitial}
              </div>

              <div>
                <p className="font-semibold text-ink">{authorName}</p>
                <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                  <Clock size={11} />
                  {post.readingTime} min read
                  <span>·</span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShareMenu title={post.title} />
              <button
                onClick={handleReport}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-red-500 transition-colors duration-200"
              >
                <Flag size={14} />
                Report
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="divider-warm mb-10" />

          {/* Body */}
          <div
            className="prose-reading prose-drop-cap animate-fade-up delay-225"
            style={{ whiteSpace: "pre-wrap" }}
          >
            <p>{post.body}</p>
          </div>

          {/* Reaction bar */}
          <div
            className="mt-14 flex flex-wrap items-center gap-3 rounded-2xl p-5 animate-fade-up"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <span className="text-sm font-medium text-muted mr-2">
              How did this story make you feel?
            </span>

            <button
              onClick={() => handleReaction("like")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                reaction === "like"
                  ? "btn-primary"
                  : "border border-border bg-paper text-muted hover:border-green-400 hover:text-green-600"
              }`}
            >
              <ThumbsUp size={16} />
              {post.counts.likes}
            </button>

            <button
              onClick={() => handleReaction("dislike")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                reaction === "dislike"
                  ? "bg-red-600 text-white shadow-sm"
                  : "border border-border bg-paper text-muted hover:border-red-400 hover:text-red-500"
              }`}
            >
              <ThumbsDown size={16} />
              {post.counts.dislikes}
            </button>
          </div>
        </article>

        {/* Comments */}
        <section className="mt-14">
          <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-ink mb-8">
            <MessageCircle size={22} className="text-accent" />
            Comments
            {comments.length > 0 && (
              <span
                className="ml-1 rounded-full px-3 py-0.5 text-sm font-semibold"
                style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
              >
                {comments.length}
              </span>
            )}
          </h2>

          {/* Comment form */}
          <form onSubmit={handleComment} className="mb-10">
            <textarea
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              placeholder={
                user ? "Share your thoughts on this story..." : "Sign in to leave a comment"
              }
              disabled={!user}
              maxLength={2000}
              rows={4}
              className="w-full resize-none rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-paper disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-reading)" }}
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted/60">
                {commentBody.length > 0 && `${commentBody.length}/2000`}
              </span>
              <button
                type="submit"
                disabled={submittingComment || !user || !commentBody.trim()}
                className="btn-primary rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingComment ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>

          {/* Comments list */}
          <div className="space-y-0">
            {comments.length === 0 ? (
              <div
                className="rounded-2xl p-10 text-center"
                style={{ background: "var(--surface)" }}
              >
                <p className="text-muted font-reading italic">
                  No comments yet. Be the first to share your thoughts.
                </p>
              </div>
            ) : (
              comments.map((comment, i) => (
                <div
                  key={comment.id}
                  className="py-6 border-b border-border/50 last:border-b-0 animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                        }}
                      >
                        {comment.author.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {comment.author.username}
                        </p>
                        <p className="text-xs text-muted">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCommentReport(comment.id)}
                      aria-label="Report comment"
                      className="shrink-0 text-muted/50 hover:text-red-500 transition-colors duration-200"
                    >
                      <Flag size={13} />
                    </button>
                  </div>

                  <p
                    className="mt-3 ml-10 text-sm leading-7 text-ink/90"
                    style={{ fontFamily: "var(--font-reading)" }}
                  >
                    {comment.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}