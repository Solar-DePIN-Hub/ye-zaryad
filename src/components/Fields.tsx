import { useEffect, useId, useState } from "react";
import { checkName, checkNumber, NAME_MAX } from "../domain/validate";
import { strings } from "../strings";

interface NumberProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onValid: (value: number) => void;
}

/**
 * A number input that keeps what the person typed, shows a plain error under the field,
 * and only passes valid numbers to the plan. The plan keeps the last valid number.
 */
export function NumberField({ label, value, min, max, step, unit, onValid }: NumberProps) {
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  useEffect(() => {
    // Follow outside changes (preset added, plan reloaded) unless the field holds an error.
    if (!error) setDraft(String(value));
  }, [value, error]);

  function change(raw: string) {
    setDraft(raw);
    const result = checkNumber(raw, min, max);
    if (result.ok) {
      setError(null);
      onValid(result.value);
    } else {
      setError(
        result.reason === "empty"
          ? strings.errNumberEmpty(min, max, unit)
          : strings.errNumberRange(min, max, unit),
      );
    }
  }

  return (
    <label className={error ? "invalid" : undefined}>
      {label}
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={draft}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => change(event.target.value)}
        onBlur={() => {
          if (error) {
            setError(null);
            setDraft(String(value));
          }
        }}
      />
      {error && (
        <span className="field-error" id={errorId} role="status">
          {error}
        </span>
      )}
    </label>
  );
}

interface NameProps {
  value: string;
  onValid: (value: string) => void;
}

export function NameField({ value, onValid }: NameProps) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  useEffect(() => {
    if (!error) setDraft(value);
  }, [value, error]);

  function change(raw: string) {
    setDraft(raw);
    const result = checkName(raw);
    if (result.ok) {
      setError(null);
      onValid(raw.slice(0, NAME_MAX));
    } else {
      setError(result.reason === "empty" ? strings.errNameEmpty : strings.errNameLong(NAME_MAX));
    }
  }

  return (
    <label className={error ? "field invalid" : "field"}>
      {strings.name}
      <input
        type="text"
        value={draft}
        maxLength={NAME_MAX + 10}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => change(event.target.value)}
        onBlur={() => {
          if (error) {
            setError(null);
            setDraft(value);
          }
        }}
      />
      {error && (
        <span className="field-error" id={errorId} role="status">
          {error}
        </span>
      )}
    </label>
  );
}
