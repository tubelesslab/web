"use server";

import { redirect } from "next/navigation";
import { setSessionCookie } from "@/lib/admin/cookie";
import { isLocked, registerFailure, registerSuccess } from "@/lib/admin/lockout";
import { DUMMY_HASH, verifyPassword } from "@/lib/admin/password";
import { getCredentials } from "@/lib/admin/supabase";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fail(): Promise<never> {
  await sleep(1000);
  redirect("/admin/login?erro=1");
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").slice(0, 1024);

  if (!email || !password || email.length > 254) {
    await verifyPassword(password, DUMMY_HASH);
    return fail();
  }

  const row = await getCredentials(email);
  if (!row) {
    // e-mail inexistente: mesmo custo de PBKDF2 do caso existente
    await verifyPassword(password, DUMMY_HASH);
    return fail();
  }
  if (isLocked(row)) {
    await verifyPassword(password, DUMMY_HASH);
    return fail();
  }

  if (!(await verifyPassword(password, row.password_hash))) {
    await registerFailure(row);
    return fail();
  }

  await registerSuccess(email);
  await setSessionCookie(email, row.must_change_password);
  redirect(row.must_change_password ? "/admin/senha" : "/admin");
}
