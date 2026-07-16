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
  PenLine,
  Heart,
  MessageSquare,
} from "lucide-react";

import axios from "axios";

import EditProfileModal from "../components/profile/EditProfileModal";
import { Button, H1, H2 } from "../components/ui";
import { getProfile } from "../features/profile/api";
import { deletePost } from "../features/posts/api";
import { useDashboard } from "../features/dashboard/hooks";
import DashboardStatCard from "../components/dashboard/StatCard";
import CategoryChart from "../components/dashboard/CategoryChart";
import TopStoryCard from "../components/dashboard/TopStoryCard";

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

  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = useDashboard();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();

        setData(profileData);
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

    void fetchProfile();
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
      await deletePost(postId);

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

            <H1 className="mt-5">
              {profile.username}
            </H1>

            {profile.bio && (
              <p className="mt-3 max-w-xl leading-7 text-muted">
                {profile.bio}
              </p>
            )}
          </div>

          <Button
            onClick={() => setEditing(true)}
            variant="secondary"
            size="sm"
            leftIcon={<Pencil size={16} />}
          >
            Edit profile
          </Button>
        </section>

        <section className="mt-12 border-t border-border pt-8">
          <H2 className="text-xl">
            Credentials & Highlights
          </H2>

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

        <section className="mt-12 border-t border-border pt-8 space-y-8 animate-fade-in">
          <div>
            <H2>Creator Dashboard</H2>
          </div>

          {dashboardLoading ? (
            <div className="py-8 text-center text-muted text-sm">
              Loading analytics...
            </div>
          ) : dashboardError || !dashboard ? (
            <div className="py-8 text-center text-red-500 text-sm">
              Unable to load analytics data.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <DashboardStatCard
                  title="Stories"
                  value={dashboard.totalPosts}
                  icon={<PenLine size={18} />}
                />
                <DashboardStatCard
                  title="Reads"
                  value={dashboard.totalViews}
                  icon={<Eye size={18} />}
                />
                <DashboardStatCard
                  title="Likes"
                  value={dashboard.totalLikes}
                  icon={<Heart size={18} />}
                />
                <DashboardStatCard
                  title="Comments"
                  value={dashboard.totalComments}
                  icon={<MessageSquare size={18} />}
                />
              </div>

              {/* Category Chart */}
              <div className="space-y-4">
                <H2 className="text-lg">Category Distribution</H2>
                <CategoryChart
                  data={Object.entries(dashboard.categories).map(([name, value]) => ({
                    name: categoryLabels[name as Category] ?? name,
                    value,
                  }))}
                />
              </div>

              {/* Top Story Card */}
              <div className="space-y-4">
                <H2 className="text-lg">Top Story Highlight</H2>
                <TopStoryCard post={dashboard.mostViewedPost} />
              </div>
            </div>
          )}
        </section>

        <section className="mt-14 border-t border-border pt-8">
          <H2>
            Your stories
          </H2>

          {posts.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-muted">
                You haven't written a story yet.
              </p>

              <Button asChild className="mt-5">
                <Link to="/create">
                  Write your first story
                </Link>
              </Button>
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
