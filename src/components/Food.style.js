import styled from "styled-components";

export const FoodCell = styled.span`
  grid-column: ${({ position }) => position.x};
  grid-row: ${({ position }) => position.y};
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: red;
`;
