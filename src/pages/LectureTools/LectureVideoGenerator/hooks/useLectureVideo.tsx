import { useContext } from "react";
import { LectureVideoContext } from "../context/LectureVideoContext";

export const useLectureVideo = () => {
  const context = useContext(LectureVideoContext);
  if (!context) {
    throw new Error(
      "useLectureVideo must be used within a LectureVideoProvider"
    );
  }
  return context;
};
