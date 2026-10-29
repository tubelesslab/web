"use server";

import { redirect } from "next/navigation";
import { setSessionCookie } from "@/lib/admin/cookie";
import { requireSession } from "@/lib/admin/guard";
import { isLocked, registerFailure } from "@/lib/admin/lockout";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { getCredentials, patchCredentials } from "@/lib/admin/supabase";

export async function changePasswordAction(formData: FormData): Promise<void> {
  const { email } = await requireSession({ allowMustChange: true });
  const atual = String(formData.get("atual") ?? "").slice(0, 1024);
  const nova = String(formData.get("nova") ?? "").slice(0, 1024);
  const confirmacao = String(formData.get("confirmacao") ?? "").slice(0, 1024);

  const row = await getCredentials(email);
  if (!row) redirect("/admin/login");

  if (isLocked(row) || !(await verifyPassword(atual, row.password_hash))) {
    if (!isLocked(row)) await registerFailure(row);
    redirect("/admin/senha?erro=atual");
  }
  if (nova.length < 12) redirect("/admin/senha?erro=curta");
  if (nova !== confirmacao) redirect("/admin/senha?erro=confirmacao");
  if (nova === atual) redirect("/admin/senha?erro=igual");

  // iat do novo cookie == password_changed_at (em segundos), para o guard aceitar a sessao
  const now = new Date();
  await patchCredentials(email, {
    password_hash: await hashPassword(nova),
    must_change_password: false,
    password_changed_at: now.toISOString(),
    failed_attempts: 0,
    locked_until: null,
  });
  await setSessionCookie(email, false, now.getTime());
  redirect("/admin");
}
