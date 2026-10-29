import type { ReactNode } from "react";
import { num } from "./format";

export function Empty() {
  return <p className="adm-empty">Sem dados ainda</p>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="adm-section">
      <h2 className="adm-h2">{title}</h2>
      {children}
    </section>
  );
}

export function SubTitle({ children }: { children: ReactNode }) {
  return <h3 className="adm-h3">{children}</h3>;
}

export function Grid({ children }: { children: ReactNode }) {
  return <div className="adm-grid">{children}</div>;
}

export function Card({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "warn" | "crit" | "pos";
}) {
  return (
    <div className="adm-card">
      <div className="adm-label">{label}</div>
      <div className={`adm-value mono${tone ? ` tone-${tone}` : ""}`}>{value}</div>
      {hint && <div className="adm-hint">{hint}</div>}
    </div>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="adm-panel">
      {title && <SubTitle>{title}</SubTitle>}
      {children}
    </div>
  );
}

export type Col<T> = { label: string; render: (row: T) => ReactNode; num?: boolean };

export function DataTable<T>({ rows, cols }: { rows: T[]; cols: Col<T>[] }) {
  if (rows.length === 0) return <Empty />;
  return (
    <div className="adm-scroll">
      <table className="adm-table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.label} className={c.num ? "r" : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td key={c.label} className={c.num ? "r mono" : undefined}>
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Barras horizontais em cinza. `right` e o texto a direita (ex.: percentual).
export function BarList({ items }: { items: { label: string; value: unknown; right?: string }[] }) {
  if (items.length === 0) return <Empty />;
  const max = Math.max(...items.map((i) => num(i.value) ?? 0), 1);
  return (
    <ul className="adm-bars">
      {items.map((it, i) => {
        const v = num(it.value);
        return (
          <li key={i}>
            <div className="adm-bar-head">
              <span>{it.label}</span>
              <span className="mono">
                {v === null ? "—" : v.toLocaleString("pt-BR")}
                {it.right && <span className="adm-bar-right"> · {it.right}</span>}
              </span>
            </div>
            <div className="adm-bar-track">
              <div className="adm-bar-fill" style={{ width: `${((v ?? 0) / max) * 100}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// Colunas verticais (simples ou empilhadas).
export function Columns({
  rows,
  legend,
}: {
  rows: { label: string; values: number[] }[];
  legend?: string[];
}) {
  if (rows.length === 0) return <Empty />;
  const totals = rows.map((r) => r.values.reduce((a, b) => a + b, 0));
  const max = Math.max(...totals, 1);
  return (
    <div>
      <div className="adm-scroll">
        <div className="adm-cols" style={{ minWidth: rows.length * 38 }}>
          {rows.map((r, i) => (
            <div key={i} className="adm-col" title={`${r.label}: ${totals[i]}`}>
              <span className="mono adm-col-total">{totals[i].toLocaleString("pt-BR")}</span>
              <div className="adm-col-stack" style={{ height: `${(totals[i] / max) * 100}%` }}>
                {r.values.map((v, j) => (
                  <div key={j} className={`adm-seg seg-${j}`} style={{ flexGrow: v }} />
                ))}
              </div>
              <span className="mono adm-col-label">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
      {legend && (
        <div className="adm-legend">
          {legend.map((l, j) => (
            <span key={l}>
              <i className={`adm-swatch seg-${j}`} /> {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function LineChart({ points }: { points: { x: string; y: number }[] }) {
  if (points.length === 0) return <Empty />;
  const W = 600;
  const H = 160;
  const pad = 6;
  const max = Math.max(...points.map((p) => p.y), 1);
  const step = points.length > 1 ? (W - pad * 2) / (points.length - 1) : 0;
  const xy = points.map((p, i) => [pad + i * step, H - pad - (p.y / max) * (H - pad * 2)] as const);
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${pad},${H - pad} ${line} ${xy[xy.length - 1][0].toFixed(1)},${H - pad}`;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="adm-line" role="img" aria-label="Série diária de usuários ativos">
        <polygon points={area} className="adm-line-area" />
        <polyline points={line} className="adm-line-stroke" fill="none" />
        {xy.length === 1 && <circle cx={xy[0][0]} cy={xy[0][1]} r={3} className="adm-line-dot" />}
      </svg>
      <div className="adm-line-axis mono">
        <span>{points[0].x}</span>
        <span>máx. {max.toLocaleString("pt-BR")}</span>
        <span>{points[points.length - 1].x}</span>
      </div>
    </div>
  );
}
