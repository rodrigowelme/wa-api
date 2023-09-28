import { useEffect, useState } from "react";

export default function ChangeTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(localStorage.getItem("data-theme") || "light");
  }, []);

  const changeTheme = (localTheme: string) => {
    setTheme(localTheme);
    localStorage.setItem("data-theme", localTheme);
  };

  document.querySelector("body")?.setAttribute("data-theme", theme);

  const toggleTheme = () => {
    if (theme == "light") {
      changeTheme("dark");
    } else {
      changeTheme("light");
    }
  };

  return (
    <button className="text-3xl" onClick={() => toggleTheme()}>
      {theme == "dark" ? <>&#127769;</> : <>&#9728;</>}
    </button>
  );
}
