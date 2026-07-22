import { Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  body: string;
}

export default function StoryPreview({ id, title, body }: Props) {
  return (
    <Link to={`/post/${id}`} className="group block space-y-3">
      <h2
        className="font-display text-[1.45rem] font-bold leading-snug text-ink group-hover:text-accent transition-colors duration-200"
        style={{ letterSpacing: "-0.01em" }}
      >
        {title}
      </h2>

      <p
        className="line-clamp-3 text-[15.5px] leading-7 text-muted"
        style={{ fontFamily: "var(--font-reading)" }}
      >
        {body}
      </p>
    </Link>
  );
}
