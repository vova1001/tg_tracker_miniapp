import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Если WebApp открыт в Telegram, расширяем под весь экран
if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.expand();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
