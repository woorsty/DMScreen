import React, { Component } from "react";
import { DMScreenMenu } from "./menu/DMScreenMenu";
import Gridlayout from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import { WidgetType } from "../component/widget/WidgetType";
import { WidgetRegistry } from "../component/widget/WidgetRegistry";

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

  componentDidUpdate(prevProps: DMScreenProps, prevState: DMScreenState) {
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

  renderGrid(): React.ReactNode {
    const layout = this.getLayoutFromWidgets(this.state.widgets);

    return (
      <Gridlayout
        className="layout"
        cols={this.state.columns}
        rowHeight={this.getRowHeight()}
        width={this.state.containerWidth}
        isDraggable={this.state.isEditMode}
        isResizable={true}
        style={{ height: "100%" }}
        margin={[0, 0]}
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
              className="border border-gray-700 h-full w-full bg-gray-700"
              style={{ margin: 0, padding: 0 }}
            >
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
