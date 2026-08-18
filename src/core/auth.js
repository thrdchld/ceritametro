/**
 * Authentication & App Security Layer — V4 Architecture
 * Handles master password verification, hashing, session management, and app locking.
 */

import { storage, KEYS } from './storage.js';

// Auth Storage Keys
export const AUTH_KEYS = {
  SESSION_STORAGE_KEY: 'ceritametro.auth.session',
  LOCAL_STORAGE_REMEMBER_KEY: 'ceritametro.auth.remember',
  LOCAL_PASSWORD_HASH_KEY: 'ceritametro.auth.local_hash',
  MANUAL_LOCK_FLAG: 'ceritametro.auth.manually_locked'
};

/**
 * Computes SHA-256 hex string from text using standard Web Crypto API
 * @param {string} text 
 * @returns {Promise<string>}
 */
export async function sha256Hex(text) {
  if (!text) return '';
  const msgUint8 = new TextEncoder().encode(text.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Gets configured master password hash from build-time injection (GitHub Secret)
 * or fallback local storage configuration.
 * @returns {string}
 */
export function getMasterPasswordHash() {
  // 1. Injected at build time via GitHub Secret (esbuild / Vite define)
  if (typeof __APP_PASSWORD_HASH__ !== 'undefined' && __APP_PASSWORD_HASH__ && typeof __APP_PASSWORD_HASH__ === 'string' && __APP_PASSWORD_HASH__.trim() !== '') {
    return __APP_PASSWORD_HASH__.trim();
  }

  // 2. Global window configuration if present
  if (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.passwordHash) {
    return window.__APP_CONFIG__.passwordHash.trim();
  }

  // 3. Fallback locally configured password hash
  const localHash = storage.get(AUTH_KEYS.LOCAL_PASSWORD_HASH_KEY);
  if (localHash && typeof localHash === 'string' && localHash.trim() !== '') {
    return localHash.trim();
  }

  return '';
}

/**
 * Returns the source of the active password protection
 * @returns {'github_secret' | 'local_storage' | 'none'}
 */
export function getAuthSource() {
  if (typeof __APP_PASSWORD_HASH__ !== 'undefined' && __APP_PASSWORD_HASH__ && typeof __APP_PASSWORD_HASH__ === 'string' && __APP_PASSWORD_HASH__.trim() !== '') {
    return 'github_secret';
  }
  const localHash = storage.get(AUTH_KEYS.LOCAL_PASSWORD_HASH_KEY);
  if (localHash && typeof localHash === 'string' && localHash.trim() !== '') {
    return 'local_storage';
  }
  return 'none';
}

/**
 * Checks if authentication protection is active (has a configured hash)
 * @returns {boolean}
 */
export function isAuthRequired() {
  return getMasterPasswordHash() !== '';
}

/**
 * Checks if user is currently authenticated and unlocked
 * @returns {boolean}
 */
export function isAuthenticated() {
  // 1. Check if user manually locked the app
  try {
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem(AUTH_KEYS.MANUAL_LOCK_FLAG) === 'true') {
        return false;
      }
    }
  } catch (e) {}

  // 2. If no password is configured and not manually locked, open access is allowed
  if (!isAuthRequired()) {
    return true;
  }

  const expectedHash = getMasterPasswordHash();
  const expectedToken = expectedHash.slice(0, 24);

  // 3. Check current tab sessionStorage
  try {
    if (typeof sessionStorage !== 'undefined') {
      const sessionRaw = sessionStorage.getItem(AUTH_KEYS.SESSION_STORAGE_KEY);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        if (session && session.token === expectedToken && session.authenticated) {
          return true;
        }
      }
    }
  } catch (e) {}

  // 4. Check persistent localStorage if "Remember Me" was checked
  try {
    if (typeof localStorage !== 'undefined') {
      const rememberRaw = localStorage.getItem(AUTH_KEYS.LOCAL_STORAGE_REMEMBER_KEY);
      if (rememberRaw) {
        const remember = JSON.parse(rememberRaw);
        if (remember && remember.token === expectedToken && remember.authenticated) {
          return true;
        }
      }
    }
  } catch (e) {}

  return false;
}

/**
 * Verifies entered password and unlocks the application
 * @param {string} inputPassword 
 * @param {boolean} rememberMe 
 * @returns {Promise<{ success: boolean, error?: string, isNewlySet?: boolean }>}
 */
export async function loginWithPassword(inputPassword, rememberMe = false) {
  if (!inputPassword || !inputPassword.trim()) {
    return { success: false, error: 'Masukkan password terlebih dahulu.' };
  }

  let expectedHash = getMasterPasswordHash();

  // If no password configured yet, set this input as local master password and unlock!
  if (!expectedHash) {
    await setLocalPassword(inputPassword);
    expectedHash = await sha256Hex(inputPassword);
  } else {
    const inputHash = await sha256Hex(inputPassword);
    if (inputHash.toLowerCase() !== expectedHash.toLowerCase()) {
      return { success: false, error: 'Password salah! Periksa kembali password Anda.' };
    }
  }

  // Clear manual lock flag
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(AUTH_KEYS.MANUAL_LOCK_FLAG);
    }
  } catch (e) {}

  // Generate session payload
  const token = expectedHash.slice(0, 24);
  const sessionPayload = {
    authenticated: true,
    unlockedAt: Date.now(),
    token
  };

  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(AUTH_KEYS.SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
    }
    if (rememberMe && typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_KEYS.LOCAL_STORAGE_REMEMBER_KEY, JSON.stringify(sessionPayload));
    }
  } catch (err) {
    console.warn('Could not persist auth session:', err);
  }

  return { success: true };
}

/**
 * Immediately locks the application and clears session tokens
 */
export function lockApplication() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(AUTH_KEYS.SESSION_STORAGE_KEY);
      sessionStorage.setItem(AUTH_KEYS.MANUAL_LOCK_FLAG, 'true');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_KEYS.LOCAL_STORAGE_REMEMBER_KEY);
    }
  } catch (e) {}
}

/**
 * Sets or updates local password hash (used in settings for fallback/local protection)
 * @param {string} newPassword 
 */
export async function setLocalPassword(newPassword) {
  if (!newPassword || !newPassword.trim()) {
    storage.remove(AUTH_KEYS.LOCAL_PASSWORD_HASH_KEY);
    return true;
  }
  const hash = await sha256Hex(newPassword);
  storage.set(AUTH_KEYS.LOCAL_PASSWORD_HASH_KEY, hash);
  return true;
}
