import React, { Component, type JSX } from "react";
import { EmptyWidget } from "../component/widget/implementation/EmptyWidget";
import { InitiativeWidget } from "../component/widget/implementation/InitiativeWidget";
import { DMScreenMenu } from "./menu/DMScreenMenu";
import Gridlayout from "react-grid-layout";

interface DMScreenProps {
  columns: number;
  rows: number;
}

interface DMScreenState {
  columns: number;
  rows: number;
  widgets: JSX.Element[][];
  menuOpen: boolean;
  isEditMode: boolean;
  containerHeight: number; // <--- NEU
}

export class DMScreen extends Component<DMScreenProps, DMScreenState> {
  gridContainerRef = React.createRef<HTMLDivElement>();

  public constructor(props: DMScreenProps) {
    super(props);

    const widgets = this.initWidgets(props.columns, props.rows);
    this.state = {
      columns: props.columns,
      rows: props.rows,
      widgets,
      menuOpen: false,
      isEditMode: false,
      containerHeight: 0, // <--- NEU
    };
  }

  componentDidMount() {
    this.updateContainerHeight();
    window.addEventListener("resize", this.updateContainerHeight);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateContainerHeight);
  }

  componentDidUpdate(prevProps: DMScreenProps, prevState: DMScreenState) {
    this.updateContainerHeight();
  }

  initWidgets(columns: number, rows: number): JSX.Element[][] {
    const widgets: JSX.Element[][] = [];
    for (let x = 0; x < rows; x++) {
      const row: JSX.Element[] = [];
      for (let y = 0; y < columns; y++) {
        row.push(
          <EmptyWidget
            key={`${x},${y}`}
            id={Date.now().toString() + x + y}
            x={x}
            y={y}
            width={1}
            height={1}
            onReplaceWidget={this.onReplaceWidget}
          />
        );
      }
      widgets.push(row);
    }
    widgets[0][0] = (
      <InitiativeWidget
        id={""}
        x={0}
        y={0}
        width={1}
        height={1}
        onReplaceWidget={this.onReplaceWidget}
        removable={true}
      />
    );
    return widgets;
  }

  onReplaceWidget = (x: number, y: number, widget: JSX.Element) => {
    const widgets = this.state.widgets.slice();
    widgets[x] = widgets[x].slice();
    widgets[x][y] = widget;
    this.setState({ widgets });
  };

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
      const widgets = this.initWidgets(columns, rows);
      this.setState({
        columns,
        rows,
        widgets,
      });
    }
  };

  updateContainerHeight = () => {
    const container = this.gridContainerRef.current;
    if (container) {
      const height = container.clientHeight;
      if (height !== this.state.containerHeight) {
        this.setState({ containerHeight: height });
      }
    }
  };

  getRowHeight() {
    if (!this.state.containerHeight) return 100; // Fallback
    return this.state.containerHeight / this.state.rows;
  }

  renderGrid(): React.ReactNode {
    const layout = this.state.widgets.flat().map((widget, idx) => {
      const x = idx % this.state.columns;
      const y = Math.floor(idx / this.state.columns);
      return {
        i: `${x},${y}`,
        x,
        y,
        w: 1,
        h: 1,
      };
    });

    return (
      <Gridlayout
        className="layout"
        cols={this.state.columns}
        rowHeight={this.getRowHeight()}
        width={window.screen.availWidth}
        layout={layout}
        isDraggable={this.state.isEditMode}
        isResizable={this.state.isEditMode}
        style={{ height: "100%" }}
        margin={[0, 0]}
        containerPadding={[0, 0]}
      >
        {this.state.widgets.flat().map((widget, idx) => {
          const x = idx % this.state.columns;
          const y = Math.floor(idx / this.state.columns);
          return (
            <div
              key={`${x},${y}`}
              className="border border-gray-700 h-full w-full bg-gray-700"
              style={{ margin: 0, padding: 0 }}
            >
              {widget}
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
