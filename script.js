const panels = [...document.querySelectorAll("[data-project]")];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updatePanels() {
  const viewportMiddle = window.innerHeight * 0.5;

  panels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const panelMiddle = rect.top + rect.height * 0.5;
    const distance = Math.abs(panelMiddle - viewportMiddle);
    const focus = clamp(1 - distance / (window.innerHeight * 0.72), 0, 1);
    const drift = clamp((viewportMiddle - panelMiddle) / window.innerHeight, -1, 1);

    panel.style.setProperty("--focus", focus.toFixed(3));
    panel.style.setProperty("--drift", drift.toFixed(3));
  });
}

updatePanels();
window.addEventListener("scroll", updatePanels, { passive: true });
window.addEventListener("resize", updatePanels);

function scrollToProject(hash) {
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;

  target.scrollIntoView({ block: "start" });
  requestAnimationFrame(updatePanels);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    event.preventDefault();
    history.pushState(null, "", hash);
    scrollToProject(hash);
  });
});

window.addEventListener("hashchange", () => scrollToProject(window.location.hash));
window.addEventListener("load", () => requestAnimationFrame(() => scrollToProject(window.location.hash)));
