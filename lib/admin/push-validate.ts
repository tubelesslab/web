// Tipos, limites e validacao de campanhas de push. Sem acesso a segredos:
// pode ser importado tanto pelo servidor quanto pelo formulario (cliente).

export const TITLE_MAX = 50;
export const BODY_MAX = 150;
export const TZ = "America/Sao_Paulo";
export const DEFAULT_TEST_EMAIL = "review@tubelesslab.com";

export const TARGETS = ["garage", "activity", "shop", "shop_product"] as const;
export type Target = (typeof TARGETS)[number];
export const TARGET_LABEL: Record<Target, string> = {
  garage: "Garagem",
  activity: "Atividade",
  shop: "Shop",
  shop_product: "Produto do Shop",
};

export const BIKES = ["road", "gravel", "mtb", "urban", "other"] as const;
export type Bike = (typeof BIKES)[number];
export const BIKE_LABEL: Record<Bike, string> = {
  road: "Speed",
  gravel: "Gravel",
  mtb: "MTB",
  urban: "Urbana",
  other: "Outra",
};

export type Audience = {
  language?: "pt" | "en";
  platform?: "ios" | "android";
  bike_types?: Bike[];
  has_wheels?: boolean;
  strava?: boolean;
  active_days?: 7 | 30 | 90;
  signup_days?: 30 | 90;
};

export type AudienceCount = {
  users: number;
  devices: number;
  opted_in_total: number;
  with_token_total: number;
};

export type Product = { id: string | number; title: string; category: string };

export type CampaignStatus = "scheduled" | "sending" | "sent" | "cancelled" | "failed";

export type Campaign = {
  id: string | number;
  title_pt: string;
  body_pt: string;
  title_en: string | null;
  body_en: string | null;
  target: Target;
  product_id: string | number | null;
  product_title: string | null;
  audience: Audience | null;
  is_test: boolean;
  test_email: string | null;
  scheduled_at: string;
  status: CampaignStatus;
  recipients: number | null;
  sent: number | null;
  failed: number | null;
  error: string | null;
  opens: number | null;
  shop_clicks_24h: number | null;
};

// Entrada crua do formulario (tudo e re-validado no servidor).
export type CampaignInput = {
  titlePt: string;
  bodyPt: string;
  enOn: boolean;
  titleEn: string;
  bodyEn: string;
  target: string;
  productId: string;
  audience: unknown;
  whenMode: string;
  whenLocal: string;
  testEmail: string;
};

// Conta pontos de codigo (como o char_length do Postgres), nao unidades UTF-16: emoji conta 1.
export const charLen = (s: string): number => [...s].length;

// ---------- Audiencia ----------

export function cleanAudience(raw: unknown): Audience {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out: Audience = {};
  if (r.language === "pt" || r.language === "en") out.language = r.language;
  if (r.platform === "ios" || r.platform === "android") out.platform = r.platform;
  if (Array.isArray(r.bike_types)) {
    const b = [...new Set(r.bike_types.filter((x): x is Bike => BIKES.includes(x as Bike)))];
    if (b.length > 0) out.bike_types = b;
  }
  if (typeof r.has_wheels === "boolean") out.has_wheels = r.has_wheels;
  if (typeof r.strava === "boolean") out.strava = r.strava;
  if (r.active_days === 7 || r.active_days === 30 || r.active_days === 90) out.active_days = r.active_days;
  if (r.signup_days === 30 || r.signup_days === 90) out.signup_days = r.signup_days;
  return out;
}

export function audienceSummary(a: Audience): string {
  const p: string[] = [];
  if (a.language) p.push(a.language === "pt" ? "Português" : "Inglês");
  if (a.platform) p.push(a.platform === "ios" ? "iOS" : "Android");
  if (a.bike_types) p.push(`Bike: ${a.bike_types.map((b) => BIKE_LABEL[b]).join(", ")}`);
  if (a.has_wheels !== undefined) p.push(a.has_wheels ? "Com rodas" : "Sem rodas");
  if (a.strava !== undefined) p.push(a.strava ? "Strava conectado" : "Sem Strava");
  if (a.active_days) p.push(`Ativos nos últimos ${a.active_days} dias`);
  if (a.signup_days) p.push(`Cadastro nos últimos ${a.signup_days} dias`);
  return p.length > 0 ? p.join(" · ") : "Todos";
}

// ---------- Fuso America/Sao_Paulo ----------

function spParts(d: Date): { y: number; mo: number; d: number; h: number; mi: number } {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  );
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour, mi: +p.minute };
}

// Relogio de parede de Sao Paulo no instante `t`, lido como se fosse UTC (em ms).
function wallMs(t: number): number {
  const p = spParts(new Date(t));
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi);
}

const pad = (n: number) => String(n).padStart(2, "0");

// "agora" em Brasilia no formato do input datetime-local (AAAA-MM-DDTHH:mm).
export function spNowLocal(now: Date = new Date()): string {
  const p = spParts(now);
  return `${p.y}-${pad(p.mo)}-${pad(p.d)}T${pad(p.h)}:${pad(p.mi)}`;
}

// "AAAA-MM-DDTHH:mm" digitado em Brasilia -> instante UTC. null se invalido ou inexistente.
// Nao fixa -03:00: mede o deslocamento real do fuso no instante (robusto a horario de verao).
export function spLocalToUtc(local: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!m) return null;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const g = new Date(guess);
  // rejeita datas que o Date "corrige" (ex.: 31/02, 25:00)
  if (g.getUTCFullYear() !== y || g.getUTCMonth() !== mo - 1 || g.getUTCDate() !== d || g.getUTCHours() !== h || g.getUTCMinutes() !== mi) {
    return null;
  }
  let t = guess - (wallMs(guess) - guess);
  t = guess - (wallMs(t) - t);
  if (wallMs(t) !== guess) return null; // horario que nao existe (salto de relogio)
  return new Date(t);
}

// "AAAA-MM-DDTHH:mm" -> "dd/mm/aaaa HH:mm" (texto, sem passar por Date/fuso do navegador)
export function localToText(local: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : "—";
}

// ---------- Mensagem ----------

export type MessageFields = { titlePt: string; bodyPt: string; enOn: boolean; titleEn: string; bodyEn: string };

// Retorna a primeira mensagem de erro (legivel) ou null.
export function validateMessage(f: MessageFields): string | null {
  const tp = f.titlePt.trim();
  const bp = f.bodyPt.trim();
  if (!tp || !bp) return "Preencha título e texto em português.";
  if (charLen(tp) > TITLE_MAX) return `O título em português passa de ${TITLE_MAX} caracteres.`;
  if (charLen(bp) > BODY_MAX) return `O texto em português passa de ${BODY_MAX} caracteres.`;
  if (f.enOn) {
    const te = f.titleEn.trim();
    const be = f.bodyEn.trim();
    if (!te || !be) return "Preencha título e texto em inglês, ou desligue a versão em inglês.";
    if (charLen(te) > TITLE_MAX) return `O título em inglês passa de ${TITLE_MAX} caracteres.`;
    if (charLen(be) > BODY_MAX) return `O texto em inglês passa de ${BODY_MAX} caracteres.`;
  }
  return null;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
