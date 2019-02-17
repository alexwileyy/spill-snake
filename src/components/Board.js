import React from "react";
import { Grid, Snake } from "./Board.style";

const Board = ({ snakePosition }) => (
  <Grid>
    {snakePosition.map((cell, i) => (
      <Snake snakePosition={cell} key={i} />
    ))}
  </Grid>
);

export default Board;
