import React from "react";
import { Grid, Snake } from "./Board.style";

const Board = ({ snakePosition, size, children }) => (
  <Grid size={size}>{children}</Grid>
);

export default Board;
