import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useQrDownload } from "../hooks/useQrDownload";
import "./DeepLinkQrModal.css";

gsap.registerPlugin(useGSAP);

type DeepLinkQrModalProps = {
  open: boolean;
  onClose: () => void;
  dataUrl: string | null;
  isLoading: boolean;
  isReady: boolean;
  urlLabel: string;
};

export function DeepLinkQrModal({
  open,
  onClose,
  dataUrl,
  isLoading,
  isReady,
  urlLabel,
}: DeepLinkQrModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const downloadQr = useQrDownload();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!open || !panelRef.current || !backdropRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.88, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" },
      );
    },
    { dependencies: [open], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!open || !isReady || !imageRef.current) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, rotate: -6 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
      );
    },
    { dependencies: [open, isReady, dataUrl], revertOnUpdate: true },
  );

  if (!open) return null;

  const canDownload = isReady && Boolean(dataUrl);

  const handleDownload = () => {
    if (!dataUrl) return;
    downloadQr(dataUrl);
  };

  return createPortal(
    <div className="deep-link-modal" role="presentation">
      <div
        className="deep-link-modal__backdrop"
        ref={backdropRef}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className="deep-link-modal__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deep-link-modal-title"
        aria-describedby="deep-link-modal-desc"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="deep-link-modal__header">
          <p className="deep-link-modal__badge">Your QR is ready</p>
          <button
            ref={closeRef}
            type="button"
            className="deep-link-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <h2 id="deep-link-modal-title" className="deep-link-modal__title">
          Scan or download
        </h2>
        <p id="deep-link-modal-desc" className="deep-link-modal__url" title={urlLabel}>
          {urlLabel}
        </p>

        <div className="deep-link-modal__frame" aria-busy={isLoading}>
          {isReady && dataUrl ? (
            <img
              ref={imageRef}
              className="deep-link-modal__image"
              src={dataUrl}
              alt={`QR code for ${urlLabel}`}
              width={280}
              height={280}
            />
          ) : (
            <div className="deep-link-modal__loading">
              <span className="deep-link-modal__spinner" aria-hidden="true" />
              <p>Cooking your code…</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="deep-link-modal__download"
          onClick={handleDownload}
          disabled={!canDownload}
        >
          Download PNG
        </button>
      </div>
    </div>,
    document.body,
  );
}
