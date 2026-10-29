export const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

export function fmtN(v: unknown, digits = 0): string {
  const n = num(v);
  return n === null ? "—" : n.toLocaleString("pt-BR", { maximumFractionDigits: digits });
}

export function fmtPct(v: unknown): string {
  const n = num(v);
  return n === null ? "—" : `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

export function fmtText(v: unknown): string {
  return v === null || v === undefined || v === "" ? "—" : String(v);
}

const TZ = "America/Sao_Paulo";

// dd/mm/aaaa hh:mm em America/Sao_Paulo
export function fmtDateTime(v: unknown): string {
  if (typeof v !== "string" && typeof v !== "number") return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: TZ,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

export function fmtDate(v: unknown): string {
  const s = fmtDateTime(v);
  return s === "—" ? s : s.slice(0, 10);
}

const MAPS = {
  bike: { road: "Road", gravel: "Gravel", mtb: "MTB", urban: "Urbana", other: "Outra" },
  maint: { full_replacement: "Troca completa", top_off: "Top-off" },
  outcome: { sealed: "Selou", sealed_with_loss: "Selou com perda", plugged: "Plug", not_sealed: "Não selou" },
  condition: { good: "Bom", drying: "Secando", dry: "Seco", not_checked: "Não verificado" },
  shop: {
    sealant: "Selantes",
    valve: "Válvulas",
    tape: "Fitas",
    kit: "Kits",
    tool: "Ferramentas",
    tire: "Pneus",
  },
} as const;

export function tr(map: keyof typeof MAPS, v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  const dict = MAPS[map] as Record<string, string>;
  return dict[String(v)] ?? String(v);
}
