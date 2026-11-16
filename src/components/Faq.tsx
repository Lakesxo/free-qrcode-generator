import type { MouseEvent } from "react";
import { faq } from "../content/faq";
import "./Faq.css";

const CLOSING = "is-closing";
const endHandlers = new WeakMap<HTMLElement, (event: TransitionEvent) => void>();

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function onHeightEnd(panel: HTMLElement, handler: () => void) {
  const previous = endHandlers.get(panel);
  if (previous) panel.removeEventListener("transitionend", previous);

  const next = (event: TransitionEvent) => {
    if (event.target !== panel || event.propertyName !== "height") return;
    panel.removeEventListener("transitionend", next);
    endHandlers.delete(panel);
    handler();
  };

  endHandlers.set(panel, next);
  panel.addEventListener("transitionend", next);
}

function lockHeight(panel: HTMLElement, height: number) {
  panel.style.height = `${Math.max(height, 0)}px`;
}

function toggle(event: MouseEvent<HTMLElement>) {
  const item = event.currentTarget.parentElement as HTMLDetailsElement;
  const panel = item.querySelector<HTMLElement>(".faq__panel");
  if (!panel) return;
  if (prefersReducedMotion()) return;

  event.preventDefault();

  const closing = item.open && !item.classList.contains(CLOSING);

  if (closing) {
    item.classList.add(CLOSING);
    lockHeight(panel, panel.getBoundingClientRect().height);
    panel.offsetHeight;
    lockHeight(panel, 0);
    onHeightEnd(panel, () => {
      item.open = false;
      item.classList.remove(CLOSING);
      panel.style.height = "";
    });
    return;
  }

  const startHeight = item.classList.contains(CLOSING)
    ? panel.getBoundingClientRect().height
    : 0;

  item.classList.remove(CLOSING);
  item.open = true;
  lockHeight(panel, startHeight);
  panel.offsetHeight;
  lockHeight(panel, panel.scrollHeight);
  onHeightEnd(panel, () => {
    panel.style.height = "";
  });
}

export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-heading">
      <div className="faq__intro">
        <p className="faq__eyebrow">FAQ</p>
        <h2 className="faq__heading" id="faq-heading">
          Free <span className="faq__heading-accent">QR code</span> questions
        </h2>
      </div>

      <div className="faq__list">
        {faq.map((entry, index) => (
          <details className="faq__item" key={entry.question} open={index === 0}>
            <summary className="faq__question" onClick={toggle}>
              {entry.question}
            </summary>
            <div className="faq__panel">
              <p className="faq__answer">{entry.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
