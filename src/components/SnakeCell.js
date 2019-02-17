import React from "react";
import { Cell } from "./SnakeCell.style";

const SnakeCell = ({ position }) => (
  <Cell style={{ gridRow: position.y, gridColumn: position.x }} />
);

export default SnakeCell;
