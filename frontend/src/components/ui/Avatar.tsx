interface Props {
  username: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export default function Avatar({
  username,
  size = "md",
}: Props) {
  const letter =
    username.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-accent font-semibold text-white select-none`}
    >
      {letter}
    </div>
  );
}
