export const WidgetType = {
  Initiative: "initiative",
  Empty: "empty",
} as const;

export type WidgetType = (typeof WidgetType)[keyof typeof WidgetType];
