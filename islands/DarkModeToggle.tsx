import { useEffect, useState } from "preact/hooks";

function getInitialDark(): boolean {
  const stored = localStorage.getItem("darkMode");
  if (stored !== null) return stored === "true";
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const enabled = getInitialDark();
    setDark(enabled);
    applyTheme(enabled);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    localStorage.setItem("darkMode", String(next));
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      class="text-sm px-3 py-1 border rounded hover:bg-base-200 transition-colors select-none"
      aria-label="Toggle dark mode"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
