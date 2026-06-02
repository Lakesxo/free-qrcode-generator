import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./FloatingShapes.css";

gsap.registerPlugin(useGSAP);

const shapes = [
  { className: "shape shape--coral", style: { top: "8%", left: "6%" } },
  { className: "shape shape--sun", style: { top: "18%", right: "10%" } },
  { className: "shape shape--mint", style: { bottom: "22%", left: "12%" } },
  { className: "shape shape--grape", style: { bottom: "10%", right: "8%" } },
  { className: "shape shape--sun shape--sm", style: { top: "55%", left: "4%" } },
];

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.to(".shape", {
        y: "random(-18, 18)",
        x: "random(-12, 12)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.4, from: "random" },
      });
    },
    { scope: containerRef },
  );

  return (
    <div className="floating-shapes" ref={containerRef} aria-hidden="true">
      {shapes.map((shape, index) => (
        <span
          key={index}
          className={shape.className}
          style={shape.style}
        />
      ))}
    </div>
  );
}
