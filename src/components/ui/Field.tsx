"use client";

import { useCallback, useState, type ReactNode } from "react";
import { rules, type RuleName } from "@/lib/validation";

/**
 * Estado de formulario con validación al salir del campo:
 * - nada se marca en rojo mientras escribes por primera vez
 * - el error se quita en cuanto vuelves a escribir
 * - al enviar se validan todos y el foco va al primer error
 */
export function useForm<T extends Record<string, string | boolean>>(initial: T, validated: (keyof T & RuleName)[]) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const check = useCallback(
    (name: keyof T & RuleName, value: string | boolean) => rules[name](String(value)),
    [],
  );

  const set = useCallback((name: keyof T, value: string | boolean) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  }, []);

  const blur = useCallback(
    (name: keyof T) => {
      if (!validated.includes(name as keyof T & RuleName)) return;
      const error = check(name as keyof T & RuleName, values[name]);
      setErrors((e) => ({ ...e, [name]: error ?? undefined }));
    },
    [check, validated, values],
  );

  /** Valida todo. Devuelve true si no hay errores; si los hay, enfoca el primero. */
  const validateAll = useCallback(
    (form?: HTMLElement | null) => {
      const next: Partial<Record<keyof T, string>> = {};
      for (const name of validated) {
        const error = check(name, values[name]);
        if (error) next[name] = error;
      }
      setErrors(next);
      const first = validated.find((n) => next[n]);
      if (first && form) {
        const el = form.querySelector<HTMLElement>(`[name="${String(first)}"]`);
        el?.focus({ preventScroll: true });
        el?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      return !first;
    },
    [check, validated, values],
  );

  return { values, errors, set, blur, validateAll, setErrors, setValues };
}

interface FieldProps {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
  idPrefix?: string;
}

export function Field({ label, name, error, hint, optional, children, idPrefix = "f" }: FieldProps) {
  const id = `${idPrefix}-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium text-paper">
        {label}
        {optional && <span className="font-normal text-mute">Opcional</span>}
      </label>
      {children({ id, name, "aria-invalid": Boolean(error), "aria-describedby": describedBy, className: "field" })}
      {/* El error ocupa el lugar de la ayuda: no se apilan. */}
      <p
        id={error ? `${id}-error` : `${id}-hint`}
        role={error ? "alert" : undefined}
        className={`mt-2 min-h-5 text-sm ${error ? "text-red-400" : "text-mute"}`}
      >
        {error ?? hint ?? ""}
      </p>
    </div>
  );
}

interface CheckProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
  idPrefix?: string;
  required?: boolean;
}

export function Checkbox({ name, checked, onChange, error, children, idPrefix = "f", required }: CheckProps) {
  const id = `${idPrefix}-${name}`;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[#FF6B1A]"
        />
        <label htmlFor={id} className="text-sm text-mute">
          {children}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 pl-8 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
