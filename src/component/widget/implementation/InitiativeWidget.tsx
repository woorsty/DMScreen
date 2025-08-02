import type { Character } from "../../../model/Character";
import { Widget, type WidgetProps, type WidgetState } from "../Widget";

type InitiativeWidgetProps = WidgetProps & {};
type InitiativeWidgetState = WidgetState & {
  characters: Character[];
  nameInput: string;
  initiativeInput: string;
  currentIndex: number;
  currentHpInput: string;
  maxHpInput: string;
};

export class InitiativeWidget extends Widget<
  InitiativeWidgetProps,
  InitiativeWidgetState
> {
  public constructor(props: Readonly<InitiativeWidgetState>) {
    super(props);
    this.state = {
      ...props,
      characters: [],
      currentIndex: 0,
      nameInput: "",
      initiativeInput: "",
      maxHpInput: "",
      currentHpInput: "",
    };
  }

  handleAdd = () => {
    const name = this.state.nameInput.trim();
    const initiative = parseInt(this.state.initiativeInput, 10);
    const currentHp = parseInt(this.state.currentHpInput, 10);
    const maxHp = parseInt(this.state.maxHpInput, 10);

    if (!name || isNaN(initiative)) return;
    const characters = [
      ...this.state.characters,
      { name, initiative, currentHp, maxHp } as Character,
    ];
    characters.sort((a, b) => b.initiative - a.initiative);
    this.setState({
      characters,
      nameInput: "",
      initiativeInput: "",
      currentIndex: 0,
      currentHpInput: "",
      maxHpInput: "",
    });
  };

  handleRemove = (idx: number) => {
    const characters = this.state.characters.filter((_, i) => i !== idx);
    let currentIndex = this.state.currentIndex;
    if (currentIndex >= characters.length) currentIndex = 0;
    this.setState({ characters, currentIndex });
  };

  handleNext = () => {
    if (this.state.characters.length === 0) return;
    this.setState((state) => ({
      currentIndex: (state.currentIndex + 1) % state.characters.length,
    }));
  };

  render() {
    const {
      characters,
      nameInput,
      initiativeInput,
      maxHpInput,
      currentHpInput,
      currentIndex,
    } = this.state;
    return (
      <div className="bg-gray-800 p-2 rounded mx-auto">
        <div className="mb-2 flex gap-1">
          <input
            className="flex-1 p-1 rounded text-black"
            type="text"
            placeholder="Name"
            value={nameInput}
            onChange={(e) => this.setState({ nameInput: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") this.handleAdd();
            }}
          />
          <input
            className="w-16 p-1 rounded text-black"
            type="number"
            placeholder="Init"
            value={initiativeInput}
            onChange={(e) => this.setState({ initiativeInput: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") this.handleAdd();
            }}
          />
          <input
            className="w-16 p-1 rounded text-black"
            type="number"
            placeholder="HP"
            value={currentHpInput}
            onChange={(e) => this.setState({ currentHpInput: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") this.handleAdd();
            }}
          />
          <input
            className="w-16 p-1 rounded text-black"
            type="number"
            placeholder="Max HP"
            value={maxHpInput}
            onChange={(e) => this.setState({ maxHpInput: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") this.handleAdd();
            }}
          />
          <button
            className="bg-green-600 px-2 rounded"
            onClick={this.handleAdd}
          >
            +
          </button>
        </div>
        <ul className="mb-2">
          {characters.length === 0 ? (
            <li className="text-gray-400 text-center">Keine Charaktere</li>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-1">
              <thead>
                <tr className="text-gray-300">
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1">Init</th>
                  <th className="px-2 py-1">HP</th>
                  <th className="px-2 py-1">Max HP</th>
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {characters.map((char, idx) => (
                  <tr
                    key={idx}
                    className={
                      (idx === currentIndex
                        ? "bg-blue-400 text-black"
                        : "bg-gray-700 text-white") + " rounded"
                    }
                  >
                    <td className="px-2 py-1 max-w-xs truncate">{char.name}</td>
                    <td className="px-2 py-1">{char.initiative}</td>
                    <td className="px-2 py-1">
                      <input
                        className="w-16 p-1 bg-gray-600 rounded text-black text-right"
                        type="number"
                        value={char.currentHp}
                        min={0}
                        max={char.maxHp}
                        onChange={(e) => {
                          const newHp = parseInt(e.target.value, 10);
                          this.setState((state) => {
                            const updated = [...state.characters];
                            updated[idx] = {
                              ...updated[idx],
                              currentHp: isNaN(newHp) ? 0 : newHp,
                            };
                            return { characters: updated };
                          });
                        }}
                        style={{ width: "4rem" }}
                        aria-label="Aktuelle HP"
                      />
                    </td>
                    <td className="px-2 py-1">{char.maxHp}</td>
                    <td className="px-2 py-1">
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => this.handleRemove(idx)}
                        title="Entfernen"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ul>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
          onClick={this.handleNext}
          disabled={characters.length === 0}
        >
          Nächster dran
        </button>
      </div>
    );
  }
}
