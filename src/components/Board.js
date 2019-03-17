import React from "react";
import { Grid } from "./Board.style";

// size prop passed down to style component for number of rows/columns
// renders children
const Board = ({ size, children }) => <Grid size={size}>{children}</Grid>;

export default Board;
