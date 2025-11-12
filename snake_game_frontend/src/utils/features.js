/**
 * Feature flags parsing from REACT_APP_FEATURE_FLAGS.
 * Example value: {"wrap": true}
 */

// PUBLIC_INTERFACE
export function getFeatureFlags() {
  /** Parse flags from env with safe defaults. */
  const raw = process.env.REACT_APP_FEATURE_FLAGS;
  if (!raw) return { wrap: false };
  try {
    const parsed = JSON.parse(raw);
    return {
      wrap: Boolean(parsed.wrap),
    };
  } catch {
    return { wrap: false };
  }
}
