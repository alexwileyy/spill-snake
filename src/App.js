import React, { Component } from "react";
import styled from "styled-components";
import Board from "./components/Board";
import SnakeCell from "./components/SnakeCell";
import Food from "./components/Food";

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

class App extends Component {
  state = {
    snakeCoordinates: [{ x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }]
  };
  size = 30;

  // write your functions here

  render() {
    return (
      <Container>
        <h1>🐍</h1>
        <Board size={this.size}>
          {this.state.snakeCoordinates.map((position, i) => (
            <SnakeCell key={i} position={position} />
          ))}
          {/* render food here */}
        </Board>
      </Container>
    );
  }
}

export default App;
