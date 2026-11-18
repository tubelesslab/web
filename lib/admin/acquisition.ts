import { sb, type Snapshot } from "./supabase";
import type { MilestoneInput, SpendInput } from "./acquisition-validate";

// Acesso ao REST do Supabase para o bloco Aquisicao. Uso exclusivo no servidor.

// Ultimo snapshot de aquisicao exatamente deste periodo (ou null).
export async function getAcquisitionSnapshot(from: string, to: string): Promise<Snapshot | null> {
  const q =
    "admin_kpi_snapshots?select=id,data,created_at" +
    "&data->>kind=eq.acquisition" +
    `&data->>from=eq.${encodeURIComponent(from)}` +
    `&data->>to=eq.${encodeURIComponent(to)}` +
    "&order=id.desc&limit=1";
  const rows = (await (await sb(q)).json()) as Snapshot[];
  return rows[0] ?? null;
}

// Calcula e grava um novo snapshot do periodo.
export async function refreshAcquisition(from: string, to: string): Promise<void> {
  await sb("rpc/admin_refresh_acquisition", {
    method: "POST",
    body: JSON.stringify({ p_from: from, p_to: to }),
  });
}

export async function createSpend(row: SpendInput, createdBy: string): Promise<void> {
  await sb("ad_spend", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      start_date: row.startDate,
      end_date: row.endDate,
      campaign: row.campaign,
      amount_brl: row.amountBrl,
      note: row.note || null,
      created_by: createdBy,
    }),
  });
}

export async function deleteSpend(id: string): Promise<void> {
  await sb(`ad_spend?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}

export async function createMilestone(row: MilestoneInput, createdBy: string): Promise<void> {
  await sb("acquisition_milestones", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ day: row.day, kind: row.kind, label: row.label, created_by: createdBy }),
  });
}

export async function deleteMilestone(id: string): Promise<void> {
  await sb(`acquisition_milestones?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
}
