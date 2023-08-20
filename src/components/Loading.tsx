import { get_random_item } from "utils";

const animations = ["spinner", "dots", "ring", "ball", "bars", "infinity"];

const colors = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
];

export const Loading = ({
  size = "lg",
  animation,
  color,
}: {
  size?: "xs" | "sm" | "md" | "lg";
  animation?: (typeof animations)[number];
  color?: (typeof colors)[number];
}) => {
  return (
    <span
      className={`
      loading
      loading-${size}
      loading-${animation ?? get_random_item(animations)}
      loading-${color ?? get_random_item(colors)}
    `}
    />
  );
};
