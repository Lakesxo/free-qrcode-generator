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
  const downloadRef = useRef<HTMLButtonElement>(null);
  const downloadQr = useQrDownload();

  useGSAP(
    () => {
      if (!isReady || !imageRef.current) return;

      gsap.fromTo(
        imageRef.current,
        { scale: 0.85, opacity: 0, rotate: -4 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.55,
          ease: "back.out(1.7)",
        },
      );
    },
    { scope: cardRef, dependencies: [isReady, dataUrl], revertOnUpdate: true },
  );

  useGSAP(
    (_, contextSafe) => {
      const button = downloadRef.current;
      if (!button || !contextSafe) return;

      const onEnter = contextSafe(() => {
        gsap.to(button, {
          scale: 1.04,
          y: -2,
          boxShadow: "0 8px 0 rgba(30, 22, 51, 0.18)",
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const onLeave = contextSafe(() => {
        gsap.to(button, {
          scale: 1,
          y: 0,
          boxShadow: "0 4px 0 rgba(30, 22, 51, 0.15)",
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const onClick = contextSafe(() => {
        gsap.fromTo(
          button,
          { scale: 0.96 },
          { scale: 1.04, duration: 0.15, yoyo: true, repeat: 1 },
        );
      });

      button.addEventListener("mouseenter", onEnter);
      button.addEventListener("mouseleave", onLeave);
      button.addEventListener("click", onClick);

      return () => {
        button.removeEventListener("mouseenter", onEnter);
        button.removeEventListener("mouseleave", onLeave);
        button.removeEventListener("click", onClick);
      };
    },
    { scope: cardRef, dependencies: [canDownload] },
  );

  const handleDownload = () => {
    if (!dataUrl) return;
    downloadQr(dataUrl);
  };

  return (
    <div className="qr-preview" ref={cardRef}>
      <div className="qr-preview__card">
        <div className="qr-preview__badge">Live preview</div>

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
              <span className="qr-preview__placeholder-icon" aria-hidden="true">
                ▣
              </span>
              <p>
                {isLoading
                  ? "Cooking your code…"
                  : "Paste a URL and your QR pops up here"}
              </p>
            </div>
          )}
        </div>

        <button
          ref={downloadRef}
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
