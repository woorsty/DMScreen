import React from "react";

type GridMenuProps = {
  handleGridChange: (e: React.FormEvent<HTMLFormElement>) => void;
  rows: number;
  columns: number;
};

export class GridMenu extends React.Component<GridMenuProps, {}> {
  public render() {
    return (
      <form
        className="flex flex-col gap-2 p-4"
        onSubmit={(e) => {
          this.props.handleGridChange(e);
          this.setState({ menuOpen: false });
        }}
      >
        <label className="flex items-center justify-between">
          <span>Spalten:</span>
          <input
            type="number"
            name="columns"
            min={1}
            defaultValue={this.props.columns}
            className="ml-2 w-16 p-1 rounded text-black"
          />
        </label>
        <label className="flex items-center justify-between">
          <span>Zeilen:</span>
          <input
            type="number"
            name="rows"
            min={1}
            defaultValue={this.props.rows}
            className="ml-2 w-16 p-1 rounded text-black"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mt-2"
        >
          Anwenden
        </button>
      </form>
    );
  }
}
