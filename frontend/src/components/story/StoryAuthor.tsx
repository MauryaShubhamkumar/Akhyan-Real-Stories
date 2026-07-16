import Avatar from "../ui/Avatar";

interface Props {
  username?: string;
  anonymous: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StoryAuthor({
  username,
  anonymous,
  size = "md",
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        username={
          anonymous
            ? "Anonymous"
            : username ?? ""
        }
        size={size}
      />

      <div>
        <p className="text-sm font-medium text-ink">
          {anonymous
            ? "Anonymous"
            : username}
        </p>
      </div>
    </div>
  );
}
