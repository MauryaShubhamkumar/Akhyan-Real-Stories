import {
  useEffect,
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
} from "lucide-react";

import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

import { categoryLabels } from "../constants/categories";
import ShareMenu from "../components/ShareMenu";

import type {
  Comment,
  Post,
} from "../types";

type Reaction = "like" | "dislike" | null;

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const [reaction, setReaction] =
    useState<Reaction>(null);

  const [commentBody, setCommentBody] = useState("");

  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadPage = async () => {
      setLoading(true);
      setError("");

      try {
        const requests = [
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ];

        const [postResponse, commentsResponse] =
          await Promise.all(requests);

        setPost(postResponse.data.post);
        setComments(commentsResponse.data.comments);

        if (user) {
          const reactionResponse = await api.get(
            `/posts/${id}/reaction`
          );

          setReaction(
            reactionResponse.data.reaction
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ??
              "Unable to load story"
          );
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
    if (!user) {
      navigate("/login");
      return;
    }

    if (!post || !id) {
      return;
    }

    const nextReaction =
      reaction === selectedReaction
        ? null
        : selectedReaction;

    try {
      const response = await api.post(
        `/posts/${id}/react`,
        {
          type: nextReaction ?? "none",
        }
      );

      setReaction(nextReaction);

      setPost({
        ...post,
        counts: response.data.counts,
      });
    } catch {
      setError("Unable to update reaction");
    }
  };

  const handleComment = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!id || !commentBody.trim()) {
      return;
    }

    setSubmittingComment(true);

    try {
      const response = await api.post(
        `/posts/${id}/comments`,
        {
          body: commentBody,
        }
      );

      setComments((current) => [
        response.data.comment,
        ...current,
      ]);

      setCommentBody("");
    } catch {
      setError("Unable to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };


  const handleReport = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!id) {
      return;
    }

    const reason = window.prompt(
      "Why are you reporting this story?"
    );

    if (!reason) {
      return;
    }

    try {
      await api.post("/reports", {
        targetType: "post",
        targetId: id,
        reason,
      });

      window.alert("Report submitted");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        window.alert(
          error.response?.data?.message ??
            "Unable to submit report"
        );
      }
    }
  };

  const handleCommentReport = async (
    commentId: string
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const reason = window.prompt(
      "Why are you reporting this comment?"
    );

    if (!reason) {
      return;
    }

    try {
      await api.post("/reports", {
        targetType: "comment",
        targetId: commentId,
        reason,
      });

      window.alert("Report submitted");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        window.alert(
          error.response?.data?.message ??
            "Unable to submit report"
        );
      }
    }
  };


  if (loading) {
    return (
      <main className="py-20 text-center text-muted">
        Loading story...
      </main>
    );
  }

  if (error && !post) {
    return (
      <main className="py-20 text-center text-red-600">
        {error}
      </main>
    );
  }

  if (!post) {
    return null;
  }

  const authorName = post.isAnonymous
    ? "Anonymous"
    : post.author?.username ?? "Unknown";

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <article>
        <span className="text-sm font-medium text-accent">
          {categoryLabels[post.category]}
        </span>

        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-5xl">
          {post.title}
        </h1>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border text-sm font-medium text-muted">
            {post.isAnonymous
              ? "A"
              : authorName.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-medium">
              {authorName}
            </p>

            <p className="text-xs text-muted">
              {new Date(
                post.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-10 whitespace-pre-wrap font-serif text-[18px] leading-[1.9] text-ink">
          {post.body}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3 border-y border-border py-5">
          <button
            onClick={() => handleReaction("like")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
              reaction === "like"
                ? "btn-primary"
                : "btn-secondary"
            }`}
          >
            <ThumbsUp size={17} />
            {post.counts.likes}
          </button>

          <button
            onClick={() =>
              handleReaction("dislike")
            }
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
              reaction === "dislike"
                ? "btn-primary"
                : "btn-secondary"
            }`}
          >
            <ThumbsDown size={17} />
            {post.counts.dislikes}
          </button>

          <ShareMenu title={post.title} />

          <button
            onClick={handleReport}
            className="flex items-center gap-2 text-sm text-muted hover:text-red-600"
          >
            <Flag size={17} />
            Report
          </button>
        </div>
      </article>

      <section className="py-10">
        <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold">
          <MessageCircle size={22} />
          Comments
        </h2>

        <form
          onSubmit={handleComment}
          className="mt-6"
        >
          <textarea
            value={commentBody}
            onChange={(event) =>
              setCommentBody(event.target.value)
            }
            placeholder={
              user
                ? "Write a thoughtful comment..."
                : "Sign in to comment"
            }
            maxLength={2000}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-surface p-4 outline-none focus:border-accent"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={submittingComment}
              className="rounded-full btn-primary px-6 py-2.5 text-sm font-medium"
            >
              {submittingComment
                ? "Posting..."
                : "Comment"}
            </button>
          </div>
        </form>

        <div className="mt-8">
          {comments.length === 0 ? (
            <p className="text-muted">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-border py-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {comment.author.username}
                  </p>

                  <button
                    onClick={() =>
                      handleCommentReport(comment.id)
                    }
                    aria-label="Report comment"
                    className="text-muted hover:text-red-600"
                  >
                    <Flag size={15} />
                  </button>
                </div>

                <p className="mt-2 leading-7">
                  {comment.body}
                </p>

                <p className="mt-2 text-xs text-muted">
                  {new Date(
                    comment.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}