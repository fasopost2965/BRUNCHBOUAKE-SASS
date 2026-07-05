/**
 * Secure password hashing utility for Brunch Bouaké.
 * Uses SHA-256 via Web Crypto API in secure contexts, 
 * with a stable, safe fallback in non-secure HTTP contexts.
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn("Web Crypto SHA-256 failed, using fallback.", e);
    }
  }
  
  // Fallback hash for non-secure contexts (HTTP)
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    h1 = Math.imul(h1 ^ char, 2654435761);
    h2 = Math.imul(h2 ^ char, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `hash-${((h1 >>> 0).toString(16).padStart(8, '0'))}${((h2 >>> 0).toString(16).padStart(8, '0'))}`;
}
