import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  BriefcaseBusiness,
  CalendarDays,
  Eye,
  GraduationCap,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

import axios from "axios";

import { api } from "../api/client";

import EditProfileModal from "../components/EditProfileModal";

import {
  categoryLabels,
} from "../constants/categories";

import type {
  Category,
  ProfileResponse,
} from "../types";

export default function ProfilePage() {
  const [data, setData] =
    useState<ProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/profile");

        setData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ??
              "Unable to load profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    void getProfile();
  }, []);

  const handleDelete = async (
    postId: string
  ) => {
    const confirmed = window.confirm(
      "Delete this story permanently?"
    );

    if (!confirmed || !data) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);

      setData({
        ...data,

        posts: data.posts.filter(
          (post) => post.id !== postId
        ),

        stats: {
          ...data.stats,

          totalPosts:
            data.stats.totalPosts - 1,

          categories: {
            ...data.stats.categories,

            [data.posts.find(
              (post) => post.id === postId
            )!.category]:
              data.stats.categories[
                data.posts.find(
                  (post) => post.id === postId
                )!.category
              ] - 1,
          },
        },
      });
    } catch {
      window.alert("Unable to delete story");
    }
  };

  if (loading) {
    return (
      <main className="py-20 text-center text-muted">
        Loading profile...
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="py-20 text-center text-red-500">
        {error || "Profile not found"}
      </main>
    );
  }

  const { profile, stats, posts } = data;

  return (
    <>
      <main className="mx-auto max-w-4xl px-5 py-12">
        <section className="flex items-start justify-between gap-6">
          <div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-white">
              {profile.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <h1 className="mt-5 font-serif text-4xl font-semibold">
              {profile.username}
            </h1>

            {profile.bio && (
              <p className="mt-3 max-w-xl leading-7 text-muted">
                {profile.bio}
              </p>
            )}
          </div>

          <button
            onClick={() => setEditing(true)}
            className="btn-secondary flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          >
            <Pencil size={16} />
            Edit profile
          </button>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-xl font-semibold">
            Credentials & Highlights
          </h2>

          <div className="mt-6 space-y-4">
            {profile.employment && (
              <Highlight
                icon={<BriefcaseBusiness size={19} />}
                text={profile.employment}
              />
            )}

            {profile.education && (
              <Highlight
                icon={<GraduationCap size={19} />}
                text={profile.education}
              />
            )}

            {profile.location && (
              <Highlight
                icon={<MapPin size={19} />}
                text={profile.location}
              />
            )}

            <Highlight
              icon={<Eye size={19} />}
              text={`${stats.totalViews.toLocaleString()} content views`}
            />

            <Highlight
              icon={<CalendarDays size={19} />}
              text={`Joined ${new Date(
                profile.joinedAt
              ).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}`}
            />
          </div>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-2xl font-semibold">
            Story Dashboard
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            <StatCard
              label="Total Stories"
              value={stats.totalPosts}
            />

            <StatCard
              label="Content Views"
              value={stats.totalViews}
            />

            {(
              Object.keys(
                stats.categories
              ) as Category[]
            ).map((category) => (
              <StatCard
                key={category}
                label={categoryLabels[category]}
                value={
                  stats.categories[category]
                }
              />
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-border pt-8">
          <h2 className="font-serif text-2xl font-semibold">
            Your stories
          </h2>

          {posts.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-muted">
                You haven't written a story yet.
              </p>

              <Link
                to="/create"
                className="btn-primary mt-5 inline-block rounded-full px-6 py-3 text-sm font-medium"
              >
                Write your first story
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="border-b border-border py-7"
              >
                <div className="flex gap-2 text-xs text-muted">
                  <span>
                    {
                      categoryLabels[
                        post.category
                      ]
                    }
                  </span>

                  {post.isAnonymous && (
                    <span>· Anonymous</span>
                  )}
                </div>

                <Link to={`/post/${post.id}`}>
                  <h3 className="mt-3 font-serif text-2xl font-semibold hover:underline">
                    {post.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 font-serif leading-7 text-muted">
                    {post.body}
                  </p>
                </Link>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-muted">
                    {post.counts.likes} likes ·{" "}
                    {post.counts.dislikes} dislikes
                  </span>

                  <button
                    onClick={() =>
                      handleDelete(post.id)
                    }
                    className="flex items-center gap-2 text-sm text-muted hover:text-red-500"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onUpdated={(updatedProfile) =>
            setData({
              ...data,
              profile: updatedProfile,
            })
          }
        />
      )}
    </>
  );
}

interface HighlightProps {
  icon: React.ReactNode;
  text: string;
}

function Highlight({
  icon,
  text,
}: HighlightProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted">
        {icon}
      </span>

      <p className="leading-6">
        {text}
      </p>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-2xl font-semibold">
        {value.toLocaleString()}
      </p>

      <p className="mt-2 text-sm text-muted">
        {label}
      </p>
    </div>
  );
}