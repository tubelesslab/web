"use client";

import { useState, useTransition } from "react";
import { MILESTONE_KINDS, MILESTONE_LABEL, type MilestoneKind } from "@/lib/admin/acquisition-validate";
import { addMilestoneAction, addSpendAction, deleteMilestoneAction, deleteSpendAction, type Result } from "../actions";
import { DataTable, Panel } from "../../_components/ui";
import { fmtN } from "../../_components/format";

export type SpendItem = { id: number | string; start_date: string; end_date: string; campaign: string; amount_brl: number | string; note: string | null };
export type MilestoneItem = { id: number | string; day: string; kind: string; label: string };

const dmy = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
const brl = (v: unknown) => `R$ ${fmtN(v, 2)}`;

function useAction() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  function run(fn: () => Promise<Result>, onOk?: () => void) {
    setMsg(null);
    start(async () => {
      try {
        const r = await fn();
        if (r.ok) {
          setMsg(r.message ? { tone: "ok", text: r.message } : null);
          onOk?.();
        } else {
          setMsg({ tone: "err", text: r.error });
        }
      } catch {
        setMsg({ tone: "err", text: "Falha inesperada. Tente de novo." });
      }
    });
  }
  return { pending, msg, run };
}

// Botao de remover com confirmacao em dois cliques.
function RemoveButton({ onConfirm, disabled }: { onConfirm: () => void; disabled: boolean }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      className="adm-btn"
      disabled={disabled}
      onClick={() => {
        if (!armed) {
          setArmed(true);
          return;
        }
        setArmed(false);
        onConfirm();
      }}
      onBlur={() => setArmed(false)}
    >
      {armed ? "Confirmar" : "Remover"}
    </button>
  );
}

function Msg({ msg }: { msg: { tone: "ok" | "err"; text: string } | null }) {
  if (!msg) return null;
  return <p className={msg.tone === "ok" ? "adm-notice" : "adm-error-inline"}>{msg.text}</p>;
}

export function SpendPanel({ items, from, to }: { items: SpendItem[]; from: string; to: string }) {
  const { pending, msg, run } = useAction();
  const [startDate, setStart] = useState("");
  const [endDate, setEnd] = useState("");
  const [campaign, setCampaign] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    run(
      () => addSpendAction({ startDate, endDate, campaign, amountBrl: amount, note }, { from, to }),
      () => {
        setCampaign("");
        setAmount("");
        setNote("");
      },
    );
  }

  return (
    <Panel title="Investimento (lançamento manual)">
      <form className="adm-form" onSubmit={submit}>
        <div className="adm-filters">
          <label>
            Início
            <input type="date" value={startDate} onChange={(e) => setStart(e.target.value)} required />
          </label>
          <label>
            Fim
            <input type="date" value={endDate} onChange={(e) => setEnd(e.target.value)} required />
          </label>
          <label>
            Valor (R$)
            <input inputMode="decimal" placeholder="199,91" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </label>
        </div>
        <label>
          Campanha / criativo
          <input maxLength={120} value={campaign} onChange={(e) => setCampaign(e.target.value)} required />
        </label>
        <label>
          Observação (opcional)
          <input maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <div>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
            {pending ? "Salvando…" : "Lançar gasto"}
          </button>
        </div>
      </form>
      <Msg msg={msg} />
      <DataTable
        rows={items}
        cols={[
          { label: "Período", render: (r) => `${dmy(r.start_date)} – ${dmy(r.end_date)}` },
          { label: "Campanha", render: (r) => r.campaign },
          { label: "Valor", num: true, render: (r) => brl(r.amount_brl) },
          {
            label: "",
            render: (r) => <RemoveButton disabled={pending} onConfirm={() => run(() => deleteSpendAction(r.id, { from, to }))} />,
          },
        ]}
      />
    </Panel>
  );
}

export function MilestonesPanel({ items, from, to }: { items: MilestoneItem[]; from: string; to: string }) {
  const { pending, msg, run } = useAction();
  const [day, setDay] = useState("");
  const [kind, setKind] = useState<MilestoneKind>("post");
  const [label, setLabel] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    run(
      () => addMilestoneAction({ day, kind, label }, { from, to }),
      () => setLabel(""),
    );
  }

  return (
    <Panel title="Marcos no tempo">
      <form className="adm-form" onSubmit={submit}>
        <div className="adm-filters">
          <label>
            Data
            <input type="date" value={day} onChange={(e) => setDay(e.target.value)} required />
          </label>
          <label>
            Tipo
            <select value={kind} onChange={(e) => setKind(e.target.value as MilestoneKind)}>
              {MILESTONE_KINDS.map((k) => (
                <option key={k} value={k}>
                  {MILESTONE_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Descrição
          <input maxLength={120} value={label} onChange={(e) => setLabel(e.target.value)} required />
        </label>
        <div>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
            {pending ? "Salvando…" : "Adicionar marco"}
          </button>
        </div>
      </form>
      <Msg msg={msg} />
      <DataTable
        rows={items}
        cols={[
          { label: "Data", render: (r) => dmy(r.day) },
          { label: "Tipo", render: (r) => MILESTONE_LABEL[r.kind as MilestoneKind] ?? r.kind },
          { label: "Descrição", render: (r) => r.label },
          {
            label: "",
            render: (r) => <RemoveButton disabled={pending} onConfirm={() => run(() => deleteMilestoneAction(r.id, { from, to }))} />,
          },
        ]}
      />
    </Panel>
  );
}
