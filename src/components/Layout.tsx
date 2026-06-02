import type { ReactNode } from "react";
import { FloatingShapes } from "./FloatingShapes";
import "./Layout.css";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <FloatingShapes />
      <header className="layout__header">
        <a className="layout__logo" href="/">
          <span className="layout__logo-mark" aria-hidden="true">
            ▣
          </span>
          Free QR
        </a>
      </header>
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <p>Built with ❤️ by <a target="_blank" href="https://olakunle.dev">Ridwan Ajanaku</a>.</p>
      </footer>
    </div>
  );
}
