import "./UrlInput.css";

type UrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  id?: string;
};

export function UrlInput({ value, onChange, error, id = "url-input" }: UrlInputProps) {
  return (
    <div className="url-input">
      <label className="url-input__label" htmlFor={id}>
        Your link
      </label>
      <div className={`url-input__field ${error ? "url-input__field--error" : ""}`}>
        <span className="url-input__icon" aria-hidden="true">
          🔗
        </span>
        <input
          id={id}
          className="url-input__control"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://your-awesome-site.com"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error ? (
        <p className="url-input__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : (
        <p className="url-input__hint">We&apos;ll add https:// if you forget it.</p>
      )}
    </div>
  );
}
