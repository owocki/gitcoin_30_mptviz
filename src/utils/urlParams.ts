import { SceneConfig } from '../types/config';

/**
 * Encode config to base64url format for URL
 */
export function encodeConfigToURL(config: SceneConfig): string {
  const json = JSON.stringify(config);
  const base64 = btoa(json);
  // Convert to base64url (URL-safe)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode config from base64url format
 */
export function decodeConfigFromURL(encoded: string): Partial<SceneConfig> | null {
  try {
    // Convert from base64url to base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if necessary
    while (base64.length % 4) {
      base64 += '=';
    }
    const json = atob(base64);
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decode config from URL:', e);
    return null;
  }
}

/**
 * Get config from URL search params (supports both hash-based and regular query params)
 */
export function getConfigFromURL(): Partial<SceneConfig> | null {
  // Check hash first (for #create?cfg=... format)
  const hash = window.location.hash.slice(1); // Remove '#'
  let params: URLSearchParams;

  if (hash.includes('?')) {
    // Extract query string from hash (e.g., "create?cfg=..." -> "cfg=...")
    const queryString = hash.split('?')[1];
    params = new URLSearchParams(queryString);
  } else {
    // Fall back to regular search params
    params = new URLSearchParams(window.location.search);
  }

  const cfg = params.get('cfg');

  if (cfg) {
    return decodeConfigFromURL(cfg);
  }

  // Also support simple overrides
  const overrides: Partial<SceneConfig> = {};
  let hasOverrides = false;

  const title = params.get('title');
  if (title) {
    overrides.labels = { ...overrides.labels, title } as any;
    hasOverrides = true;
  }

  const balls = params.get('balls');
  if (balls) {
    const count = parseInt(balls, 10);
    if (!isNaN(count)) {
      overrides.balls = { ...overrides.balls, count } as any;
      hasOverrides = true;
    }
  }

  return hasOverrides ? overrides : null;
}

/**
 * Update URL with current config (without reloading page)
 */
export function updateURLWithConfig(config: SceneConfig): void {
  const encoded = encodeConfigToURL(config);
  const newUrl = `${window.location.origin}${window.location.pathname}#create?cfg=${encoded}`;
  window.history.replaceState({}, '', newUrl);
}

/**
 * Copy shareable URL to clipboard
 */
export function copyShareableURL(config: SceneConfig): Promise<void> {
  const encoded = encodeConfigToURL(config);
  const shareUrl = `${window.location.origin}/#create?cfg=${encoded}`;

  return navigator.clipboard.writeText(shareUrl);
}

/**
 * Extract config from a full URL string (supports both hash-based and regular query params)
 */
export function getConfigFromURLString(urlString: string): Partial<SceneConfig> | null {
  try {
    const url = new URL(urlString);

    // First check regular search params (old format: ?cfg=...)
    let cfg = url.searchParams.get('cfg');

    // If not found, check hash for query params (new format: #create?cfg=...)
    if (!cfg && url.hash) {
      const hash = url.hash.slice(1); // Remove '#'
      if (hash.includes('?')) {
        const queryString = hash.split('?')[1];
        const params = new URLSearchParams(queryString);
        cfg = params.get('cfg');
      }
    }

    if (cfg) {
      return decodeConfigFromURL(cfg);
    }
    return null;
  } catch (e) {
    console.error('Failed to parse URL:', e);
    return null;
  }
}

/**
 * Copy preview image URL to clipboard
 */
export function copyPreviewImageURL(config: SceneConfig): Promise<void> {
  const encoded = encodeConfigToURL(config);
  const previewUrl = `${window.location.origin}/api/preview?cfg=${encoded}`;

  return navigator.clipboard.writeText(previewUrl);
}
