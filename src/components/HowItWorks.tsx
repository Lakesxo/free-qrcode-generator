import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HowItWorks.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Paste your URL",
    body: "Drop in any http or https link — we'll tidy it up for you.",
    emoji: "📋",
  },
  {
    number: "02",
    title: "Preview instantly",
    body: "Your QR renders right in the browser. Nothing gets uploaded.",
    emoji: "👀",
  },
  {
    number: "03",
    title: "Download PNG",
    body: "Grab a crisp 512×512 image ready for print or screens.",
    emoji: "⬇️",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".how-it-works__heading", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      ScrollTrigger.batch(".how-it-works__step", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.55,
            ease: "back.out(1.5)",
            overwrite: true,
          });
        },
        start: "top 88%",
        once: true,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="how-it-works" ref={sectionRef} id="how-it-works">
      <h2 className="how-it-works__heading">Three taps, one code</h2>
      <div className="how-it-works__grid">
        {steps.map((step) => (
          <article key={step.number} className="how-it-works__step">
            <span className="how-it-works__emoji" aria-hidden="true">
              {step.emoji}
            </span>
            <span className="how-it-works__number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
