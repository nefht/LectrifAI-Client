import { useContext, useEffect } from "react";
import { HeaderContext } from "../context/HeaderContext";
import { useLocation } from "react-router";

export const useHeader = () => {
  const context = useContext(HeaderContext);
  const location = useLocation();

  useEffect(() => {
    if (context?.setHeaderClass) {
      context.setHeaderClass("");
    }
  }, [location]);

  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};
