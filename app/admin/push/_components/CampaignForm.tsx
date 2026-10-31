"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BIKES,
  BIKE_LABEL,
  BODY_MAX,
  DEFAULT_TEST_EMAIL,
  EMAIL_RE,
  TARGETS,
  TARGET_LABEL,
  TITLE_MAX,
  audienceSummary,
  charLen,
  localToText,
  spLocalToUtc,
  spNowLocal,
  validateMessage,
  type Audience,
  type Bike,
  type Product,
  type Target,
} from "@/lib/admin/push-validate";
import { createCampaignAction, previewAudienceAction, sendTestAction } from "../actions";
import { fmtN, tr } from "../../_components/format";

export type Draft = {
  titlePt: string;
  bodyPt: string;
  titleEn: string;
  bodyEn: string;
  target: string;
  productId: string;
  audience: Audience;
};

type Count = { state: "loading" } | { state: "error" } | { state: "ok"; users: number; devices: number };

const triState = (v: boolean | undefined) => (v === undefined ? "all" : v ? "yes" : "no");
const fromTri = (v: string): boolean | undefined => (v === "all" ? undefined : v === "yes");

function Counter({ n, max }: { n: number; max: number }) {
  return <span className={`mono adm-counter${n > max ? " over" : ""}`}>{n}/{max}</span>;
}

function Preview({ title, body }: { title: string; body: string }) {
  return (
    <div className="adm-ios" aria-label="Prévia da notificação">
      <div className="adm-ios-icon" aria-hidden="true">T</div>
      <div className="adm-ios-main">
        <div className="adm-ios-head">
          <span>TBLS LAB</span>
          <span>agora</span>
        </div>
        <div className="adm-ios-title">{title || "Título da notificação"}</div>
        <div className="adm-ios-body">{body || "O texto aparece aqui enquanto você digita."}</div>
      </div>
    </div>
  );
}

export function CampaignForm({
  products,
  initial,
  onSaved,
}: {
  products: Product[];
  initial: Draft | null;
  onSaved: (kind: "campaign" | "test", message: string) => void;
}) {
  const a0 = initial?.audience ?? {};
  const [titlePt, setTitlePt] = useState(initial?.titlePt ?? "");
  const [bodyPt, setBodyPt] = useState(initial?.bodyPt ?? "");
  const [enOn, setEnOn] = useState(Boolean(initial?.titleEn || initial?.bodyEn));
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [bodyEn, setBodyEn] = useState(initial?.bodyEn ?? "");
  const [previewLang, setPreviewLang] = useState<"pt" | "en">("pt");
  const [target, setTarget] = useState<string>(initial?.target ?? "garage");
  const [productId, setProductId] = useState(initial?.productId ?? "");

  const [language, setLanguage] = useState<string>(a0.language ?? "all");
  const [platform, setPlatform] = useState<string>(a0.platform ?? "all");
  const [bikes, setBikes] = useState<Bike[]>(a0.bike_types ?? []);
  const [wheels, setWheels] = useState(triState(a0.has_wheels));
  const [strava, setStrava] = useState(triState(a0.strava));
  const [activeDays, setActiveDays] = useState(String(a0.active_days ?? "any"));
  const [signupDays, setSignupDays] = useState(String(a0.signup_days ?? "any"));

  const [whenMode, setWhenMode] = useState<"now" | "schedule">("schedule");
  const [whenLocal, setWhenLocal] = useState("");
  const [minLocal, setMinLocal] = useState("");
  const [testEmail, setTestEmail] = useState(DEFAULT_TEST_EMAIL);

  const [count, setCount] = useState<Count>({ state: "loading" });
  const [busy, setBusy] = useState<"" | "test" | "campaign">("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => setMinLocal(spNowLocal()), []);

  const audience = useMemo<Audience>(() => {
    const a: Audience = {};
    if (language === "pt" || language === "en") a.language = language;
    if (platform === "ios" || platform === "android") a.platform = platform;
    if (bikes.length > 0) a.bike_types = bikes;
    const w = fromTri(wheels);
    if (w !== undefined) a.has_wheels = w;
    const s = fromTri(strava);
    if (s !== undefined) a.strava = s;
    if (activeDays !== "any") a.active_days = Number(activeDays) as 7 | 30 | 90;
    if (signupDays !== "any") a.signup_days = Number(signupDays) as 30 | 90;
    return a;
  }, [language, platform, bikes, wheels, strava, activeDays, signupDays]);

  // Previa do publico: debounce de 400 ms; respostas antigas sao descartadas.
  const reqId = useRef(0);
  async function calculate(a: Audience) {
    const id = ++reqId.current;
    setCount({ state: "loading" });
    try {
      const r = await previewAudienceAction(a);
      if (id !== reqId.current) return;
      setCount(r.ok ? { state: "ok", users: r.data.users, devices: r.data.devices } : { state: "error" });
    } catch {
      if (id === reqId.current) setCount({ state: "error" });
    }
  }
  useEffect(() => {
    setCount({ state: "loading" });
    const t = setTimeout(() => void calculate(audience), 400);
    return () => clearTimeout(t);
  }, [audience]);

  const msgError = validateMessage({ titlePt, bodyPt, enOn, titleEn, bodyEn });
  const productMissing = target === "shop_product" && !productId;
  const whenUtc = whenMode === "schedule" ? spLocalToUtc(whenLocal) : null;
  const whenError =
    whenMode === "schedule"
      ? !whenUtc
        ? "Escolha data e hora."
        : whenUtc.getTime() <= Date.now() + 60_000
          ? "O agendamento precisa ser no futuro."
          : ""
      : "";
  const noAudience = count.state === "ok" && count.users === 0;
  const canSchedule = !msgError && !productMissing && !whenError && count.state === "ok" && count.users > 0 && !busy;
  const emailOk = EMAIL_RE.test(testEmail.trim());
  const canTest = !msgError && !productMissing && emailOk && !busy;

  const productsByCategory = useMemo(() => {
    const g = new Map<string, Product[]>();
    for (const p of products) g.set(p.category, [...(g.get(p.category) ?? []), p]);
    return [...g.entries()];
  }, [products]);
  const productTitle = products.find((p) => String(p.id) === productId)?.title ?? "";

  const input = () => ({ titlePt, bodyPt, enOn, titleEn, bodyEn, target, productId, audience, whenMode, whenLocal, testEmail });

  async function submit(kind: "campaign" | "test") {
    setBusy(kind);
    setError("");
    setInfo("");
    try {
      const r = kind === "test" ? await sendTestAction(input()) : await createCampaignAction(input());
      if (r.ok) {
        setConfirmOpen(false);
        onSaved(kind, r.message ?? "Pronto.");
      } else {
        setConfirmOpen(false);
        setError(r.error);
      }
    } catch {
      setConfirmOpen(false);
      setError("Falha de rede. O que você digitou foi mantido; tente de novo.");
    } finally {
      setBusy("");
    }
  }

  const showEn = previewLang === "en" && enOn;

  return (
    <section className="adm-section">
      <h2 className="adm-h2">Nova campanha</h2>
      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}
      {info && <p className="adm-notice">{info}</p>}

      <div className="adm-push-grid">
        <div className="adm-panel adm-form">
          <h3 className="adm-h3">Mensagem</h3>
          <label>
            <span className="adm-label-row">Título (PT) <Counter n={charLen(titlePt)} max={TITLE_MAX} /></span>
            <input value={titlePt} onChange={(e) => setTitlePt(e.target.value)} autoComplete="off" />
          </label>
          <label>
            <span className="adm-label-row">Texto (PT) <Counter n={charLen(bodyPt)} max={BODY_MAX} /></span>
            <textarea rows={3} value={bodyPt} onChange={(e) => setBodyPt(e.target.value)} />
          </label>
          <label className="adm-switch">
            <input type="checkbox" checked={enOn} onChange={(e) => { setEnOn(e.target.checked); if (!e.target.checked) setPreviewLang("pt"); }} />
            <span>Versão em inglês</span>
          </label>
          {enOn && (
            <>
              <label>
                <span className="adm-label-row">Título (EN) <Counter n={charLen(titleEn)} max={TITLE_MAX} /></span>
                <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} autoComplete="off" />
              </label>
              <label>
                <span className="adm-label-row">Texto (EN) <Counter n={charLen(bodyEn)} max={BODY_MAX} /></span>
                <textarea rows={3} value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} />
              </label>
            </>
          )}
          {!enOn && <p className="adm-hint">Sem a versão em inglês, quem usa o app em inglês recebe o texto em PT.</p>}
          <p className="adm-hint">Evite preço no texto: ele muda. Emojis funcionam.</p>
          {msgError && (titlePt || bodyPt || titleEn || bodyEn) && <p className="adm-error-inline">{msgError}</p>}
        </div>

        <div className="adm-panel">
          <h3 className="adm-h3">Prévia</h3>
          {enOn && (
            <div className="adm-seg-toggle" role="group" aria-label="Idioma da prévia">
              <button type="button" aria-pressed={previewLang === "pt"} onClick={() => setPreviewLang("pt")}>PT</button>
              <button type="button" aria-pressed={previewLang === "en"} onClick={() => setPreviewLang("en")}>EN</button>
            </div>
          )}
          <Preview title={showEn ? titleEn : titlePt} body={showEn ? bodyEn : bodyPt} />
        </div>
      </div>

      <div className="adm-panel adm-form adm-block">
        <h3 className="adm-h3">Destino ao tocar</h3>
        <label>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {TARGETS.map((t) => (
              <option key={t} value={t}>{TARGET_LABEL[t as Target]}</option>
            ))}
          </select>
        </label>
        {target === "shop_product" && (
          <label>
            Produto
            <select value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Escolha um produto…</option>
              {productsByCategory.map(([cat, list]) => (
                <optgroup key={cat} label={tr("shop", cat)}>
                  {list.map((p) => (
                    <option key={String(p.id)} value={String(p.id)}>{p.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        )}
        {productMissing && <p className="adm-error-inline">Escolha um produto do Shop.</p>}
      </div>

      <div className="adm-panel adm-form adm-block">
        <h3 className="adm-h3">Público</h3>
        <div className="adm-filters">
          <label>Idioma
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="all">Todos</option><option value="pt">Português</option><option value="en">Inglês</option>
            </select>
          </label>
          <label>Plataforma
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="all">Todas</option><option value="ios">iOS</option><option value="android">Android</option>
            </select>
          </label>
          <label>Rodas cadastradas
            <select value={wheels} onChange={(e) => setWheels(e.target.value)}>
              <option value="all">Todos</option><option value="yes">Com rodas</option><option value="no">Sem rodas</option>
            </select>
          </label>
          <label>Strava
            <select value={strava} onChange={(e) => setStrava(e.target.value)}>
              <option value="all">Todos</option><option value="yes">Conectado</option><option value="no">Não conectado</option>
            </select>
          </label>
          <label>Ativos no app
            <select value={activeDays} onChange={(e) => setActiveDays(e.target.value)}>
              <option value="any">Qualquer</option><option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option>
            </select>
          </label>
          <label>Cadastro
            <select value={signupDays} onChange={(e) => setSignupDays(e.target.value)}>
              <option value="any">Qualquer</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option>
            </select>
          </label>
        </div>
        <div>
          <div className="adm-label">Tipo de bike (nenhum = todos)</div>
          <div className="adm-chips">
            {BIKES.map((b) => (
              <button
                key={b}
                type="button"
                className="adm-chip"
                aria-pressed={bikes.includes(b)}
                onClick={() => setBikes((cur) => (cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]))}
              >
                {BIKE_LABEL[b]}
              </button>
            ))}
          </div>
        </div>
        <div className="adm-count">
          <span className="mono adm-count-value">
            {count.state === "ok"
              ? `${fmtN(count.users)} pessoas · ${fmtN(count.devices)} aparelhos`
              : count.state === "loading"
                ? "Calculando…"
                : "Não foi possível calcular"}
          </span>
          <button type="button" className="adm-btn" onClick={() => void calculate(audience)}>Calcular</button>
        </div>
        {noAudience && <p className="adm-error-inline">Nenhuma pessoa nesse público ainda.</p>}
        <p className="adm-hint">
          Regras fixas do servidor: só quem aceitou ofertas no app, com notificações ligadas e aparelho registrado; contas de
          teste do painel ficam de fora; no máximo 1 campanha por pessoa a cada 72 h.
        </p>
      </div>

      <div className="adm-panel adm-form adm-block">
        <h3 className="adm-h3">Quando</h3>
        <div className="adm-radio-row">
          <label className="adm-radio"><input type="radio" name="when" checked={whenMode === "now"} onChange={() => setWhenMode("now")} /> Enviar agora</label>
          <label className="adm-radio"><input type="radio" name="when" checked={whenMode === "schedule"} onChange={() => setWhenMode("schedule")} /> Agendar</label>
        </div>
        {whenMode === "schedule" && (
          <label>
            Data e hora (Brasília)
            <input type="datetime-local" value={whenLocal} min={minLocal || undefined} onChange={(e) => setWhenLocal(e.target.value)} />
          </label>
        )}
        {whenMode === "schedule" && whenLocal && whenError && <p className="adm-error-inline">{whenError}</p>}
        <p className="adm-hint">O envio sai em até 5 minutos do horário escolhido.</p>
      </div>

      <div className="adm-panel adm-form adm-block">
        <h3 className="adm-h3">Ações</h3>
        <div className="adm-actions">
          <label className="adm-test-email">
            E-mail do teste
            <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
          </label>
          <button type="button" className="adm-btn" disabled={!canTest} onClick={() => void submit("test")}>
            {busy === "test" ? "Enviando…" : "Enviar teste"}
          </button>
          <button type="button" className="adm-btn adm-btn-primary" disabled={!canSchedule} onClick={() => setConfirmOpen(true)}>
            Agendar campanha
          </button>
        </div>
        {noAudience && <p className="adm-error-inline">Nenhuma pessoa nesse público ainda.</p>}
      </div>

      {confirmOpen && (
        <div className="adm-modal-back" role="dialog" aria-modal="true" aria-label="Confirmar campanha">
          <div className="adm-modal">
            <h3 className="adm-h2">Confirmar campanha</h3>
            <dl className="adm-confirm">
              <dt>Título</dt><dd>{titlePt.trim()}</dd>
              <dt>Texto</dt><dd>{bodyPt.trim()}</dd>
              {enOn && (<><dt>Inglês</dt><dd>{titleEn.trim()} — {bodyEn.trim()}</dd></>)}
              <dt>Destino</dt>
              <dd>{target === "shop_product" ? `Produto: ${productTitle}` : TARGET_LABEL[target as Target]}</dd>
              <dt>Público</dt>
              <dd>{audienceSummary(audience)}</dd>
              <dt>Alcance</dt>
              <dd className="mono">{count.state === "ok" ? `${fmtN(count.users)} pessoas · ${fmtN(count.devices)} aparelhos` : "—"}</dd>
              <dt>Quando</dt>
              <dd className="mono">
                {whenMode === "now"
                  ? "Agora"
                  : `${localToText(whenLocal)} (Brasília)${whenUtc ? ` · ${whenUtc.toISOString()} UTC` : ""}`}
              </dd>
            </dl>
            <div className="adm-actions">
              <button type="button" className="adm-btn" disabled={busy !== ""} onClick={() => setConfirmOpen(false)}>Voltar</button>
              <button type="button" className="adm-btn adm-btn-primary" disabled={busy !== ""} onClick={() => void submit("campaign")}>
                {busy === "campaign" ? "Gravando…" : "Confirmar e agendar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
