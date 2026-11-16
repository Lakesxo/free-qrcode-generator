import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useQrDownload } from "../hooks/useQrDownload";
import "./QrPreview.css";

gsap.registerPlugin(useGSAP);

type QrPreviewProps = {
  dataUrl: string | null;
  isLoading: boolean;
  isReady: boolean;
  urlLabel: string;
  canDownload: boolean;
};

export function QrPreview({
  dataUrl,
  isLoading,
  isReady,
  urlLabel,
  canDownload,
}: QrPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const downloadQr = useQrDownload();

  useGSAP(
    () => {
      if (!isReady || !imageRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.fromTo(
        imageRef.current,
        { scale: 0.97, opacity: 0, filter: "blur(4px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        },
      );
    },
    { scope: cardRef, dependencies: [isReady, dataUrl], revertOnUpdate: true },
  );

  const handleDownload = () => {
    if (!dataUrl) return;
    downloadQr(dataUrl);
  };

  return (
    <div className="qr-preview" ref={cardRef}>
      <div className="qr-preview__panel">
        <div className="qr-preview__meta">
          <span className="qr-preview__label">Preview</span>
          <span className="qr-preview__size">512 × 512</span>
        </div>

        <div
          className="qr-preview__frame"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isReady && dataUrl ? (
            <img
              ref={imageRef}
              className="qr-preview__image"
              src={dataUrl}
              alt={`QR code for ${urlLabel}`}
              width={256}
              height={256}
            />
          ) : (
            <div className="qr-preview__placeholder">
              <svg
                className={`qr-preview__glyph${isLoading ? " qr-preview__glyph--scanning" : ""}`}
                viewBox="0 0 72 72"
                aria-hidden="true"
              >
                <g className="qr-preview__glyph-frame">
                  <path d="M2 16V8a6 6 0 0 1 6-6h8" />
                  <path d="M56 2h8a6 6 0 0 1 6 6v8" />
                  <path d="M70 56v8a6 6 0 0 1-6 6h-8" />
                  <path d="M16 70H8a6 6 0 0 1-6-6v-8" />
                </g>
                <g className="qr-preview__glyph-finders">
                  <rect x="14" y="14" width="14" height="14" rx="3.5" />
                  <rect x="44" y="14" width="14" height="14" rx="3.5" />
                  <rect x="14" y="44" width="14" height="14" rx="3.5" />
                </g>
                <g className="qr-preview__glyph-dots">
                  <rect x="18.5" y="18.5" width="5" height="5" rx="1.2" />
                  <rect x="48.5" y="18.5" width="5" height="5" rx="1.2" />
                  <rect x="18.5" y="48.5" width="5" height="5" rx="1.2" />
                  <rect x="33" y="14" width="5" height="5" rx="1.2" />
                  <rect x="33" y="23" width="5" height="5" rx="1.2" />
                  <rect x="33" y="33" width="5" height="5" rx="1.2" />
                  <rect x="44" y="33" width="5" height="5" rx="1.2" />
                  <rect x="53" y="33" width="5" height="5" rx="1.2" />
                  <rect x="14" y="33" width="5" height="5" rx="1.2" />
                  <rect x="23" y="33" width="5" height="5" rx="1.2" />
                  <rect x="44" y="44" width="5" height="5" rx="1.2" />
                  <rect x="53" y="53" width="5" height="5" rx="1.2" />
                  <rect x="33" y="48" width="5" height="5" rx="1.2" />
                  <rect x="44" y="53" width="5" height="5" rx="1.2" />
                  <rect x="33" y="53" width="5" height="5" rx="1.2" />
                </g>
                <rect
                  className="qr-preview__glyph-scan"
                  x="8"
                  y="0"
                  width="56"
                  height="2"
                  rx="1"
                />
              </svg>
              <p>
                {isLoading
                  ? "Generating…"
                  : "Your code appears here after you enter a URL"}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="qr-preview__download"
          onClick={handleDownload}
          disabled={!canDownload}
          aria-label="Download QR code as PNG"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
