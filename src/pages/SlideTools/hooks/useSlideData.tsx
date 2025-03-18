import { useContext } from "react";
import { SlideDataContext } from "../context/SlideDataContext";

export const useSlideData = () => {
  const context = useContext(SlideDataContext);
  if (!context) {
    throw new Error("useSlideData must be used within a SlideDataProvider");
  }
  return context;
};
