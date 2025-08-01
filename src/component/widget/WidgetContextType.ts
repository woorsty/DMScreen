import type { Widget } from "./Widget";

export interface WidgetContextType {
  widgets: Widget[];
  addWidget: (widget: Widget) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, x: number, y: number) => void;
}
