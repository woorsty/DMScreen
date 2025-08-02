import React, { Component, type JSX } from "react";
import { EmptyWidget } from "../component/widget/implementation/EmptyWidget";
import { InitiativeWidget } from "../component/widget/implementation/InitiativeWidget";
import { DMScreenMenu } from "./menu/DMScreenMenu";

interface DMScreenProps {
  columns: number;
  rows: number;
}

interface DMScreenState {
  columns: number;
  rows: number;
  widgets: JSX.Element[][];
  menuOpen: boolean;
}

export class DMScreen extends Component<DMScreenProps, DMScreenState> {
  public constructor(props: DMScreenProps) {
    super(props);

    const widgets = this.createWidgets(props.columns, props.rows);
    this.state = {
      columns: props.columns,
      rows: props.rows,
      widgets,
      menuOpen: false,
    };
  }

  createWidgets(columns: number, rows: number): JSX.Element[][] {
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
    widgets[x][y] = widget;
    this.setState({ widgets });
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
    if (columns > 0 && rows > 0) {
      const widgets = this.createWidgets(columns, rows);
      this.setState({ columns, rows, widgets });
    }
  };

  renderGrid(): React.ReactNode {
    return this.state.widgets.flat().map((widget, index) => (
      <div key={index} className="bg-gray-700 p-2 rounded shadow text-center">
        {widget}
      </div>
    ));
  }

  render() {
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-900 text-white">
        <header className="p-4 bg-gray-800 shadow-md flex items-center justify-between">
          <h1 className="text-3xl font-bold">DM Screen</h1>
          <DMScreenMenu
            handleGridChange={this.handleGridChange}
            columns={this.state.columns}
            rows={this.state.rows}
          />
        </header>

        <main className="flex flex-1 p-4 flex-col gap-4">
          <div
            className="flex-1 grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${this.state.columns}, 1fr)`,
              gridTemplateRows: `repeat(${this.state.rows}, 1fr)`,
            }}
          >
            {this.renderGrid()}
          </div>
        </main>
      </div>
    );
  }
}
