import { env } from "./env";
import { timingSafeEqual } from "./password";

// Apenas Web Crypto: este arquivo tambem roda no middleware.
export const COOKIE_NAME = "tbls_admin";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

export type Session = {
  email: string;
  iat: number; // segundos
  exp: number; // segundos
  mustChange: boolean;
};

// Formato do cookie: email.iat.exp.mustChange.assinatura
// (o e-mail pode ter ".", entao o parse e feito da direita para a esquerda)
async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env("ADMIN_SESSION_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  let s = "";
  for (const b of sig) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSessionToken(email: string, mustChange: boolean, iatMs = Date.now()): Promise<string> {
  const iat = Math.floor(iatMs / 1000);
  const payload = `${email}.${iat}.${iat + SESSION_SECONDS}.${mustChange ? 1 : 0}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 5) return null;
  const sig = parts.pop()!;
  const mc = parts.pop()!;
  const exp = Number(parts.pop());
  const iat = Number(parts.pop());
  const email = parts.join(".");
  if (!email || !Number.isInteger(exp) || !Number.isInteger(iat) || (mc !== "0" && mc !== "1")) return null;

  const expected = await sign(`${email}.${iat}.${exp}.${mc}`);
  const enc = new TextEncoder();
  if (!timingSafeEqual(enc.encode(sig), enc.encode(expected))) return null;
  if (exp * 1000 <= Date.now()) return null;
  return { email, iat, exp, mustChange: mc === "1" };
}
