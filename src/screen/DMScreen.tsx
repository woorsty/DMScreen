import React, { Component } from "react";
import { DMScreenMenu } from "./menu/DMScreenMenu";
import Gridlayout from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import { WidgetType } from "../component/widget/WidgetType";
import { WidgetRegistry } from "../component/widget/WidgetRegistry";
import "./DMScreen.css";
import { Direction } from "../model/Direction";
import { EmptyWidget } from "../component/widget/implementation/EmptyWidget";

interface WidgetData {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: WidgetType;
}

interface DMScreenProps {
  columns: number;
  rows: number;
}

interface DMScreenState {
  columns: number;
  rows: number;
  widgets: WidgetData[];
  layout: any[];
  menuOpen: boolean;
  isEditMode: boolean;
  containerHeight: number;
  containerWidth: number;
}

export class DMScreen extends Component<DMScreenProps, DMScreenState> {
  gridContainerRef = React.createRef<HTMLDivElement>();

  public constructor(props: DMScreenProps) {
    super(props);

    this.state = {
      columns: props.columns,
      rows: props.rows,
      widgets: [],
      menuOpen: false,
      isEditMode: false,
      containerHeight: 0,
      containerWidth: 0,
      layout: [],
    };
  }

  componentDidMount() {
    const { widgets, layout } = this.fillWithEmptyWidgets(
      this.props.columns,
      this.props.rows
    );

    this.setState({
      widgets,
      layout,
    });

    this.updateContainerSize();

    window.addEventListener("resize", this.updateContainerSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateContainerSize);
  }

  componentDidUpdate(_prevProps: DMScreenProps, _prevState: DMScreenState) {
    this.updateContainerSize();
  }

  fillWithEmptyWidgets(columns: number, rows: number) {
    const widgets: WidgetData[] = [];
    const layout: any[] = [];
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const key = uuidv4();
        const existingWidget = this.state?.widgets && this.getWidget(x, y);

        if (existingWidget) {
          widgets.push(existingWidget);
        } else {
          widgets.push({
            key,
            x: x,
            y: y,
            width: 1,
            height: 1,
            type: WidgetType.Empty,
          });
        }
        layout.push({
          i: key,
          x: x,
          y: y,
          w: 1,
          h: 1,
        });
      }
    }
    return { widgets, layout };
  }

  onReplaceWidget = (x: number, y: number, widget: WidgetType) => {
    this.setState((prevState) => {
      const currentWidgets = prevState.widgets;
      const currentWidget = this.getWidgetFromList(x, y, currentWidgets);

      if (currentWidget) {
        currentWidget.type = widget;
      }

      return { widgets: currentWidgets };
    });
  };

  getWidgetFromList(
    x: number,
    y: number,
    widgets: WidgetData[]
  ): WidgetData | undefined {
    return widgets.find((widget) => widget.x === x && widget.y === y);
  }

  getWidget(x: number, y: number) {
    return this.getWidgetFromList(x, y, this.state.widgets);
  }

  toggleEditMode = () => {
    this.setState((prevState) => ({
      isEditMode: !prevState.isEditMode,
    }));
  };

  handleGridChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const columns = parseInt(
      (form.elements.namedItem("columns") as HTMLInputElement).value,
      10
    );
    const rows = parseInt(
      (form.elements.namedItem("rows") as HTMLInputElement).value,
      10
    );

    if (
      !isNaN(columns) &&
      !isNaN(rows) &&
      columns > 0 &&
      rows > 0 &&
      (columns !== this.state.columns || rows !== this.state.rows)
    ) {
      const { widgets, layout } = this.fillWithEmptyWidgets(columns, rows);
      this.setState({
        columns,
        rows,
        widgets,
        layout,
      });
    }
  };

  updateContainerSize = () => {
    const container = this.gridContainerRef.current;
    if (container) {
      if (
        this.state.containerHeight !== container.clientHeight ||
        this.state.containerWidth !== container.clientWidth
      ) {
        this.setState({
          containerHeight: container.clientHeight,
          containerWidth: container.clientWidth,
        });
      }
    }
  };

  getRowHeight() {
    if (!this.state.containerHeight) return 100;
    return this.state.containerHeight / this.state.rows;
  }

  getColumnWidth() {
    if (!this.state.containerWidth) return 100;
    return this.state.containerWidth / this.state.columns;
  }

  onLayoutChange = (newLayout: any[]) => {
    let widgets = [...this.state.widgets];

    newLayout.forEach((layoutItem) => {
      const widget = widgets.find((w) => w.key === layoutItem.i);
      if (widget) {
        widget.x = layoutItem.x;
        widget.y = layoutItem.y;
        widget.width = layoutItem.w;
        widget.height = layoutItem.h;
      }
    });

    this.setState({ widgets });
  };

  getLayoutFromWidgets(widgets: WidgetData[]) {
    return widgets.map((w) => ({
      i: w.key,
      x: w.x,
      y: w.y,
      w: w.width,
      h: w.height,
    }));
  }

  handleWidgetBorderClick = (
    e: React.MouseEvent<HTMLDivElement>,
    widget: WidgetData,
    direction: Direction
  ) => {
    e.stopPropagation();
    console.log("widget rand geklickt: ", direction, widget);
    const otherCoordinates: { x: number; y: number } = {
      x: widget.x,
      y: widget.y,
    };
    let newHeight = widget.height;
    let newWidth = widget.width;
    switch (direction) {
      case Direction.Top:
        otherCoordinates.y -= 1;
        newHeight += 1;
        break;
      case Direction.Bottom:
        otherCoordinates.y += 1;
        newHeight += 1;
        break;
      case Direction.Left:
        otherCoordinates.x -= 1;
        newWidth += 1;
        break;
      case Direction.Right:
        otherCoordinates.x += 1;
        newWidth += 1;
        break;
    }

    const otherWidget = this.getWidget(otherCoordinates.x, otherCoordinates.y);
    if (otherWidget) {
      const newWidgets = this.state.widgets.flatMap((w) => {
        if (w.key === widget.key) {
          w.height = newHeight;
          w.width = newWidth;
        }
        if (w.key !== otherWidget.key) {
          return w;
        }
        return [];
      });
      if (newWidgets) {
        this.setState({ widgets: newWidgets });
      }
    }
  };

  renderGrid(): React.ReactNode {
    const layout = this.getLayoutFromWidgets(this.state.widgets);

    return (
      <Gridlayout
        className="layout"
        cols={this.state.columns}
        rowHeight={this.getRowHeight()}
        width={this.state.containerWidth}
        isDraggable={this.state.isEditMode}
        isResizable={false}
        style={{ height: "100%" }}
        margin={[0, 0]}
        draggableHandle=".drag-handle"
        containerPadding={[0, 0]}
        layout={layout}
        onLayoutChange={this.onLayoutChange}
        preventCollision={true}
        compactType={null}
      >
        {this.state.widgets.map((widget) => {
          const entry = WidgetRegistry.find((w) => w.type === widget.type);
          if (!entry) return null;
          const WidgetComponent = entry.component();

          return (
            <div
              key={widget.key}
              className={"border h-full w-full border-gray-700 bg-gray-700"}
              style={{ margin: 0, padding: 0 }}
            >
              <div
                className="drag-handle absolute top-0 left-0 w-full h-4 cursor-grab bg-transparent"
                style={{ zIndex: 1 }}
              />
              {this.state.isEditMode && (
                <>
                  {/* Handle für den oberen Rand */}
                  <div
                    className="absolute top-0 left-0 w-full h-1 bg-transparent border-active-edit-mode"
                    style={{ zIndex: 1 }}
                    onClick={(e) =>
                      this.handleWidgetBorderClick(e, widget, Direction.Top)
                    }
                  />
                  {/* Handle für den unteren Rand */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-1 bg-transparent border-active-edit-mode"
                    style={{ zIndex: 1 }}
                    onClick={(e) =>
                      this.handleWidgetBorderClick(e, widget, Direction.Bottom)
                    }
                  />
                  {/* Handle für den linken Rand */}
                  <div
                    className="absolute top-0 left-0 h-full w-1 bg-transparent border-active-edit-mode"
                    style={{ zIndex: 1 }}
                    onClick={(e) =>
                      this.handleWidgetBorderClick(e, widget, Direction.Left)
                    }
                  />
                  {/* Handle für den rechten Rand */}
                  <div
                    className="absolute top-0 right-0 h-full w-1 bg-transparent border-active-edit-mode"
                    style={{ zIndex: 1 }}
                    onClick={(e) =>
                      this.handleWidgetBorderClick(e, widget, Direction.Right)
                    }
                  />
                </>
              )}
              <WidgetComponent
                id={widget.key}
                x={widget.x}
                y={widget.y}
                width={widget.width}
                height={widget.height}
                onReplaceWidget={this.onReplaceWidget}
                removable={widget.type !== WidgetType.Empty}
                isEditMode={this.state.isEditMode}
              />
            </div>
          );
        })}
      </Gridlayout>
    );
  }

  render() {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
        <header className="bg-gray-800 shadow-md flex items-center justify-between">
          <h1 className="text-3xl font-bold">DM Screen</h1>
          <DMScreenMenu
            handleGridChange={this.handleGridChange}
            toggleEditMode={this.toggleEditMode}
            columns={this.state.columns}
            rows={this.state.rows}
            isEditMode={this.state.isEditMode}
          />
        </header>
        <main className="flex-1 flex flex-col min-h-0">
          <div
            ref={this.gridContainerRef}
            className="flex-1 min-h-0"
            style={{ height: "100%" }}
          >
            {this.renderGrid()}
          </div>
        </main>
      </div>
    );
  }
}
