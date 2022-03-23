import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./store/auth-context";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById("root")
);
