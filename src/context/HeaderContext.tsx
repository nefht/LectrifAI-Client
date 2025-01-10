import {
  createContext,
  ReactNode,
  useState,
} from "react";

interface HeaderContextType {
  headerClass: string;
  setHeaderClass: (headerClass: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerClass, setHeaderClass] = useState<string>("");

  return (
    <HeaderContext.Provider value={{ headerClass, setHeaderClass }}>
      {children}
    </HeaderContext.Provider>
  );
};

export { HeaderContext, HeaderProvider };
