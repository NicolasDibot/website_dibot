(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");

  const labels = {
    fr: {
      toLight: "Basculer en mode clair",
      toDark: "Basculer en mode sombre",
    },
    en: {
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
    },
  };

  const lang = (root.lang || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";

  const applyTheme = (theme) => {
    const isLight = theme === "light";
    if (isLight) {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    if (toggle) {
      toggle.setAttribute("aria-label", isLight ? labels[lang].toDark : labels[lang].toLight);
      toggle.setAttribute("aria-pressed", isLight ? "true" : "false");
    }
  };

  const stored = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = stored || (prefersLight ? "light" : "dark");
  applyTheme(initial);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      applyTheme(next);
    });
  }
})();
