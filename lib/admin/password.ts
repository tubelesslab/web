// Hash: pbkdf2_sha256$<iter>$<salt_b64>$<hash_b64> (PBKDF2-HMAC-SHA256, 32 bytes).
// 100000 e o maximo de iteracoes aceito pelo Web Crypto no Cloudflare Workers.
const ITERATIONS = 100000;
const KEY_BYTES = 32;

// Hash ficticio com o mesmo formato, usado para igualar o tempo quando o e-mail nao existe.
export const DUMMY_HASH = `pbkdf2_sha256$${ITERATIONS}$AAAAAAAAAAAAAAAAAAAAAA==$${"A".repeat(43)}=`;

function toB64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array {
  let s = b64.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    KEY_BYTES * 8,
  );
  return new Uint8Array(bits);
}

export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, ITERATIONS);
  return `pbkdf2_sha256$${ITERATIONS}$${toB64(salt)}$${toB64(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterStr, saltB64, hashB64] = stored.split("$");
  const iterations = Number(iterStr);
  if (scheme !== "pbkdf2_sha256" || !Number.isInteger(iterations) || iterations < 1 || !saltB64 || !hashB64) {
    return false;
  }
  const expected = fromB64(hashB64);
  const actual = await derive(password, fromB64(saltB64), Math.min(iterations, ITERATIONS));
  return timingSafeEqual(actual, expected);
}
