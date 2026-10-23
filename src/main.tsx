import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "@fontsource-variable/manrope/wght.css";
import { App } from "./App";
import "./styles.css";
import { lang } from "./strings";

document.documentElement.lang = lang;

registerSW({ immediate: true });

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
