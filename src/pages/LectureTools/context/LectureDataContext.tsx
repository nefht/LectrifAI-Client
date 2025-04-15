import { createContext, useState } from "react";

interface LectureDataContextProps {
  lectureData: any;
  setLectureData: React.Dispatch<React.SetStateAction<any>>;
}

export const LectureDataContext = createContext<
  LectureDataContextProps | undefined
>(undefined);

export const LectureDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [lectureData, setLectureData] = useState({} as any);

  return (
    <LectureDataContext.Provider value={{ lectureData, setLectureData }}>
      {children}
    </LectureDataContext.Provider>
  );
};
