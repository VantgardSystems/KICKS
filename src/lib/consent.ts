/** Consentimiento de cookies guardado en localStorage. */

export type Consent = { analytics: boolean; decidedAt: string };

const KEY = "vg-consent";
export const CONSENT_EVENT = "vg:consent";
export const OPEN_CONSENT_EVENT = "vg:open-consent";

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean) {
  const consent: Consent = { analytics, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(consent));
  } catch {
    /* sin almacenamiento: el banner volverá a salir */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
