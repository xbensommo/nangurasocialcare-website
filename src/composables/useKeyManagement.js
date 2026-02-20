/**
 * useKeyManagement
 * Derive a CryptoKey from a password using PBKDF2
 * 
 * This does NOT store the key anywhere.
 * It is for runtime only.
 */

export function useKeyManagement() {

  /**
   * Generates random salt
   * @returns {Uint8Array}
   */
  function generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  /**
   * Derives a CryptoKey from a user password and salt
   * @param {string} password
   * @param {Uint8Array} salt
   */
  async function deriveKey(password, salt) {

    const encoder = new TextEncoder();

    // 1. Import password as raw key
    const baseKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    // 2. Derive AES-256-GCM key
    const aesKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 250000,
        hash: "SHA-256"
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    return aesKey;
  }

  return {
    generateSalt,
    deriveKey
  };
}
