// Leitura lazy de variaveis de ambiente (so no servidor, nunca NEXT_PUBLIC_).
// Lida em tempo de requisicao para funcionar no runtime do Cloudflare/OpenNext.
export function env(name: "SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY" | "ADMIN_SESSION_SECRET"): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variavel de ambiente ausente: ${name}`);
  return value;
}
