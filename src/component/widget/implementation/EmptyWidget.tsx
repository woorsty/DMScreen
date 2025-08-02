import type { JSX } from "react";
import { Widget, type WidgetProps, type WidgetState } from "../Widget";
import { WidgetRegistry } from "../WidgetRegistry";

type EmptyWidgetProps = WidgetProps & {
  onReplaceWidget: (x: number, y: number, widget: JSX.Element) => void;
};
type EmptyWidgetState = WidgetState & { showMenu?: boolean };

export class EmptyWidget extends Widget<EmptyWidgetProps, EmptyWidgetState> {
  public constructor(props: EmptyWidgetProps) {
    super({
      height: props.height,
      width: props.height,
      id: props.id,
      x: props.x,
      y: props.y,
      onReplaceWidget: props.onReplaceWidget,
      removable: false,
    });
    this.state = { ...props, showMenu: false };
  }

  handleButtonClick = () => {
    this.setState({ showMenu: true });
  };

  handleSelectWidget = (widgetType: string) => {
    const entry = WidgetRegistry.find((w) => w.type === widgetType);
    if (entry && this.props.onReplaceWidget) {
      const WidgetComponent = entry.component;
      this.props.onReplaceWidget(
        this.props.x,
        this.props.y,
        <WidgetComponent
          id={this.props.id}
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          onReplaceWidget={this.props.onReplaceWidget}
          removable={true}
        />
      );
    }
  };

  renderContent = () => {
    if (this.state.showMenu) {
      return (
        <div className="bg-gray-800 p-2 rounded shadow flex flex-col gap-2">
          {WidgetRegistry.map((w) => (
            <button
              key={w.type}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
              onClick={() => this.handleSelectWidget(w.type)}
            >
              {w.name}
            </button>
          ))}
          <button
            className="text-gray-400 hover:text-gray-200 mt-2"
            onClick={() => this.setState({ showMenu: false })}
          >
            Abbrechen
          </button>
        </div>
      );
    }
    return (
      <button
        onClick={this.handleButtonClick}
        className="w-full h-full bg-gray-700 hover:bg-gray-600 rounded text-2xl"
        title="Widget hinzufügen"
      >
        +
      </button>
    );
  };
}
