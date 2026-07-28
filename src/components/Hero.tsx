import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getDeepLinkUrlParam } from "../lib/deepLink";
import { useUrlValidation } from "../hooks/useUrlValidation";
import { useQrCode } from "../hooks/useQrCode";
import { UrlInput } from "./UrlInput";
import { QrPreview } from "./QrPreview";
import { DeepLinkQrModal } from "./DeepLinkQrModal";
import "./Hero.css";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const [openedViaDeepLink] = useState(() => getDeepLinkUrlParam() !== null);

  const [urlInput, setUrlInput] = useState(() => getDeepLinkUrlParam() ?? "");
  const [deepLinkModalDismissed, setDeepLinkModalDismissed] = useState(false);

  const validation = useUrlValidation(urlInput);
  const qrState = useQrCode(
    validation.valid ? validation.normalized : null,
    validation.valid,
    { debounceMs: openedViaDeepLink ? 0 : 300 },
  );

  const heroRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const showDeepLinkModal =
    openedViaDeepLink && validation.valid && !deepLinkModalDismissed;

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: "back.out(1.4)" } });

      tl.from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.5 })
        .from(".hero__title", { y: 36, opacity: 0, duration: 0.65 }, "-=0.25")
        .from(".hero__subtitle", { y: 24, opacity: 0, duration: 0.5 }, "-=0.35")
        .from(copyRef.current, { x: -24, opacity: 0, duration: 0.55 }, "-=0.2")
        .from(
          previewRef.current,
          { x: 24, opacity: 0, scale: 0.94, duration: 0.6 },
          "-=0.45",
        );
    },
    { scope: heroRef },
  );

  const dataUrl = qrState.status === "ready" ? qrState.dataUrl : null;
  const isLoading = qrState.status === "loading";
  const isReady = qrState.status === "ready";
  const canDownload = isReady && Boolean(dataUrl);

  return (
    <section className="hero" ref={heroRef}>
      <DeepLinkQrModal
        open={showDeepLinkModal}
        onClose={() => setDeepLinkModalDismissed(true)}
        dataUrl={dataUrl}
        isLoading={isLoading}
        isReady={isReady}
        urlLabel={validation.normalized}
      />

      <div className="hero__copy" ref={copyRef}>
        <p className="hero__eyebrow">Free · instant · browser-only</p>
        <h1 className="hero__title">
          Turn any link into a{" "}
          <span className="hero__title-accent">scannable QR</span>
        </h1>
        <p className="hero__subtitle">
          Paste your URL, watch the preview appear, and download a PNG you can
          drop on posters, slides, or stickers.
        </p>

        <UrlInput
          value={urlInput}
          onChange={setUrlInput}
          error={validation.error}
        />
      </div>

      <div className="hero__preview" ref={previewRef}>
        <QrPreview
          dataUrl={dataUrl}
          isLoading={isLoading}
          isReady={isReady}
          urlLabel={validation.normalized || "your link"}
          canDownload={canDownload}
        />
      </div>
    </section>
  );
}
