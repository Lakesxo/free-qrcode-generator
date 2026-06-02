import "./TrustStrip.css";

export function TrustStrip() {
  return (
    <div className="trust-strip" role="note">
      <span className="trust-strip__icon" aria-hidden="true">
        🔒
      </span>
      <p>
        <strong>100% in your browser.</strong> Your link never leaves this tab —
        we generate the QR locally on your device.
      </p>
    </div>
  );
}
