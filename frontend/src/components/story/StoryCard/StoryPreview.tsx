import { Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  body: string;
}

export default function StoryPreview({ id, title, body }: Props) {
  return (
    <Link to={`/post/${id}`} className="group block space-y-2">
      <h2 className="font-serif text-2xl font-semibold leading-snug group-hover:underline text-ink">
        {title}
      </h2>

      <p className="line-clamp-3 font-serif text-[17px] leading-7 text-muted">
        {body}
      </p>
    </Link>
  );
}
