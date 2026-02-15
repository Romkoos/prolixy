import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { initI18n } from "./app/i18n";

void initI18n();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
