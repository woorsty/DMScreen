import { Widget, type WidgetProps, type WidgetState } from "../Widget";

type EmptyWidgetProps = WidgetProps & {};
type EmptyWidgetState = WidgetState & {};

export class EmptyWidget extends Widget<EmptyWidgetProps, EmptyWidgetState> {
  public constructor(props: EmptyWidgetProps) {
    super(props);
    this.state = { ...props };
  }

  onClick() {
    console.log("test" + this.state.x + this.state.y);
  }

  render() {
    return <button onClick={() => this.onClick()}>+</button>;
  }
}
