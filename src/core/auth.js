/**
 * Authentication & App Security Layer — V4 Architecture
 * Handles master password verification, hashing, session management, and app locking.
 */

import { storage, KEYS } from './storage.js';

// Auth Storage Keys
export const AUTH_KEYS = {
  SESSION_STORAGE_KEY: 'ceritametro.auth.session',
  LOCAL_STORAGE_REMEMBER_KEY: 'ceritametro.auth.remember',
  LOCAL_PASSWORD_HASH_KEY: 'ceritametro.auth.local_hash'
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
  if (typeof __APP_PASSWORD_HASH__ !== 'undefined' && __APP_PASSWORD_HASH__ && __APP_PASSWORD_HASH__.trim() !== '') {
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
  // If no password is configured anywhere, open access is allowed
  if (!isAuthRequired()) {
    return true;
  }

  const expectedHash = getMasterPasswordHash();
  const expectedToken = expectedHash.slice(0, 24);

  // 1. Check current tab sessionStorage
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

  // 2. Check persistent localStorage if "Remember Me" was checked
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
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function loginWithPassword(inputPassword, rememberMe = false) {
  if (!inputPassword || !inputPassword.trim()) {
    return { success: false, error: 'Masukkan password terlebih dahulu.' };
  }

  const expectedHash = getMasterPasswordHash();
  if (!expectedHash) {
    return { success: false, error: 'Password belum dikonfigurasi di GitHub Secret atau Pengaturan.' };
  }

  const inputHash = await sha256Hex(inputPassword);

  if (inputHash.toLowerCase() !== expectedHash.toLowerCase()) {
    return { success: false, error: 'Password salah! Periksa kembali password Anda.' };
  }

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
