import React, { type JSX } from "react";
import { WidgetType } from "./WidgetType";

export type WidgetProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  removable?: boolean;
  onReplaceWidget: (x: number, y: number, widget: WidgetType) => void;
  isEditMode: boolean;
};

export type WidgetState = WidgetProps & {};

export abstract class Widget<
  PROPS extends WidgetProps,
  STATE extends WidgetState
> extends React.Component<PROPS, STATE> {
  protected abstract renderContent: () => JSX.Element;

  private handleRemove = async () => {
    const { x, y, onReplaceWidget } = this.props;
    onReplaceWidget(x, y, WidgetType.Empty);
  };

  public render() {
    return (
      <div className="relative group bg-gray-800 p-2 rounded mx-auto h-full w-full">
        {this.props.removable && this.props.isEditMode && (
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
