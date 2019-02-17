import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Board from "./components/Board";

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function useKeydownListener() {}

const App = () => {
  const [snakePosition, updateSnakePosition] = useState([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ]);
  const [direction, updateDirection] = useState("right");

  useEffect(() => {
    window.addEventListener("keydown", event => {
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
      };
      console.log(direction, nextDir, direction !== oppositeDir[nextDir]);
      if (nextDir && direction !== oppositeDir[nextDir]) {
        updateDirection(nextDir);
      }
    });
  });

  const getNextPos = head => {
    const { x, y } = head;
    let nextPos;
    if (direction === "right") {
      nextPos = { x: x + 1, y };
    } else if (direction === "left") {
      nextPos = { x: x - 1, y };
    } else if (direction === "down") {
      nextPos = { x, y: y + 1 };
    } else if (direction === "up") {
      nextPos = { x, y: y - 1 };
    }
    return nextPos;
  };

  useInterval(() => {
    updateSnakePosition(prev => {
      const nextPos = getNextPos(prev[0]);
      return [nextPos, ...prev].slice(0, prev.length);
    });
  }, 300);

  // console.log(direction, snakePosition);
  return (
    <Container>
      <h1>🐍</h1>
      <Board snakePosition={snakePosition} />
    </Container>
  );
};

export default App;
