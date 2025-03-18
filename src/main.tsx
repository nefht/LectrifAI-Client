import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { HeaderProvider } from "./context/HeaderContext";
import { SlideExportProvider } from "./context/SlideExportContext";
import { SlideDataProvider } from "./pages/SlideTools/context/SlideDataContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <HeaderProvider>
              <SlideDataProvider>
                <SlideExportProvider>
                  <App />
                </SlideExportProvider>
              </SlideDataProvider>
            </HeaderProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
