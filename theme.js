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

  document.querySelectorAll(".video-facade[data-video-id]").forEach((facade) => {
    facade.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const videoId = facade.dataset.videoId || "";
      if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;

      event.preventDefault();

      const params = new URLSearchParams({ autoplay: "1", rel: "0", playsinline: "1" });
      const start = Number.parseInt(facade.dataset.videoStart || "", 10);
      if (Number.isInteger(start) && start > 0) params.set("start", String(start));

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
      iframe.title = facade.dataset.videoTitle || (lang === "fr" ? "Vidéo YouTube" : "YouTube video");
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";

      facade.parentElement.replaceChildren(iframe);
      iframe.focus();
    });
  });
})();
