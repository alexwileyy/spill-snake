import React from "react";
import { Cell } from "./SnakeCell.style";

// position is an object with x and y coordinates
const SnakeCell = ({ position }) => (
  <Cell style={{ gridRow: position.y, gridColumn: position.x }} />
);

export default SnakeCell;
