import React, { Fragment } from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import App from "./App";

const GlobalStyle = createGlobalStyle`
  ${reset}
`;

const AppContainer = () => (
  <Fragment>
    <GlobalStyle />
    <App />
  </Fragment>
);

render(<AppContainer />, document.getElementById("🐍"));
