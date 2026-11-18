/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireSession } from "@/lib/admin/guard";
import { getAcquisitionSnapshot } from "@/lib/admin/acquisition";
import { PRESETS, parsePeriod, todaySP } from "@/lib/admin/acquisition-validate";
import { Header } from "../_components/Header";
import { BarList, Card, DataTable, Grid, Panel, Section } from "../_components/ui";
import { arr, fmtN, fmtPct, num } from "../_components/format";
import { AcqRefresh } from "./_components/AcqRefresh";
import { NewUsersChart } from "./_components/NewUsersChart";
import { MilestonesPanel, SpendPanel } from "./_components/ManagePanels";

export const dynamic = "force-dynamic";

type R = Record<string, any>;

const dmy = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
const brl = (v: number | null) => (v === null ? "—" : `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const ratio = (a: unknown, b: unknown): number | null => {
  const x = num(a);
  const y = num(b);
  return x !== null && y !== null && y > 0 ? x / y : null;
};
const pctOf = (a: unknown, b: unknown): string => {
  const r = ratio(a, b);
  return r === null ? "—" : fmtPct(r * 100);
};

export default async function AquisicaoPage({
  searchParams,
}: {
  searchParams: Promise<{ dias?: string; de?: string; ate?: string }>;
}) {
  await requireSession();
  const period = parsePeriod(await searchParams);
  let snapshot = null;
  let loadError = false;
  try {
    snapshot = await getAcquisitionSnapshot(period.from, period.to);
  } catch {
    loadError = true;
  }
  const d: R = snapshot?.data ?? {};
  const t: R = d.totals ?? {};
  const spend = num(d.spend_total);
  const funnel: R = d.funnel ?? {};
  const funnelBase = num(funnel.registrou) ?? 0;
  const weekly = arr<R>(d.retention_weekly);

  const quick = (n: number) => (
    <a key={n} className="adm-chip" href={`/admin/aquisicao?dias=${n}`} aria-pressed={period.preset === n}>
      {n} dias
    </a>
  );

  return (
    <>
      <Header page="aquisicao" updatedAt={snapshot?.created_at} refresh={<AcqRefresh from={period.from} to={period.to} />} />
      <main className="adm-main">
        <Section title="Período">
          <Panel>
            <div className="adm-chips">
              {PRESETS.map(quick)}
              <form className="acq-range" method="get" action="/admin/aquisicao">
                <input type="date" name="de" defaultValue={period.from} max={todaySP()} required aria-label="De" />
                <input type="date" name="ate" defaultValue={period.to} max={todaySP()} required aria-label="Até" />
                <button type="submit" className="adm-btn">
                  Aplicar
                </button>
              </form>
            </div>
            <p className="adm-hint">
              {dmy(period.from)} a {dmy(period.to)} · fuso America/Sao_Paulo · máx. 180 dias
            </p>
          </Panel>
        </Section>

        {loadError ? (
          <div className="adm-panel adm-empty-big">Não foi possível carregar. Tente atualizar.</div>
        ) : !snapshot ? (
          <div className="adm-panel adm-empty-big">Nenhum snapshot para este período. Clique em Atualizar.</div>
        ) : (
          <>
            <Section title="Resumo">
              <Grid>
                <Card label="Novos usuários" value={fmtN(t.novos)} />
                <Card label="Investimento no período" value={brl(spend)} hint="gasto rateado por dia" />
                <Card label="R$ por usuário novo" value={brl(ratio(spend, t.novos))} />
                <Card
                  label="R$ por usuário ativado"
                  value={brl(ratio(spend, t.wheel7))}
                  hint="ativado = roda cadastrada em até 7 dias"
                />
                <Card label="Ativação em 24 h" value={pctOf(t.wheel24, t.elig24)} hint={`${fmtN(t.wheel24)} de ${fmtN(t.elig24)} com 24 h completas`} />
                <Card label="Ativação em 7 dias" value={pctOf(t.wheel7, t.elig7)} hint={`${fmtN(t.wheel7)} de ${fmtN(t.elig7)} com 7 dias completos`} />
                <Card label="Manutenção em 7 dias" value={pctOf(t.maint7, t.elig7)} hint={`${fmtN(t.maint7)} de ${fmtN(t.elig7)} com 7 dias completos`} />
              </Grid>
            </Section>

            <Section title="Novos usuários por dia">
              <Panel>
                <NewUsersChart daily={arr<R>(d.daily)} milestones={arr<R>(d.milestones)} />
                <p className="adm-hint">
                  Plataforma = primeiro evento do app do usuário. Eventos só existem a partir da v1.2.2 (fim de
                  outubro); quem entrou antes aparece como “sem evento”.
                </p>
              </Panel>
            </Section>

            <Section title="Retenção por coorte semanal">
              <Panel>
                <DataTable
                  rows={weekly}
                  cols={[
                    { label: "Semana (seg.)", render: (r) => dmy(String(r.semana)) },
                    { label: "Usuários", num: true, render: (r) => fmtN(r.usuarios) },
                    { label: "D1", num: true, render: (r) => `${pctOf(r.d1, r.elig1)} (${fmtN(r.d1)}/${fmtN(r.elig1)})` },
                    { label: "D7", num: true, render: (r) => `${pctOf(r.d7, r.elig7)} (${fmtN(r.d7)}/${fmtN(r.elig7)})` },
                    { label: "D30", num: true, render: (r) => `${pctOf(r.d30, r.elig30)} (${fmtN(r.d30)}/${fmtN(r.elig30)})` },
                  ]}
                />
                <p className="adm-hint">
                  Retido = abriu o app exatamente no dia +1, +7 ou +30 após o cadastro. Só entram na conta quem já
                  completou a janela.
                </p>
              </Panel>
            </Section>

            <Section title="Funil de onboarding (coorte do período)">
              <Panel>
                <BarList
                  items={[
                    ["Registrou", funnel.registrou],
                    ["Abriu o tour", funnel.abriu_tour],
                    ["Completou o tour", funnel.completou_tour],
                    ["Cadastrou roda", funnel.cadastrou_roda],
                    ["1ª manutenção", funnel.primeira_manutencao],
                  ].map(([label, value]) => ({
                    label: label as string,
                    value,
                    right: funnelBase > 0 && num(value) !== null ? fmtPct(((num(value) as number) / funnelBase) * 100) : undefined,
                  }))}
                />
              </Panel>
            </Section>

            <Section title="Investimento e marcos">
              <div className="adm-two">
                <SpendPanel items={arr<any>(d.spend_items)} from={period.from} to={period.to} />
                <MilestonesPanel items={arr<any>(d.milestones)} from={period.from} to={period.to} />
              </div>
            </Section>
          </>
        )}
      </main>
    </>
  );
}
