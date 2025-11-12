/**
 * Storage helpers with safe JSON parsing.
 */

// PUBLIC_INTERFACE
export function getLocalJSON(key, defaultValue) {
  /** Safely read JSON from localStorage or return defaultValue. */
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return defaultValue;
    const parsed = JSON.parse(raw);
    return parsed ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

// PUBLIC_INTERFACE
export function setLocalJSON(key, value) {
  /** Safely write JSON to localStorage. */
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors (quota/disabled)
  }
}
