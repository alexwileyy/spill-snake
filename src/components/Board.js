import React from "react";
import { Grid } from "./Board.style";

const Board = ({ size, children }) => <Grid size={size}>{children}</Grid>;

export default Board;
