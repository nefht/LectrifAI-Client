import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { HeaderProvider } from "./context/HeaderContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <ThemeProvider>
        <ToastProvider>
          <HeaderProvider>
              <App />
          </HeaderProvider>
        </ToastProvider>
      </ThemeProvider>
  </StrictMode>
);
