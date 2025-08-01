import React from "react";

export type WidgetProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WidgetState = WidgetProps & {};

export abstract class Widget<
  PROPS extends WidgetProps,
  STATE extends WidgetState
> extends React.Component<PROPS, STATE> {}
