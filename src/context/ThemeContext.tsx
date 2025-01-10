import React, { createContext, useState, useEffect, ReactNode } from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") {
        document.querySelector("html")?.setAttribute("class", "dark");
      } else {
        document.querySelector("html")?.setAttribute("class", "light");
      }
      return prevTheme === "light" ? "dark" : "light";
    });
    console.log("theme toggled:", theme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
