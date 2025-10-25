import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

//my contexts
import ThemeContextProvider from "./context/ThemeContextProvider.js";
import ChatContextProvider from "./context/ChatContextProvider.js";
import AuthContextProvider from "./context/AuthContextProvider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
