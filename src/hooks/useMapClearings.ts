import { useEffect, type RefObject } from "react";

type Clearing = {
  selector: string;
  /** Measure the element's box instead of the tight bounds of its text. */
  box?: boolean;
  /** How far the radial reaches past the target, as a multiple of its half-size plus a fixed reach. */
  spread: number;
  reach: number;
  /** How much map is removed at the centre, and how far out that holds before fading. */
  strength: number;
  hold: number;
};

const CLEARINGS: Clearing[] = [
  {
    selector: [
      ".layout__header-bar",
      ".layout__logo",
      ".layout__logo-text",
      ".stats-counter",
      ".hero__eyebrow",
      ".hero__title",
      ".hero__subtitle",
      ".hero__copy .url-input__label",
      ".hero__copy .url-input__hint",
      ".layout__footer p",
    ].join(", "),
    spread: 1.3,
    reach: 72,
    strength: 0.9,
    hold: 0.45,
  },
  {
    selector: ".faq",
    box: true,
    spread: 1.5,
    reach: 140,
    strength: 1,
    hold: 0.7,
  },
  {
    selector: ".faq__eyebrow, .faq__heading, .faq__question, .faq__answer",
    spread: 1.4,
    reach: 90,
    strength: 1,
    hold: 0.55,
  },
];

const SCALE = 0.25;
/** The map layer grows in steps so small layout changes don't resize its canvas. */
const HEIGHT_STEP = 600;
const SETTLE_MS = 120;

function bounds(el: Element, box: boolean) {
  if (!box) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rect = range.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return rect;
  }
  return el.getBoundingClientRect();
}

/** Masks the map layer so contour lines clear away behind each block of text. */
export function useMapClearings(layerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const layer = layerRef.current;
    const layout = layer?.parentElement;
    if (!layer || !layout) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let signature = "";
    let frame = 0;
    let settleTimer = 0;

    const sizeLayer = () => {
      const footer = layout.querySelector(".layout__footer");
      const top = layout.getBoundingClientRect().top;
      const contentBottom = footer
        ? footer.getBoundingClientRect().bottom
        : layout.getBoundingClientRect().bottom;
      const height = Math.ceil((contentBottom - top + 1) / HEIGHT_STEP) * HEIGHT_STEP;
      const next = `${height}px`;
      if (layer.style.height !== next) layer.style.height = next;
    };

    const draw = () => {
      frame = 0;
      sizeLayer();
      const box = layer.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;

      const radials = CLEARINGS.flatMap((clearing) =>
        Array.from(document.querySelectorAll(clearing.selector))
          .map((el) => bounds(el, Boolean(clearing.box)))
          .filter((r) => r.width > 0 && r.height > 0)
          .map((r) => ({
            clearing,
            cx: Math.round(r.left + r.width / 2 - box.left),
            cy: Math.round(r.top + r.height / 2 - box.top),
            rx: Math.round((r.width / 2) * clearing.spread + clearing.reach),
            ry: Math.round((r.height / 2) * clearing.spread + clearing.reach),
          })),
      );

      const next = `${box.width}x${box.height}|${radials
        .map((r) => `${r.cx},${r.cy},${r.rx},${r.ry}`)
        .join(";")}`;
      if (next === signature) return;
      signature = next;

      canvas.width = Math.ceil(box.width * SCALE);
      canvas.height = Math.ceil(box.height * SCALE);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "destination-out";
      for (const { clearing, cx, cy, rx, ry } of radials) {
        const { strength, hold } = clearing;
        const radial = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        radial.addColorStop(0, `rgb(0 0 0 / ${strength})`);
        radial.addColorStop(hold, `rgb(0 0 0 / ${strength * 0.92})`);
        radial.addColorStop(hold + (1 - hold) * 0.55, `rgb(0 0 0 / ${strength * 0.4})`);
        radial.addColorStop(1, "rgb(0 0 0 / 0)");
        ctx.fillStyle = radial;
        ctx.save();
        ctx.translate(cx * SCALE, cy * SCALE);
        ctx.scale(rx * SCALE, ry * SCALE);
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();
      }

      const url = `url(${canvas.toDataURL("image/png")})`;
      layer.style.setProperty("-webkit-mask-image", url);
      layer.style.setProperty("mask-image", url);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const settle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(schedule, SETTLE_MS);
    };

    schedule();
    const timers = [600, 1500, 3000].map((ms) => window.setTimeout(schedule, ms));
    document.fonts?.ready.then(schedule);

    const resizeObserver = new ResizeObserver(settle);
    resizeObserver.observe(layout);
    window.addEventListener("scroll", settle, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach(window.clearTimeout);
      window.clearTimeout(settleTimer);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", settle);
    };
  }, [layerRef]);
}
