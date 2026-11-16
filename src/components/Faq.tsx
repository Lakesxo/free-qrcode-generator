import type { MouseEvent } from "react";
import gsap from "gsap";
import { faq } from "../content/faq";
import "./Faq.css";

const CLOSING = "is-closing";

function toggle(event: MouseEvent<HTMLElement>) {
  const item = event.currentTarget.parentElement as HTMLDetailsElement;
  const panel = item.querySelector<HTMLElement>(".faq__panel");
  if (!panel) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  event.preventDefault();
  gsap.killTweensOf(panel);

  const closing = item.open && !item.classList.contains(CLOSING);

  if (closing) {
    item.classList.add(CLOSING);
    gsap.to(panel, {
      height: 0,
      opacity: 0,
      duration: 0.26,
      ease: "power2.inOut",
      onComplete: () => {
        item.open = false;
        item.classList.remove(CLOSING);
        gsap.set(panel, { clearProps: "height,opacity" });
      },
    });
    return;
  }

  const reopening = item.classList.contains(CLOSING);
  item.classList.remove(CLOSING);
  item.open = true;
  gsap.fromTo(
    panel,
    reopening ? { height: panel.offsetHeight } : { height: 0, opacity: 0 },
    {
      height: "auto",
      opacity: 1,
      duration: 0.34,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(panel, { clearProps: "height,opacity" });
      },
    },
  );
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
