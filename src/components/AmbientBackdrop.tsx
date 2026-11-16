import "./AmbientBackdrop.css";

/** Soft vignette and film grain. */
export function AmbientBackdrop() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__vignette" />
      <div className="ambient__grain" />
    </div>
  );
}
