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
    foundFood: false,
    direction: "right",
    nextDirection: "right",
    snakeCoordinates: [
      { x: 9, y: 5 },
      { x: 8, y: 5 },
      { x: 7, y: 5 },
      { x: 6, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 },
      { x: 1, y: 5 }
    ],
    foodCoordinates: {}
  };
  size = 30;

  componentDidMount() {
    document.addEventListener("keydown", this.handleArrowKeydown);
    this.newEgg();
    this.snakePositionInterval = setInterval(this.updateBoard, 100);
  }

  componentWillUnmount() {
    clearInterval(this.snakePositionInterval);
  }

  shouldComponentUpdate(_, nextState) {
    if (this.state.snakeCoordinates[0] !== nextState.snakeCoordinates[0]) {
      return true;
    } else if (this.state.foodCoordinates !== nextState.foodCoordinates) {
      return true;
    } else return false;
  }

  newEgg = () => {
    const randomWithin = n => Math.ceil(Math.random() * n);
    const eggPosition = {
      x: randomWithin(this.size),
      y: randomWithin(this.size)
    };
    const clash = this.state.snakeCoordinates.some(value => {
      value.x !== eggPosition.x && value.y !== eggPosition.y;
    });
    if (clash) return this.newEgg();
    else this.setState({ foodCoordinates: eggPosition });
  };

  handleArrowKeydown = event => {
    const nextDir = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down"
    }[event.code];
    const oppositeDir = {
      up: "down",
      down: "up",
      left: "right",
      right: "left"
    }[nextDir];
    if (nextDir && this.state.direction !== oppositeDir) {
      this.updateDirection({ direction: nextDir, name: "nextDirection" });
    }
  };

  updateDirection = ({ direction, name }) => {
    this.setState({ [name]: direction });
  };

  eatenFood = () => {
    const nextPosition = this.getNextPos(this.state.snakeCoordinates[0]);
    return (
      nextPosition.x === this.state.foodCoordinates.x &&
      nextPosition.y === this.state.foodCoordinates.y
    );
  };

  getNextPos = head => {
    const { x, y } = head;
    let nextPos;
    if (this.state.nextDirection === "right") {
      nextPos = { x: x === this.size ? 1 : x + 1, y };
    } else if (this.state.nextDirection === "left") {
      nextPos = { x: x === 0 ? this.size : x - 1, y };
    } else if (this.state.nextDirection === "down") {
      nextPos = { x, y: y === this.size ? 1 : y + 1 };
    } else if (this.state.nextDirection === "up") {
      nextPos = { x, y: y === 0 ? this.size : y - 1 };
    }
    return nextPos;
  };

  updateBoard = () => {
    if (this.checkSnakeCollision()) this.endGame();
    if (this.eatenFood()) this.levelUp();
    this.updateSnakePosition();
  };

  levelUp = () => {
    this.setState({ foundFood: true });
    this.newEgg();
    // increase snake length
  };

  endGame = () => {
    this.setState({ message: "gameover" });
    clearInterval(this.snakePositionInterval);
  };

  checkSnakeCollision = () => {
    const newHead = this.getNextPos(this.state.snakeCoordinates[0]);
    return this.state.snakeCoordinates
      .slice(0, this.state.snakeCoordinates.length - 2)
      .some(value => value.x === newHead.x && value.y === newHead.y);
  };

  updateSnakePosition = () => {
    const nextPosition = this.getNextPos(this.state.snakeCoordinates[0]);
    this.setState(prev => ({
      snakeCoordinates: [nextPosition, ...this.state.snakeCoordinates].slice(
        0,
        this.state.foundFood
          ? this.state.snakeCoordinates.length + 1
          : this.state.snakeCoordinates.length
      ),
      direction: prev.nextDirection,
      foundFood: false
    }));
  };

  render() {
    return (
      <Container>
        <h1>🐍</h1>
        <Board size={this.size}>
          {this.state.snakeCoordinates.map((cell, i) => (
            <SnakeCell position={cell} key={i} />
          ))}
          {this.state.foodCoordinates && (
            <Food position={this.state.foodCoordinates} />
          )}
        </Board>
      </Container>
    );
  }
}

export default App;
