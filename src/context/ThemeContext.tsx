import React, { createContext, useState, useEffect, ReactNode } from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: (theme?: string) => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = (theme?: string) => {
    if (theme) {
      document.querySelector("html")?.setAttribute("class", theme);
      setTheme(theme);
      return;
    }
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
