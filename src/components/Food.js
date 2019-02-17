import React, { PureComponent } from "react";
import { FoodCell } from "./Food.style";

class Food extends PureComponent {
  render() {
    return <FoodCell position={this.props.position}>{/* 🍎 */}</FoodCell>;
  }
}

export default Food;
