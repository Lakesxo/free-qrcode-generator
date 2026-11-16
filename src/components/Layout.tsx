import { useRef, type ReactNode } from "react";
import { useMapClearings } from "../hooks/useMapClearings";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { StatsCounter } from "./StatsCounter";
import Topography from "./Topography";
import "./Layout.css";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const topographyRef = useRef<HTMLDivElement>(null);
  useMapClearings(topographyRef);

  return (
    <div className="layout">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="layout__topography" ref={topographyRef} aria-hidden="true">
        <Topography
          color="#4d7a6d"
          lineCount={48}
          lineWidth={1.2}
          elevation={1}
          foreground={1}
          tilt={90}
          speed={0.25}
          direction="forward"
          glow={0.4}
          depthOfField={0}
          fog={0}
          hoverEffect="lift"
          clickEffect="pulse"
          lightMode
          opacity={0.2}
        />
      </div>
      <AmbientBackdrop />
      <header className="layout__header">
        <div className="layout__header-bar">
          <a className="layout__logo" href="/">
            <img
              className="layout__logo-mark"
              src="/favicon.svg"
              alt=""
              width={32}
              height={32}
              decoding="async"
            />
            <span className="layout__logo-text">Qrbie</span>
          </a>
          <StatsCounter />
        </div>
      </header>
      <main id="main" className="layout__main">
        {children}
      </main>
      <footer className="layout__footer">
        <p>
          Built by{" "}
          <a target="_blank" rel="noreferrer" href="https://olakunle.dev">
            Ridwan Ajanaku
          </a>
        </p>
      </footer>
    </div>
  );
}
