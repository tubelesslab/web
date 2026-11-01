"use server";

import { requireSession } from "@/lib/admin/guard";
import { SupabaseError } from "@/lib/admin/supabase";
import { audienceCount, cancelCampaign, createCampaign, listCampaigns, listShopProducts, type NewCampaign } from "@/lib/admin/push";
import {
  EMAIL_RE,
  TARGETS,
  cleanAudience,
  spLocalToUtc,
  validateMessage,
  type AudienceCount,
  type Campaign,
  type CampaignInput,
  type Target,
} from "@/lib/admin/push-validate";

export type Result<T = undefined> = { ok: true; data: T; message?: string } | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

// Traduz erros do Supabase para mensagens legiveis, sem vazar detalhes.
function toError(e: unknown): { ok: false; error: string } {
  if (e instanceof SupabaseError && e.code === "23514") {
    return fail("Revise os campos: título até 50, texto até 150, EN completo ou vazio, produto escolhido.");
  }
  return fail("Não foi possível falar com o Supabase. Tente de novo.");
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");

type Built = { ok: true; row: NewCampaign; users: number } | { ok: false; error: string };

// Valida tudo no servidor e monta a linha. `test` ignora publico e agenda.
async function build(raw: unknown, test: boolean, email: string): Promise<Built> {
  const i = (raw && typeof raw === "object" ? raw : {}) as Partial<CampaignInput>;
  const f = {
    titlePt: str(i.titlePt),
    bodyPt: str(i.bodyPt),
    enOn: i.enOn === true,
    titleEn: str(i.titleEn),
    bodyEn: str(i.bodyEn),
  };
  const msgErr = validateMessage(f);
  if (msgErr) return fail(msgErr);

  const target = str(i.target) as Target;
  if (!TARGETS.includes(target)) return fail("Escolha o destino ao tocar.");

  let productId: string | number | null = null;
  if (target === "shop_product") {
    const wanted = str(i.productId);
    const product = wanted ? (await listShopProducts()).find((p) => String(p.id) === wanted) : undefined;
    if (!product) return fail("Escolha um produto do Shop.");
    productId = product.id;
  }

  let audience = cleanAudience(i.audience);
  let users = 0;
  let scheduledAt: string;
  let testEmail: string | null = null;

  if (test) {
    testEmail = str(i.testEmail).trim().toLowerCase();
    if (!EMAIL_RE.test(testEmail)) return fail("Informe um e-mail válido para o teste.");
    audience = {};
    scheduledAt = new Date().toISOString();
  } else {
    users = (await audienceCount(audience)).users;
    if (users === 0) return fail("Nenhuma pessoa nesse público ainda.");
    if (i.whenMode === "now") {
      scheduledAt = new Date().toISOString();
    } else if (i.whenMode === "schedule") {
      const at = spLocalToUtc(str(i.whenLocal));
      if (!at) return fail("Data ou hora inválida.");
      if (at.getTime() <= Date.now() + 60_000) return fail("O agendamento precisa ser no futuro.");
      scheduledAt = at.toISOString();
    } else {
      return fail("Escolha quando enviar.");
    }
  }

  return {
    ok: true,
    users,
    row: {
      title_pt: f.titlePt.trim(),
      body_pt: f.bodyPt.trim(),
      title_en: f.enOn ? f.titleEn.trim() : null,
      body_en: f.enOn ? f.bodyEn.trim() : null,
      target,
      product_id: productId,
      audience,
      is_test: test,
      test_email: testEmail,
      scheduled_at: scheduledAt,
      status: "scheduled",
      created_by: email, // sempre da sessao, nunca do cliente
    },
  };
}

export async function previewAudienceAction(audience: unknown): Promise<Result<AudienceCount>> {
  await requireSession();
  try {
    return { ok: true, data: await audienceCount(cleanAudience(audience)) };
  } catch (e) {
    return toError(e);
  }
}

export async function createCampaignAction(input: unknown): Promise<Result> {
  const { email } = await requireSession();
  try {
    const b = await build(input, false, email);
    if (!b.ok) return b;
    await createCampaign(b.row);
    return { ok: true, data: undefined, message: "Campanha agendada." };
  } catch (e) {
    return toError(e);
  }
}

export async function sendTestAction(input: unknown): Promise<Result> {
  const { email } = await requireSession();
  try {
    const b = await build(input, true, email);
    if (!b.ok) return b;
    await createCampaign(b.row);
    return {
      ok: true,
      data: undefined,
      message: "Teste criado. Chega em até 5 minutos se essa conta aceitou ofertas e tem notificações ligadas no app.",
    };
  } catch (e) {
    return toError(e);
  }
}

export async function cancelCampaignAction(id: unknown): Promise<Result> {
  await requireSession();
  const cid = typeof id === "string" || typeof id === "number" ? String(id) : "";
  if (!/^[\w-]{1,64}$/.test(cid)) return fail("Campanha inválida.");
  try {
    if (!(await cancelCampaign(cid))) return fail("A campanha já começou a ser enviada.");
    return { ok: true, data: undefined, message: "Campanha cancelada." };
  } catch (e) {
    return toError(e);
  }
}

export async function refreshCampaignsAction(): Promise<Result<Campaign[]>> {
  await requireSession();
  try {
    return { ok: true, data: await listCampaigns() };
  } catch (e) {
    return toError(e);
  }
}
