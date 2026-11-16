const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/+$/, "");

export type FaqEntry = {
  question: string;
  answer: string;
};

/** Rendered on the page and emitted as FAQPage structured data, so both stay identical. */
export const faq: FaqEntry[] = [
  {
    question: "How do I make a QR code?",
    answer:
      "Paste your link into the box above: a website, menu, form, or social profile. Your QR code appears instantly, with the site's favicon in the center when one is available. Then press Download PNG to save a crisp 512 × 512 image, free and with no watermark.",
  },
  {
    question: "Is Qrbie really free?",
    answer:
      "Yes. There is no account, no trial, no watermark, and no limit on how many QR codes you make or download.",
  },
  {
    question: "Do the QR codes expire?",
    answer:
      "No. Qrbie makes static QR codes: your link is written directly into the pattern, with no redirect service in between that could be switched off. The code keeps working for as long as your link does.",
  },
  {
    question: "Can I use the QR codes for my business?",
    answer:
      "Yes. Put them on menus, flyers, posters, packaging, business cards, or slides. The codes you make are yours to use however you like.",
  },
  {
    question: "Is my link kept private?",
    answer:
      "Yes. Your QR code is generated on your device, right in this browser. Qrbie only records an anonymous download count, never the links you encode.",
  },
  {
    question: "Can I link to Qrbie with my URL already filled in?",
    answer: `Yes. Add your link to the address as a url parameter, for example ${SITE_URL}/?url=https://example.com. Qrbie opens with the QR code ready to download, so you can send people straight to it from your own app, docs, or emails. Encode the link first if it contains its own ? or & characters.`,
  },
  {
    question: "What size is the download?",
    answer:
      "Each code downloads as a 512 × 512 pixel PNG with a quiet border, sharp on screens and in print at the sizes used for flyers, menus, and cards.",
  },
  {
    question: "Do I need to type https://?",
    answer:
      "No. Paste or type any web address and Qrbie adds https:// when it is missing.",
  },
  {
    question: "Will the code scan on iPhone and Android?",
    answer:
      "Yes. The built-in camera app on iPhone and Android reads Qrbie codes, as does any standard QR scanner.",
  },
];
