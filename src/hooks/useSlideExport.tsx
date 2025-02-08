import { useContext } from "react";
import { SlideExportContext } from "../context/SlideExportContext";

export const useSlideExport = () => {
  const context = useContext(SlideExportContext);
  if (!context) {
    throw new Error("useSlideExport must be used within a SlideExportProvider");
  }
  return context;
};