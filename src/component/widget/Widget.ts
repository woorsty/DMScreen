import React from "react";

export abstract class Widget extends React.Component {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;

  public constructor(props: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    super(props);
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
  }
}
