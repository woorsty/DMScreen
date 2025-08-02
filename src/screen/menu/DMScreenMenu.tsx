import React from "react";
import { GridMenu } from "./GridMenu";

type DMScreenMenuProps = {
  handleGridChange: (e: React.FormEvent<HTMLFormElement>) => void;
  columns: number;
  rows: number;
};
type DMScreenMenuState = {
  menuOpen: boolean;
};

export class DMScreenMenu extends React.Component<
  DMScreenMenuProps,
  DMScreenMenuState
> {
  public constructor(props: DMScreenMenuProps) {
    super(props);
    this.state = { menuOpen: false };
  }

  handleMenuToggle = () => {
    this.setState((prev) => ({ menuOpen: !prev.menuOpen }));
  };

  public render() {
    return (
      <div className="relative">
        <button
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded ml-4"
          onClick={this.handleMenuToggle}
          aria-label="Menü öffnen"
        >
          ☰ Menü
        </button>
        {this.state.menuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
            <GridMenu
              handleGridChange={this.props.handleGridChange}
              columns={this.props.columns}
              rows={this.props.rows}
            />
            {/* Hier können weitere Menüpunkte ergänzt werden */}
          </div>
        )}
      </div>
    );
  }
}
