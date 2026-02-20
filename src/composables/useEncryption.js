/**
 * useEncryption
 * Encrypt and decrypt data using AES-256-GCM
 * Stores salt + iv + ciphertext in one Base64 string
 */

export function useEncryption() {

  const ivLength = 12; // Standard for AES-GCM

  /**
   * Convert ArrayBuffer to Base64
   */
  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
  }

  /**
   * Convert Base64 to ArrayBuffer
   */
  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  /**
   * Encrypt content (string or JSON) with AES-256-GCM
   * @param {string|object} input
   * @param {CryptoKey} key
   * @param {Uint8Array} salt
   */
  async function encrypt(input, key, salt) {

    const encoder = new TextEncoder();
    const data = typeof input === "string"
      ? encoder.encode(input)
      : encoder.encode(JSON.stringify(input));

    const iv = crypto.getRandomValues(new Uint8Array(ivLength));

    const cipherBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      data
    );

    // Combine salt + iv + ciphertext
    const combined = new Uint8Array(
      salt.byteLength + iv.byteLength + cipherBuffer.byteLength
    );

    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(new Uint8Array(cipherBuffer), salt.byteLength + iv.byteLength);

    // Base64 output
    return arrayBufferToBase64(combined.buffer);
  }

  /**
   * Decrypt Base64 encrypted string
   * @param {string} encryptedText
   * @param {CryptoKey} key
   */
  async function decrypt(encryptedText, key) {

    // Get combined buffer
    const combined = base64ToArrayBuffer(encryptedText);

    // Extract salt, iv, and ciphertext
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 16 + ivLength);
    const ciphertext = combined.slice(16 + ivLength);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  return {
    encrypt,
    decrypt
  };
}
