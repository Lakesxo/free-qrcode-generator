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
      document.documentElement.classList.remove("intro-pending");

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.7 },
      });

      tl.from(".hero__eyebrow", { y: 16, opacity: 0, duration: 0.45 })
        .from(".hero__title-main", { y: 28, opacity: 0 }, "-=0.28")
        .from(".hero__subtitle", { y: 18, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(copyRef.current, { y: 12, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(
          previewRef.current,
          { y: 20, opacity: 0, duration: 0.65 },
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
        <h1 className="hero__title">
          <span className="hero__eyebrow">Free QR code generator</span>
          <span className="hero__title-main">
            Paste a link.
            <br />
            <em className="hero__title-accent">Get a QR.</em>
          </span>
        </h1>
        <p className="hero__subtitle">
          Turn any link into a QR code in seconds. No{" "}
          <span className="hero__nowrap">sign-up</span>, no watermark,
          and it never expires. Download a crisp PNG, made right in your
          browser.
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
