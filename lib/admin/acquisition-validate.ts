// Validacao pura (sem I/O) do bloco Aquisicao. Roda no servidor e no cliente.

export const MILESTONE_KINDS = ["post", "release", "push", "other"] as const;
export type MilestoneKind = (typeof MILESTONE_KINDS)[number];

export const MILESTONE_LABEL: Record<MilestoneKind, string> = {
  post: "Post orgânico",
  release: "Release",
  push: "Push",
  other: "Outro",
};

export const PRESETS = [7, 30, 60] as const;
export const MAX_DAYS = 180;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

const TZ = "America/Sao_Paulo";

// Hoje (aaaa-mm-dd) em America/Sao_Paulo.
export function todaySP(now = new Date()): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

export function isDate(s: unknown): s is string {
  if (typeof s !== "string" || !DATE_RE.test(s)) return false;
  const t = Date.parse(`${s}T00:00:00Z`);
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === s;
}

export function addDays(s: string, n: number): string {
  return new Date(Date.parse(`${s}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS);
}

export type Period = { from: string; to: string; preset: number | null };

// Le ?dias=7|30|60 ou ?de=&ate= . Qualquer outra coisa cai no padrao de 30 dias.
export function parsePeriod(sp: { dias?: string; de?: string; ate?: string }, today = todaySP()): Period {
  if (isDate(sp.de) && isDate(sp.ate) && sp.de <= sp.ate && daysBetween(sp.de, sp.ate) < MAX_DAYS) {
    return { from: sp.de, to: sp.ate > today ? today : sp.ate, preset: null };
  }
  const n = Number(sp.dias);
  const days = (PRESETS as readonly number[]).includes(n) ? n : 30;
  return { from: addDays(today, -(days - 1)), to: today, preset: days };
}

export type SpendInput = { startDate: string; endDate: string; campaign: string; amountBrl: number; note: string };

export function parseAmount(v: unknown): number | null {
  const s = typeof v === "number" ? String(v) : typeof v === "string" ? v.trim() : "";
  if (!s) return null;
  // aceita "199,91" e "1.199,91" (pt-BR) e "199.91"
  const norm = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(norm);
  return Number.isFinite(n) && n >= 0 && n < 1_000_000 ? Math.round(n * 100) / 100 : null;
}

export function validateSpend(raw: unknown): { ok: true; value: SpendInput } | { ok: false; error: string } {
  const i = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const startDate = i.startDate;
  const endDate = i.endDate;
  const campaign = typeof i.campaign === "string" ? i.campaign.trim() : "";
  const note = typeof i.note === "string" ? i.note.trim() : "";
  const amountBrl = parseAmount(i.amountBrl);
  if (!isDate(startDate) || !isDate(endDate)) return { ok: false, error: "Informe as datas de início e fim." };
  if (endDate < startDate) return { ok: false, error: "A data final não pode ser antes da inicial." };
  if (daysBetween(startDate, endDate) > 365) return { ok: false, error: "Período longo demais (máx. 1 ano)." };
  if (campaign.length < 1 || campaign.length > 120) return { ok: false, error: "Nome da campanha: 1 a 120 caracteres." };
  if (amountBrl === null) return { ok: false, error: "Valor inválido." };
  if (note.length > 500) return { ok: false, error: "Observação: até 500 caracteres." };
  return { ok: true, value: { startDate, endDate, campaign, amountBrl, note } };
}

export type MilestoneInput = { day: string; kind: MilestoneKind; label: string };

export function validateMilestone(raw: unknown): { ok: true; value: MilestoneInput } | { ok: false; error: string } {
  const i = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const label = typeof i.label === "string" ? i.label.trim() : "";
  if (!isDate(i.day)) return { ok: false, error: "Informe a data do marco." };
  if (!(MILESTONE_KINDS as readonly unknown[]).includes(i.kind)) return { ok: false, error: "Escolha o tipo do marco." };
  if (label.length < 1 || label.length > 120) return { ok: false, error: "Descrição: 1 a 120 caracteres." };
  return { ok: true, value: { day: i.day, kind: i.kind as MilestoneKind, label } };
}
