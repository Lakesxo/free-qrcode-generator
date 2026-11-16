import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.tsx";
import { faq } from "./content/faq";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export function structuredData(siteUrl: string) {
  const home = `${siteUrl}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: "Qrbie",
        alternateName: "Qrbie Free QR Code Generator",
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${home}#app`,
        name: "Qrbie Free QR Code Generator",
        url: home,
        description:
          "A free QR code generator that turns any link into a QR code in your browser. No sign-up, no watermark, and static codes that never expire.",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript and a modern web browser.",
        isAccessibleForFree: true,
        image: `${siteUrl}/og.png`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Free QR codes from any link",
          "No sign-up and no watermark",
          "Static QR codes that never expire",
          "Site favicon in the center of the code",
          "512 × 512 PNG download",
          "Generated privately in the browser",
        ],
        creator: {
          "@type": "Person",
          name: "Ridwan Ajanaku",
          url: "https://olakunle.dev",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${home}#faq`,
        mainEntity: faq.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.answer,
          },
        })),
      },
    ],
  };
}
