import Avatar from "../ui/Avatar";

interface Props {
  username?: string;
  anonymous: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { avatar: "sm" as const, text: "text-sm" },
  md: { avatar: "md" as const, text: "text-sm" },
  lg: { avatar: "lg" as const, text: "text-base" },
};

export default function StoryAuthor({
  username,
  anonymous,
  size = "md",
}: Props) {
  const { text } = sizeMap[size];
  const displayName = anonymous ? "Anonymous" : username;

  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        username={anonymous ? "Anonymous" : username ?? ""}
        size={size}
      />

      <span className={`${text} font-semibold text-ink`}>
        {displayName}
      </span>
    </div>
  );
}
