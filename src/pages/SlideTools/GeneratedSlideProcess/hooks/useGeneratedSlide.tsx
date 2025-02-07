import { useContext } from "react";
import { GeneratedSlideContext } from "../context/GeneratedSlideContext";

export const useGeneratedSlide = () => {
  const context = useContext(GeneratedSlideContext);
  if (!context) {
    throw new Error(
      "useGeneratedSlideProcess must be used within a PresentationOptionsProvider"
    );
  }
  return context;
};
