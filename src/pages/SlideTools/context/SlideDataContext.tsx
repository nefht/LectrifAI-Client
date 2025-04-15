import { createContext, useState } from "react";
import { SlideData } from "../../../components/DragAndDrop/constants/slide-data";

interface SlideDataContextProps {
  slideData: SlideData;
  setSlideData: React.Dispatch<React.SetStateAction<SlideData>>;
}

export const SlideDataContext = createContext<
  SlideDataContextProps | undefined
>(undefined);

export const SlideDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [slideData, setSlideData] = useState<SlideData>({} as SlideData);

  return (
    <SlideDataContext.Provider value={{ slideData, setSlideData }}>
      {children}
    </SlideDataContext.Provider>
  );
};
