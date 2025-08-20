import React, { type JSX } from "react";

export type WidgetProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  removable?: boolean;
  onReplaceWidget: (x: number, y: number, widget: JSX.Element) => void;
};

export type WidgetState = WidgetProps & {};

export abstract class Widget<
  PROPS extends WidgetProps,
  STATE extends WidgetState
> extends React.Component<PROPS, STATE> {
  protected abstract renderContent: () => JSX.Element;

  private handleRemove = async () => {
    const { x, y, onReplaceWidget } = this.props;
    const { EmptyWidget } = await import("./implementation/EmptyWidget");
    onReplaceWidget(
      x,
      y,
      <EmptyWidget
        key={`${x},${y}`}
        id={Date.now().toString() + x + y}
        x={x}
        y={y}
        width={1}
        height={1}
        onReplaceWidget={onReplaceWidget}
      />
    );
  };

  public render() {
    return (
      <div className="relative group bg-gray-800 p-2 rounded mx-auto h-full w-full">
        {this.props.removable && (
          <button
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-red-600 text-white rounded p-1 text-xs"
            title="Widget entfernen"
            onClick={this.handleRemove}
          >
            ✕
          </button>
        )}
        {this.renderContent()}
        {/* ...existing code... */}
      </div>
    );
  }
}
