export const Direction = {
  Top: "top",
  Bottom: "bottom",
  Left: "left",
  Right: "right",
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];
