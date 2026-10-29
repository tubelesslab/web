import { cookies } from "next/headers";
import { COOKIE_NAME, SESSION_SECONDS, createSessionToken } from "./session";

export async function setSessionCookie(email: string, mustChange: boolean, iatMs = Date.now()): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, await createSessionToken(email, mustChange, iatMs), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/admin", maxAge: 0 });
}
