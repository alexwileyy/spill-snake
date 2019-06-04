import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(${({ size }) => size || 30}, 1fr);
  grid-template-columns: repeat(${({ size }) => size || 30}, 1fr);
  border: solid 2px rgba(255, 255, 255, 0.39);
  height: 50vh;
  width: 50vh;
  box-sizing: border-box;
`;
