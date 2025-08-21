import { EmptyWidget } from "./implementation/EmptyWidget";
import { InitiativeWidget } from "./implementation/InitiativeWidget";
import { WidgetType } from "./WidgetType";

export const WidgetRegistry = [
  {
    type: WidgetType.Empty,
    name: "Leer",
    component: () => EmptyWidget,
  },
  {
    type: WidgetType.Initiative,
    name: "Initiative",
    component: () => InitiativeWidget,
  },
];
