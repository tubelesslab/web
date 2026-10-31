import { sb } from "./supabase";
import type { Audience, AudienceCount, Campaign, Product } from "./push-validate";

// Acesso ao REST do Supabase para campanhas de push. Uso exclusivo no servidor.

const toNum = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);

export async function audienceCount(audience: Audience): Promise<AudienceCount> {
  const res = await sb("rpc/admin_push_audience_count", {
    method: "POST",
    body: JSON.stringify({ p_audience: audience }),
  });
  const raw = (await res.json()) as unknown;
  const r = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown> | null;
  return {
    users: toNum(r?.users),
    devices: toNum(r?.devices),
    opted_in_total: toNum(r?.opted_in_total),
    with_token_total: toNum(r?.with_token_total),
  };
}

export async function listCampaigns(): Promise<Campaign[]> {
  const res = await sb("rpc/admin_push_campaigns", { method: "POST", body: "{}" });
  const raw = (await res.json()) as unknown;
  return Array.isArray(raw) ? (raw as Campaign[]) : [];
}

export async function listShopProducts(): Promise<Product[]> {
  const res = await sb("shop_products?select=id,title,category&active=eq.true&order=category,sort_order");
  const raw = (await res.json()) as unknown;
  return Array.isArray(raw) ? (raw as Product[]) : [];
}

export type NewCampaign = {
  title_pt: string;
  body_pt: string;
  title_en: string | null;
  body_en: string | null;
  target: string;
  product_id: string | number | null;
  audience: Audience;
  is_test: boolean;
  test_email: string | null;
  scheduled_at: string;
  status: "scheduled";
  created_by: string;
};

export async function createCampaign(row: NewCampaign): Promise<void> {
  await sb("push_campaigns", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
}

// true se cancelou; false se nenhuma linha mudou (a campanha ja saiu de "scheduled").
export async function cancelCampaign(id: string): Promise<boolean> {
  const res = await sb(`push_campaigns?id=eq.${encodeURIComponent(id)}&status=eq.scheduled`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status: "cancelled" }),
  });
  const rows = (await res.json()) as unknown;
  return Array.isArray(rows) && rows.length > 0;
}
