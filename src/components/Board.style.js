import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(${({ size }) => size || 30}, 1fr);
  grid-template-columns: repeat(${({ size }) => size || 30}, 1fr);
  border: solid 2px black;
  height: 50vh;
  width: 50vh;
`;

export const Snake = styled.div`
  grid-column: ${({ snakePosition }) => snakePosition.x};
  grid-row: ${({ snakePosition }) => snakePosition.y};
  background-color: black;
`;
