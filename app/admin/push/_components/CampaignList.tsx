"use client";

import { useState } from "react";
import type { Campaign, CampaignStatus } from "@/lib/admin/push-validate";
import { TARGET_LABEL } from "@/lib/admin/push-validate";
import { cancelCampaignAction } from "../actions";
import { fmtN, fmtPct, fmtShort, fmtText, num } from "../../_components/format";

const STATUS_LABEL: Record<CampaignStatus, string> = {
  scheduled: "Agendada",
  sending: "Enviando",
  sent: "Enviada",
  cancelled: "Cancelada",
  failed: "Falhou",
};

function destination(c: Campaign): string {
  if (c.target === "shop_product") return c.product_title || "Produto do Shop";
  return TARGET_LABEL[c.target] ?? fmtText(c.target);
}

function opensText(c: Campaign): string {
  const sent = num(c.sent) ?? 0;
  if (sent <= 0) return "—";
  const opens = num(c.opens) ?? 0;
  return `${fmtN(opens)} · ${fmtPct((opens / sent) * 100)}`;
}

export function CampaignList({
  campaigns,
  refreshing,
  onRefresh,
  onDuplicate,
  onNotice,
}: {
  campaigns: Campaign[];
  refreshing: boolean;
  onRefresh: () => void;
  onDuplicate: (c: Campaign) => void;
  onNotice: (n: { ok: boolean; text: string }) => void;
}) {
  const [hideTests, setHideTests] = useState(true);
  const [cancelling, setCancelling] = useState<string>("");
  const rows = hideTests ? campaigns.filter((c) => !c.is_test) : campaigns;

  async function cancel(c: Campaign) {
    if (!window.confirm(`Cancelar a campanha "${c.title_pt}"?`)) return;
    setCancelling(String(c.id));
    try {
      const r = await cancelCampaignAction(c.id);
      onNotice(r.ok ? { ok: true, text: r.message ?? "Campanha cancelada." } : { ok: false, text: r.error });
      onRefresh(); // reflete o estado real, inclusive quando ja comecou a enviar
    } catch {
      onNotice({ ok: false, text: "Falha de rede. Tente de novo." });
    } finally {
      setCancelling("");
    }
  }

  return (
    <section className="adm-section">
      <h2 className="adm-h2">Campanhas</h2>
      <div className="adm-list-bar">
        <label className="adm-switch">
          <input type="checkbox" checked={hideTests} onChange={(e) => setHideTests(e.target.checked)} />
          <span>Ocultar testes</span>
        </label>
        <button type="button" className="adm-btn" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? "Atualizando…" : "Atualizar lista"}
        </button>
      </div>
      {rows.length === 0 ? (
        <div className="adm-panel">
          <p className="adm-empty">Nenhuma campanha ainda.</p>
        </div>
      ) : (
        <div className="adm-panel">
          <div className="adm-scroll">
            <table className="adm-table adm-table-stack">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Mensagem</th>
                  <th>Destino</th>
                  <th>Status</th>
                  <th className="r">Público</th>
                  <th className="r">Enviados / falhas</th>
                  <th className="r">Aberturas</th>
                  <th className="r">Cliques no Shop (24 h)</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={String(c.id)}>
                    <td data-label="Quando" className="mono">{fmtShort(c.scheduled_at)}</td>
                    <td data-label="Mensagem" className="adm-msg-cell">
                      <strong>{c.title_pt}</strong>
                      {c.is_test && <span className="adm-tag">TESTE{c.test_email ? ` · ${c.test_email}` : ""}</span>}
                      <div className="adm-msg-body">{c.body_pt}</div>
                    </td>
                    <td data-label="Destino">{destination(c)}</td>
                    <td data-label="Status">
                      <span className={`adm-status st-${c.status}`} title={c.status === "failed" && c.error ? c.error : undefined}>
                        {STATUS_LABEL[c.status] ?? fmtText(c.status)}
                      </span>
                    </td>
                    <td data-label="Público" className="r mono">{fmtN(c.recipients)}</td>
                    <td data-label="Enviados / falhas" className="r mono">{fmtN(c.sent)} / {fmtN(c.failed)}</td>
                    <td data-label="Aberturas" className="r mono">{opensText(c)}</td>
                    <td data-label="Cliques no Shop (24 h)" className="r mono">{fmtN(c.shop_clicks_24h)}</td>
                    <td className="adm-row-actions">
                      {c.status === "scheduled" && (
                        <button type="button" className="adm-btn" disabled={cancelling === String(c.id)} onClick={() => void cancel(c)}>
                          Cancelar
                        </button>
                      )}
                      <button type="button" className="adm-btn" onClick={() => onDuplicate(c)}>Duplicar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
