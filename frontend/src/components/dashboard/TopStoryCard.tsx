import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, ArrowRight } from "lucide-react";
import { Card, Button } from "../ui";

interface Props {
  post: {
    id: string;
    title: string;
    views: number;
  } | null;
}

export default function TopStoryCard({ post }: Props) {
  if (!post) {
    return (
      <Card className="p-6 text-center text-muted text-sm border border-dashed border-border">
        No content metrics recorded yet.
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6 border border-border bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
        <div className="space-y-2 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Top Performing Story
          </span>
          <h4 className="text-xl font-semibold font-serif text-ink leading-snug line-clamp-1">
            {post.title}
          </h4>
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <Eye size={16} />
            <span>{post.views.toLocaleString()} views</span>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="self-start md:self-auto gap-2">
          <Link to={`/post/${post.id}`}>
            Read Story
            <ArrowRight size={14} />
          </Link>
        </Button>
      </Card>
    </motion.div>
  );
}
