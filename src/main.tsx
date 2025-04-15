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
import { LectureDataProvider } from "./pages/LectureTools/context/LectureDataContext";
import { LectureVideoProvider } from "./pages/LectureTools/LectureVideoGenerator/context/LectureVideoContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QuizOptionsContextProvider } from "./pages/QuizMaker/context/QuizOptionsContext";
import { GeneratedSlideProcessProvider } from "./pages/SlideTools/GeneratedSlideProcess/context/GeneratedSlideContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <HeaderProvider>
                  <QuizOptionsContextProvider>
                    <LectureDataProvider>
                      <LectureVideoProvider>
                        <GeneratedSlideProcessProvider>
                          <SlideDataProvider>
                            <SlideExportProvider>
                              <App />
                            </SlideExportProvider>
                          </SlideDataProvider>
                        </GeneratedSlideProcessProvider>
                      </LectureVideoProvider>
                    </LectureDataProvider>
                  </QuizOptionsContextProvider>
              </HeaderProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
