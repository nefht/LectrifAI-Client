import { useContext } from "react";
import { GeneratedSlideProcessContext } from "../context/GeneratedSlideProcessContext";

export const useGeneratedSlideProcess = () => {
  const context = useContext(GeneratedSlideProcessContext);
  if (!context) {
    throw new Error(
      "useGeneratedSlideProcess must be used within a PresentationOptionsProvider"
    );
  }
  return context;
};
