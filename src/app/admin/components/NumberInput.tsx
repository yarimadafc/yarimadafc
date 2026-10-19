'use client';
import { useState } from 'react';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  value: number;
  onChange: (value: number) => void;
};

// Number field that can be cleared and retyped: the text is kept as typed while the field is focused
// (an empty field no longer jumps back to "0"), and focusing selects the old value so typing replaces it.
export default function NumberInput({ value, onChange, onFocus, onBlur, ...rest }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      type="number"
      inputMode="numeric"
      {...rest}
      value={draft ?? (Number.isFinite(value) ? String(value) : '')}
      onFocus={e => { e.currentTarget.select(); onFocus?.(e); }}
      onChange={e => {
        const text = e.target.value;
        setDraft(text);
        const n = Number(text);
        onChange(text === '' || !Number.isFinite(n) ? 0 : n);
      }}
      onBlur={e => { setDraft(null); onBlur?.(e); }}
    />
  );
}
