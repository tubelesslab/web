import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCredentials } from "./supabase";
import { COOKIE_NAME, verifySession } from "./session";

// Validacao completa no servidor (o middleware so confere assinatura e expiracao).
// Recusa cookies emitidos antes da ultima troca de senha (iat < password_changed_at).
export async function requireSession(opts: { allowMustChange?: boolean } = {}): Promise<{ email: string }> {
  const jar = await cookies();
  const session = await verifySession(jar.get(COOKIE_NAME)?.value);
  if (!session) redirect("/admin/login");

  const row = await getCredentials(session.email);
  if (!row) redirect("/admin/login");
  if (row.password_changed_at && session.iat < Math.floor(Date.parse(row.password_changed_at) / 1000)) {
    redirect("/admin/login");
  }
  if (!opts.allowMustChange && (row.must_change_password || session.mustChange)) redirect("/admin/senha");
  return { email: session.email };
}
