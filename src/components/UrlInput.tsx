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
        URL
      </label>
      <div className={`url-input__field ${error ? "url-input__field--error" : ""}`}>
        <span className="url-input__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M10 14a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07L10 6.93"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <path
              d="M14 10a5 5 0 0 0-7.07 0L5.52 11.41a5 5 0 0 0 7.07 7.07L14 17.07"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          id={id}
          className="url-input__control"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
        />
      </div>
      {error ? (
        <p className="url-input__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : (
        <p className="url-input__hint" id={`${id}-hint`}>
          Protocol is optional. We add https when needed.
        </p>
      )}
    </div>
  );
}
