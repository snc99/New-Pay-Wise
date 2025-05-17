"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const userPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (userPrefersDark) {
        setTheme("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        setTheme("light");
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }, []);

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost">
        🌈
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] w-32 rounded-md bg-base-100 p-2 shadow"
      >
        <li>
          <a
            onClick={() => handleThemeChange("light")}
            className={`${theme === "light" ? "active text-blue-500" : ""}`}
          >
            Light
          </a>
        </li>
        <li>
          <a
            onClick={() => handleThemeChange("dark")}
            className={`${theme === "dark" ? "active text-blue-500" : ""}`}
          >
            Dark
          </a>
        </li>
        <li>
          <a
            onClick={() => handleThemeChange("retro")}
            className={`${theme === "retro" ? "active text-blue-500" : ""}`}
          >
            Retro
          </a>
        </li>
      </ul>
    </div>
  );
}
