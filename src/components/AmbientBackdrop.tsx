import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./AmbientBackdrop.css";

gsap.registerPlugin(useGSAP);

/** Grain and quiet corner marks. */
export function AmbientBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.to(".ambient__mark", {
        y: "random(-10, 10)",
        x: "random(-8, 8)",
        rotation: "random(-6, 6)",
        duration: "random(8, 14)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.6, from: "random" },
      });
    },
    { scope: rootRef },
  );

  return (
    <div className="ambient" ref={rootRef} aria-hidden="true">
      <div className="ambient__marks">
        <span className="ambient__mark ambient__mark--tl" />
        <span className="ambient__mark ambient__mark--tr" />
        <span className="ambient__mark ambient__mark--br" />
        <span className="ambient__mark ambient__mark--bl" />
      </div>
      <div className="ambient__vignette" />
      <div className="ambient__grain" />
    </div>
  );
}
