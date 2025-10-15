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
 * Get config from URL search params
 */
export function getConfigFromURL(): Partial<SceneConfig> | null {
  const params = new URLSearchParams(window.location.search);
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
  const url = new URL(window.location.href);
  url.searchParams.set('cfg', encoded);
  window.history.replaceState({}, '', url.toString());
}

/**
 * Copy shareable URL to clipboard
 */
export function copyShareableURL(config: SceneConfig): Promise<void> {
  const encoded = encodeConfigToURL(config);
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('cfg', encoded);

  return navigator.clipboard.writeText(url.toString());
}
