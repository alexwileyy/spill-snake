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
    width: "40px",
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

  // Defines the size of the grid
  size = 30;

  // Global game loop variable used to be assigned to a set interview
  gameLoop;

  componentDidMount() {

    // Start the game loop when the component mounts
    this.startGameLoop();

    // Attach document key down event listeners
    document.onkeydown = (e) => {
      // Check based on code from event
      switch (e.code) {
        case "ArrowDown":
          // Set direction to down
          if(this.state.direction !== "up") {
            this.setState({direction: "down"});
          }
          break;
        case "ArrowRight":
          // Set direction to up
          if(this.state.direction !== "left") {
            this.setState({direction: "right"});
          }
          break;
        case "ArrowLeft":
          // Set direction to left
          if(this.state.direction !== "right") {
            this.setState({ direction: "left" });
          }
          break;
        case "ArrowUp":
          // Set direction to up
          if(this.state.direction !== "down") {
            this.setState({direction: "up"});
          }
          break;
      }
    }

  }

  /**
   * Called when the component unmounts
   */
  componentWillUnmount() {
    // Clear the interval when the component unmounts
    clearInterval(this.gameLoop);
  }

  /**
   * Starts the gane loop
   */
  startGameLoop = () => {
    // Create a new interval and assign it to the global variable gameLoop
    this.gameLoop = setInterval(() => {
      // Check if the game is over
      if(this.state.gameOver) {
        // Clear the interval
        clearInterval(this.gameLoop)
      }
      // Check to see if the game is paused
      if(!this.state.paused) {
        // Generate a piece of food
        this.generateFood();
        // Move the snake
        this.moveSnake();
        // Check to see if the snake has overlapped
        this.snakeOverlapCheck();
        // Check to see if the food has been eaten
        this.checkFoodEaten();
      }
    },this.state.speed);
  };

  /**
   * Generates a food piece to be rendered on the board
   */
  generateFood = () => {
    // Check to see if food needs to be generated
    if(this.state.foodEaten) {

      // Generate the new coordinates
      const newFoodCords = {
        x: Math.floor(Math.random() * 30),
        y: Math.floor(Math.random() * 30)
      };

      // If X is 0, make it 1
      newFoodCords.x = newFoodCords.x === 0 ? newFoodCords.x + 1 : newFoodCords.x;
      // If Y is 0, make it 1
      newFoodCords.y = newFoodCords.y === 0 ? newFoodCords.y + 1 : newFoodCords.y;

      // Filter the snake coordinates to ensure that the new piece of food does not
      // intersect with the snake
      const filteredSnake = this.state.snakeCoordinates.filter(cord => {
        return newFoodCords.x === cord.x && newFoodCords.y === cord.y;
      });

      // Ensure that the food does not intersect
      if(filteredSnake.length <= 0) {
        // Update state with food
        this.setState({
          foodEaten: false,
          foodCoordinates: newFoodCords
        });
      } else {
        // If the food does intersect, recall generate food
        this.generateFood();
      }
    }
  };

  /**
   * Checks to see whether the food has been eaten
   */
  checkFoodEaten = () => {
    // Get the food coords from state
    const foodCords = this.state.foodCoordinates;
    // Filter the snake based on wether it has intersected with a piece of the snake
    const filteredSnake = this.state.snakeCoordinates.filter(cord => {
      // Perform collision detection
      return foodCords.x === cord.x && foodCords.y === cord.y;
    });
    // Check if the snake has intersected a piece of food
    if(filteredSnake.length > 0) {
      // Update state and generate new piece of food
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
    const direction = this.state.direction;
    // Clone the snake for state to avoid mutation
    let snake = this.state.snakeCoordinates.slice().map(block => ({...block}));
    // Clone the head of the snake
    const startOfSnake = Object.assign({}, snake[0]);
    // Switch based on the direction of the snake
    switch (direction) {
      case "up":
        // Decrease Y value by 1
        startOfSnake.y--;
        // Handle snake reaching edge of box
        if(startOfSnake.y === 0) {
          startOfSnake.y = this.size;
        }
        break;
      case "right":
        // Increase X value by 1
        startOfSnake.x += 1;
        // Handle snake reaching edge of box
        if(startOfSnake.x === this.size + 1) {
          startOfSnake.x = 0;
        }
        break;
      case "down":
        // Increase Y value by 1
        startOfSnake.y++;
        // Handle snake reaching edge of box
        if(startOfSnake.y === this.size + 1) {
          startOfSnake.y = 0;
        }
        break;
      case "left":
        // Decrease X value by 1
        startOfSnake.x--;
        // Handle snake reaching edge of box
        if(startOfSnake.x === 0) {
          startOfSnake.x = this.size;
        }
        break;
    }
    // Create a new snake
    let newSnake = [startOfSnake, ...snake];
    // Remove the end of the snake
    newSnake.pop();
    // Save the new snake to state
    this.setState({snakeCoordinates: newSnake})
  };

  /**
   * Grow the snake after a piece of food has been eaten
   */
  growSnake = () => {
    // Get the end of the snake and clone it so that state is not mutated
    const endOfSnake = Object.assign({}, this.state.snakeCoordinates[this.state.snakeCoordinates.length - 1]);
    // Updates the position in the endOfSnake object so that a piece is added to the end dependant on what
    // direction the snake is travelling in
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
    // Update the snake in state
    this.setState({snakeCoordinates: [...this.state.snakeCoordinates, endOfSnake]});
  };

  /**
   * Check whether the snake has overlapped itself
   */
  snakeOverlapCheck = () => {
    // Get the head of the snake
    const headOfSnake = this.state.snakeCoordinates[0];

    // Filter the snake based on whether the head intersects with any of the other parts of the snale
    const snake = this.state.snakeCoordinates.filter((cord, index) => {
      // Ignore the head piece
      if(index !== 0) {
        return headOfSnake.x === cord.x && headOfSnake.y === cord.y
      }
    });
    // Check to see if any of the snake does intersect
    if(snake.length > 0) {
      // Set game to be over cancelling the event loop
      this.setState({gameOver: true});
      // Fire a new popup window
      Popup.fire({
        title: <p>Game Over</p>,
        text: `Oops, looks like your snake has died! You scored ${this.state.score}`,
        confirmButtonColor: 'rgb(53, 208, 184)',
        confirmButtonText: "Restart game!",
        footer: <p>Want some therapy for that loss? <a href="http://spill.chat">Spill.</a></p>,
      }).then(() => {
        // After the user has clicked reset game, reset the game
        this.resetGame();
      })

    }
  };

  /**
   * Resets the game back to it's original state with a new piece of food
   */
  resetGame = () => {
    // Clear the game loop
    clearInterval(this.gameLoop);
    // Update state with new values
    this.setState({
      snakeCoordinates: [{ x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }],
      score: 0,
      direction: "right",
      foodEaten: true,
      paused: false,
      gameOver: true
    }, () => {
      // Start the new gane loop
      this.startGameLoop();
      // Set the game over to false
      this.setState({gameOver: false});
    })
  };

  /**
   * Pause the gane
   */
  pauseGame = () => {
    // Set the paused state
    this.setState(state => ({paused: !state.paused}))
  };

  /**
   * Render the game
   * @returns {*}
   */
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
