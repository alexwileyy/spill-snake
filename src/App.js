import React, { Component } from "react";
import styled from "styled-components";
import Board from "./components/Board";
import SnakeCell from "./components/SnakeCell";
import Food from "./components/Food";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './styles.css';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center
  height: 100vh;
  width: 100vw;
`;


const Styles = {
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px 0"
  },
  leftTitle: {
    color: 'white',
    fontSize: '30px'
  },
  logo: {
    width: "60px",
    marginBottom: "30px"
  },
  resetButton: {
    backgroundColor: "rgb(53, 208, 184)",
    borderRadius: "3rem",
    padding: "0.75rem 1.5rem",
    border: "none",
    color: "rgb(4, 21, 73)",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    margin: "0 10px",
    outline: "none"
  },
  footer: {
    marginTop: "30px"
  },
  score: {
    color: "white",
    textAlign: "center",
    marginBottom: "20px"
  }
};

const Popup = withReactContent(Swal);

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      snakeCoordinates: [{ x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }],
      foodCoordinates: {},
      direction: "right",
      foodEaten: true,
      score: 0,
      gameOver: false,
      paused: false,
      speed: 100
    };
    this.generateFood();
  }

  size = 30;

  gameLoop;

  componentDidMount() {

    this.startGameLoop();

    document.onkeydown = (e) => {
      switch (e.code) {
        case "ArrowDown":
          this.setState({direction: "down"});
          break;
        case "ArrowRight":
          this.setState({direction: "right"});
          break;
        case "ArrowLeft":
          this.setState({ direction: "left" });
          break;
        case "ArrowUp":
          this.setState({direction: "up"});
          break;
      }
    }

  }

  componentWillUnmount() {
    clearInterval(this.gameLoop);
  }

  startGameLoop = () => {
    this.gameLoop = setInterval(() => {
      if(this.state.gameOver) {
        clearInterval(this.gameLoop)
      }
      if(!this.state.paused) {
        this.generateFood();
        this.moveSnake();
        this.snakeOverlapCheck();
        this.checkFoodEaten();
      }
    },this.state.speed);
  };

  /**
   * Generates a food piece to be rendered on the board
   */
  generateFood = () => {
    if(this.state.foodEaten) {

      const newFoodCords = {
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30)
      };

      newFoodCords.x = newFoodCords.x === 0 ? newFoodCords.x + 1 : newFoodCords.x;
      newFoodCords.y = newFoodCords.y === 0 ? newFoodCords.y + 1 : newFoodCords.y;

      const filteredSnake = this.state.snakeCoordinates.filter(cord => {
        return newFoodCords.x === cord.x && newFoodCords.y === cord.y;
      });

      if(filteredSnake.length <= 0) {
        this.setState({
          foodEaten: false,
          foodCoordinates: newFoodCords
        });
      } else {
        this.generateFood();
      }
    }
  };

  /**
   * Checks to see whether the food has been eaten
   */
  checkFoodEaten = () => {
    const foodCords = this.state.foodCoordinates;
    const filteredSnake = this.state.snakeCoordinates.filter(cord => {
      return foodCords.x === cord.x && foodCords.y === cord.y;
    });
    if(filteredSnake.length > 0) {
      this.setState(state => ({score: state.score += 1, foodEaten: true, speed: this.state.score % 3 === 0 ? state.speed -= 1 : this.state.speed}), () => {
        this.growSnake();
        this.generateFood();
      })
    }
  };

  /**
   * Performs the movement of the snake
   */
  moveSnake = () => {
    let snake = this.state.snakeCoordinates.slice();
    snake = snake.map(block => ({...block}));
    const startOfSnake = Object.assign({}, snake[0]);
    switch (this.state.direction) {
      case "up":
        startOfSnake.y--;
        if(startOfSnake.y === 0) {
          startOfSnake.y = this.size;
        }
        break;
      case "right":
        startOfSnake.x += 1;
        //todo: investigate why this needs +1 ?
        if(startOfSnake.x === this.size + 1) {
          startOfSnake.x = 0;
        }
        break;
      case "down":
        startOfSnake.y++;
        if(startOfSnake.y === this.size + 1) {
          startOfSnake.y = 0;
        }
        break;
      case "left":
        startOfSnake.x--;
        if(startOfSnake.x === 0) {
          startOfSnake.x = this.size;
        }
        break;
    }
    let t = [startOfSnake, ...snake];
    t.pop();
    this.setState({snakeCoordinates: t})
  };

  growSnake = () => {
    const endOfSnake = Object.assign({}, this.state.snakeCoordinates[this.state.snakeCoordinates.length - 1]);
    switch (this.state.direction) {
      case "up":
        endOfSnake.y += 1;
        break;
      case "right":
        endOfSnake.x -= 1;
        break;
      case "down":
        endOfSnake.y -= 1;
        break;
      case "left":
        endOfSnake.x += 1;
        break;
    }
    this.setState({snakeCoordinates: [...this.state.snakeCoordinates, endOfSnake]});
  };

  /**
   * Check whether the snake has overlapped itself
   */
  snakeOverlapCheck = () => {
    const headOfSnake = this.state.snakeCoordinates[0];
    const snake = this.state.snakeCoordinates.filter((cord, index) => {
      if(index !== 0) {
        return headOfSnake.x === cord.x && headOfSnake.y === cord.y
      }
    });
    if(snake.length > 0) {
      this.setState({gameOver: true});
      Popup.fire({
        title: <p>Game Over</p>,
        text: `Oops, looks like your snake has died! You scored ${this.state.score}`,
        confirmButtonColor: 'rgb(53, 208, 184)',
        confirmButtonText: "Restart game!",
        footer: <p>Want some therapy for that loss? <a href="http://spill.chat">Spill.</a></p>,
      }).then(() => {
        this.resetGame();
      })

    }
  };

  /**
   * Resets the game back to it's original state with a new piece of food
   */
  resetGame = () => {
    clearInterval(this.gameLoop);
    this.setState({
      snakeCoordinates: [{ x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }],
      score: 0,
      direction: "right",
      foodEaten: true,
      paused: false,
      gameOver: true
    }, () => {
      this.startGameLoop();
      this.setState({gameOver: false});
      this.generateFood();
    })
  };

  pauseGame = () => {
    this.setState(state => ({paused: !state.paused}))
  };

  render() {

    return (
      <Container>

        <section style={Styles.header}>
          <img style={Styles.logo} src="https://www.spill.chat/7f58e2c266e5c59a10c0651b7da4adff.png"/>
          <h1 style={Styles.leftTitle}>🐍 @ Spill</h1>
        </section>

        <section>
          <Board size={this.size}>
            {this.state.snakeCoordinates.map((position, i) => (
              <SnakeCell key={i} position={position} />
            ))}
            {Object.keys(this.state.foodCoordinates).length > 0 &&
            <Food position={this.state.foodCoordinates}/>
            }
          </Board>

        </section>

        <section style={Styles.footer}>
          <p style={Styles.score}>Score: {this.state.score}</p>
          <button style={Styles.resetButton} onClick={this.resetGame}>Reset Game</button>
          <button style={Styles.resetButton} onClick={this.pauseGame}>{this.state.paused ? "Resume" : "Pause"}</button>
        </section>


      </Container>
    );
  }
}

export default App;
