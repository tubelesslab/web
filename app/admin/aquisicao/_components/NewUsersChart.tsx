/* eslint-disable @typescript-eslint/no-explicit-any */
import { MILESTONE_LABEL, type MilestoneKind } from "@/lib/admin/acquisition-validate";
import { Empty } from "../../_components/ui";
import { fmtN, num } from "../../_components/format";

type R = Record<string, any>;

const dm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

// Abaixo disso a media movel e ruido: a linha some e o dia vira um ponto vazio.
const MIN_SAMPLE = 10;

// Ativacao 7d em media movel de 7 dias: soma(roda em ate 7d) / soma(elegiveis), por dia.
// pct e null quando ha menos de MIN_SAMPLE elegiveis; small marca os dias com algum elegivel mas amostra pequena.
function activationLine(daily: R[]): { pct: number | null; small: boolean }[] {
  return daily.map((_, i) => {
    let w = 0;
    let e = 0;
    for (let k = Math.max(0, i - 6); k <= i; k++) {
      w += num(daily[k].wheel7) ?? 0;
      e += num(daily[k].elig7) ?? 0;
    }
    return e >= MIN_SAMPLE ? { pct: (w / e) * 100, small: false } : { pct: null, small: e > 0 };
  });
}

export function NewUsersChart({ daily, milestones }: { daily: R[]; milestones: R[] }) {
  if (daily.length === 0) return <Empty />;

  const n = daily.length;
  const totals = daily.map((d) => num(d.novos) ?? 0);
  const max = Math.max(...totals, 1);
  const act = activationLine(daily);
  const byDay = new Map<string, R[]>();
  for (const m of milestones) {
    const k = String(m.day);
    byDay.set(k, [...(byDay.get(k) ?? []), m]);
  }

  // Segmentos continuos da linha (quebra onde nao ha dado). x no centro de cada coluna.
  const segs: string[] = [];
  let cur: string[] = [];
  act.forEach(({ pct: v }, i) => {
    if (v === null) {
      if (cur.length) segs.push(cur.join(" "));
      cur = [];
    } else {
      cur.push(`${(((i + 0.5) / n) * 100).toFixed(2)},${(100 - v).toFixed(2)}`);
    }
  });
  if (cur.length) segs.push(cur.join(" "));

  const labelEvery = Math.max(1, Math.ceil(n / 12));

  return (
    <div>
      <div className="adm-scroll">
        <div style={{ minWidth: n * 14 }}>
          <div className="acq-plot">
            {daily.map((d, i) => (
              <div
                key={String(d.day)}
                className="acq-bar"
                title={`${dm(String(d.day))}: ${totals[i]} novos (iOS ${fmtN(d.ios)} · Android ${fmtN(d.android)} · sem evento ${fmtN(d.sem_evento)})`}
              >
                <div className="adm-col-stack" style={{ height: `${(totals[i] / max) * 100}%` }}>
                  <div className="adm-seg seg-0" style={{ flexGrow: num(d.ios) ?? 0 }} />
                  <div className="adm-seg seg-1" style={{ flexGrow: num(d.android) ?? 0 }} />
                  <div className="adm-seg seg-2" style={{ flexGrow: num(d.sem_evento) ?? 0 }} />
                </div>
              </div>
            ))}
            {act.map(
              (a, i) =>
                a.small && (
                  <i
                    key={String(daily[i].day)}
                    className="acq-dot"
                    style={{ left: `${((i + 0.5) / n) * 100}%` }}
                    title={`${dm(String(daily[i].day))}: ativação não exibida (amostra < ${MIN_SAMPLE})`}
                  />
                ),
            )}
            <svg className="acq-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {segs.map((p, i) => (
                <polyline key={i} points={p} className="acq-line-stroke" fill="none" />
              ))}
            </svg>
          </div>

          <div className="acq-strip">
            {daily.map((d) => {
              const spend = num(d.spend) ?? 0;
              return (
                <div key={String(d.day)} className="acq-cell">
                  {spend > 0 && (
                    <i className="acq-ad" title={`Campanha ativa · R$ ${spend.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
                  )}
                  {(byDay.get(String(d.day)) ?? []).map((m) => (
                    <i
                      key={String(m.id)}
                      className="acq-ms"
                      title={`${dm(String(d.day))} · ${MILESTONE_LABEL[m.kind as MilestoneKind] ?? m.kind}: ${m.label}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          <div className="acq-labels mono">
            {daily.map((d, i) => (
              <span key={String(d.day)}>{i % labelEvery === 0 || i === n - 1 ? dm(String(d.day)) : ""}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="adm-legend">
        <span><i className="adm-swatch seg-0" /> iOS</span>
        <span><i className="adm-swatch seg-1" /> Android</span>
        <span><i className="adm-swatch seg-2" /> Sem evento</span>
        <span><i className="adm-swatch acq-swatch-line" /> Ativação 7d (média móvel de 7 dias)</span>
        <span><i className="adm-swatch acq-dot-sw" /> Ponto vazio: amostra &lt; {MIN_SAMPLE}</span>
        <span><i className="adm-swatch acq-ad" /> Dia com campanha</span>
        <span><i className="adm-swatch acq-ms" /> Marco</span>
      </div>
    </div>
  );
}
