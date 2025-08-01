import React, { Component, type JSX } from "react";
import {
  Widget,
  type WidgetProps,
  type WidgetState,
} from "../component/widget/Widget";
import { EmptyWidget } from "../component/widget/implementation/EmptyWidget";

interface DMScreenProps {
  columns: number;
  rows: number;
}

interface DMScreenState {
  columns: number;
  rows: number;
  widgets: JSX.Element[][];
}

export class DMScreen extends Component<DMScreenProps, DMScreenState> {
  public constructor(props: DMScreenProps) {
    super(props);

    const widgets: JSX.Element[][] = [];

    for (let y = 0; y < this.props.rows; y++) {
      const row: JSX.Element[] = [];
      for (let x = 0; x < this.props.columns; x++) {
        row.push(
          <EmptyWidget
            key={`${x},${y}`}
            id={Date.now().toString() + x + y}
            x={x}
            y={y}
            width={1}
            height={1}
          />
        );
      }
      widgets.push(row);
    }

    this.state = { columns: props.columns, rows: props.rows, widgets };
  }

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
        <header className="p-4 bg-gray-800 shadow-md">
          <h1 className="text-3xl font-bold">DM Screen</h1>
        </header>

        <main className="flex flex-1 p-4">
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
