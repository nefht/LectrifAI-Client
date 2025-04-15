import { useContext } from "react";
import { LectureDataContext } from "../context/LectureDataContext";

export const useLectureData = () => {
  const context = useContext(LectureDataContext);
  if (!context) {
    throw new Error("useLectureData must be used within a LectureDataProvider");
  }
  return context;
};
