"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/admin/guard";
import {
  createMilestone,
  createSpend,
  deleteMilestone,
  deleteSpend,
  refreshAcquisition,
} from "@/lib/admin/acquisition";
import { isDate, validateMilestone, validateSpend } from "@/lib/admin/acquisition-validate";

export type Result = { ok: true; message?: string } | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });
const GENERIC = "Não foi possível falar com o Supabase. Tente de novo.";

type Range = { from: unknown; to: unknown };

// Recalcula o snapshot do periodo em tela para os numeros refletirem a escrita.
async function recompute(r: Range): Promise<void> {
  if (isDate(r.from) && isDate(r.to) && r.from <= r.to) await refreshAcquisition(r.from, r.to);
  revalidatePath("/admin/aquisicao");
}

const idOf = (v: unknown): string | null => {
  const s = typeof v === "string" || typeof v === "number" ? String(v) : "";
  return /^\d{1,18}$/.test(s) ? s : null;
};

export async function refreshAcquisitionAction(from: unknown, to: unknown): Promise<Result> {
  await requireSession();
  if (!isDate(from) || !isDate(to) || from > to) return fail("Período inválido.");
  try {
    await recompute({ from, to });
    return { ok: true };
  } catch {
    return fail(GENERIC);
  }
}

export async function addSpendAction(input: unknown, range: Range): Promise<Result> {
  const { email } = await requireSession(); // created_by sempre da sessao
  const v = validateSpend(input);
  if (!v.ok) return v;
  try {
    await createSpend(v.value, email);
    await recompute(range);
    return { ok: true, message: "Gasto lançado." };
  } catch {
    return fail(GENERIC);
  }
}

export async function deleteSpendAction(id: unknown, range: Range): Promise<Result> {
  await requireSession();
  const sid = idOf(id);
  if (!sid) return fail("Registro inválido.");
  try {
    await deleteSpend(sid);
    await recompute(range);
    return { ok: true, message: "Gasto removido." };
  } catch {
    return fail(GENERIC);
  }
}

export async function addMilestoneAction(input: unknown, range: Range): Promise<Result> {
  const { email } = await requireSession();
  const v = validateMilestone(input);
  if (!v.ok) return v;
  try {
    await createMilestone(v.value, email);
    await recompute(range);
    return { ok: true, message: "Marco adicionado." };
  } catch {
    return fail(GENERIC);
  }
}

export async function deleteMilestoneAction(id: unknown, range: Range): Promise<Result> {
  await requireSession();
  const mid = idOf(id);
  if (!mid) return fail("Registro inválido.");
  try {
    await deleteMilestone(mid);
    await recompute(range);
    return { ok: true, message: "Marco removido." };
  } catch {
    return fail(GENERIC);
  }
}
