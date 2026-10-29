import { env } from "./env";

// fetch puro contra o REST do Supabase. Uso exclusivo no servidor.
export async function sb(path: string, init: RequestInit = {}): Promise<Response> {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(`${env("SUPABASE_URL")}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) throw new Error(`Supabase respondeu ${res.status} em ${path.split("?")[0]}`);
  return res;
}

export type Snapshot = {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  created_at: string;
};

export async function getLatestSnapshot(): Promise<Snapshot | null> {
  const res = await sb("admin_kpi_snapshots?select=id,data,created_at&order=id.desc&limit=1");
  const rows = (await res.json()) as Snapshot[];
  return rows[0] ?? null;
}

export async function refreshSnapshot(): Promise<void> {
  await sb("rpc/admin_refresh_kpis", { method: "POST", body: "{}" });
}

export type Credentials = {
  email: string;
  password_hash: string;
  must_change_password: boolean;
  failed_attempts: number;
  locked_until: string | null;
  last_login_at: string | null;
  password_changed_at: string | null;
};

export async function getCredentials(email: string): Promise<Credentials | null> {
  const res = await sb(`admin_credentials?email=eq.${encodeURIComponent(email)}&select=*`);
  const rows = (await res.json()) as Credentials[];
  return rows[0] ?? null;
}

export async function patchCredentials(email: string, patch: Partial<Credentials>): Promise<void> {
  await sb(`admin_credentials?email=eq.${encodeURIComponent(email)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
}
