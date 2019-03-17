import React, { PureComponent } from "react";
import { FoodCell } from "./Food.style";

// position is passed down to the styled component
class Food extends PureComponent {
  render() {
    return <FoodCell position={this.props.position} />;
  }
}

export default Food;
