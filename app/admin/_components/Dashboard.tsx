/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarList, Card, Columns, DataTable, Empty, Grid, LineChart, Panel, Section, SubTitle } from "./ui";
import { arr, fmtDate, fmtDateTime, fmtN, fmtPct, fmtText, num, tr } from "./format";

type R = Record<string, any>;

const STRAVA_LIMIT = 10;
const FUNNEL_LABELS = ["Cadastro", "Rodas", "Manutenção", "Strava"];

const tone = (v: unknown, t: "warn" | "crit") => ((num(v) ?? 0) > 0 ? t : undefined);

export function Dashboard({ data }: { data: R }) {
  const d: R = data ?? {};
  const ov: R = d.overview ?? {};
  const act: R = d.activity ?? {};
  const dev: R = d.devices ?? {};
  const eng: R = d.engagement_30d ?? {};
  const shop: R = d.shop ?? {};

  const funnel = arr<R>(d.activation_funnel);
  const funnelBase = num(funnel[0]?.users) ?? 0;

  const sealantByBike = arr<R>(d.sealant_by_bike_type);
  const bikeGroups = [...new Set(sealantByBike.map((r) => r.bike_type))];

  const ctr =
    num(shop.views_30d) && num(shop.clicks_30d) !== null
      ? ((num(shop.clicks_30d) as number) / (num(shop.views_30d) as number)) * 100
      : null;

  const now = Date.now();

  return (
    <>
      <Section title="Visão geral">
        <Grid>
          <Card label="Usuários" value={fmtN(ov.total_users)} />
          <Card label="Usuários com rodas"value={fmtN(ov.users_with_wheels)} />
          <Card label="Com manutenção" value={fmtN(ov.users_with_maint)} />
          <Card label="Conjuntos de rodas"value={fmtN(ov.wheelsets)} />
          <Card label="Pneus" value={fmtN(ov.tires)} />
          <Card label="Manutenções" value={fmtN(ov.maintenances)} />
          <Card label="Furos" value={fmtN(ov.punctures)} />
          <Card
            label="Strava conectado"
            value={num(ov.strava_connected) === null ? "—" : `${fmtN(ov.strava_connected)} / ${STRAVA_LIMIT}`}
          />
          <Card label="Cadastros 7d" value={fmtN(ov.signups_7d)} />
          <Card label="Cadastros 30d" value={fmtN(ov.signups_30d)} />
          <Card label="Pneus atrasados" value={fmtN(ov.tires_overdue)} tone={tone(ov.tires_overdue, "warn")} />
          <Card label="Pneus sem manutenção" value={fmtN(ov.tires_never_maintained)} />
          <Card
            label="Exclusões pendentes"
            value={fmtN(ov.pending_deletions)}
            tone={tone(ov.pending_deletions, "crit")}
          />
        </Grid>
      </Section>

      <Section title="Funil de ativação">
        <Panel>
          <BarList
            items={funnel.map((f, i) => ({
              label: FUNNEL_LABELS[i] ?? fmtText(f.step),
              value: f.users,
              right: funnelBase > 0 && num(f.users) !== null ? fmtPct(((num(f.users) as number) / funnelBase) * 100) : undefined,
            }))}
          />
        </Panel>
      </Section>

      <Section title="Atividade">
        <Grid>
          <Card label="DAU (1d)" value={fmtN(act.dau_1d)} hint="eventos do app" />
          <Card label="WAU (7d)" value={fmtN(act.wau_7d)} hint="eventos do app" />
          <Card label="MAU (30d)" value={fmtN(act.mau_30d)} hint="eventos do app" />
          <Card label="Sessões 1d" value={fmtN(act.session_1d)} hint="estimativa por sessão" />
          <Card label="Sessões 7d" value={fmtN(act.session_7d)} hint="estimativa por sessão" />
          <Card label="Sessões 30d" value={fmtN(act.session_30d)} hint="estimativa por sessão" />
          <Card label="Logins 7d" value={fmtN(act.sign_in_7d)} hint="estimativa por sessão" />
          <Card label="Logins 30d" value={fmtN(act.sign_in_30d)} hint="estimativa por sessão" />
        </Grid>
        <div className="adm-two">
          <Panel title="Usuários ativos por dia">
            <LineChart
              points={arr<R>(act.dau_series).map((p) => ({ x: fmtText(p.day), y: num(p.users) ?? 0 }))}
            />
          </Panel>
          <Panel title="Cadastros por mês">
            <Columns
              rows={arr<R>(d.signups_by_month).map((m) => ({ label: fmtText(m.month), values: [num(m.users) ?? 0] }))}
            />
          </Panel>
        </div>
      </Section>

      <Section title="Dispositivos">
        <div className="adm-two">
          <Panel title="Plataforma">
            <BarList items={arr<R>(dev.platform).map((p) => ({ label: fmtText(p.platform), value: p.users }))} />
          </Panel>
          <Panel title="Versão do app">
            <DataTable
              rows={arr<R>(dev.app_version)}
              cols={[
                { label: "Versão", render: (r) => fmtText(r.version) },
                { label: "Plataforma", render: (r) => fmtText(r.platform) },
                { label: "Usuários", num: true, render: (r) => fmtN(r.users) },
              ]}
            />
          </Panel>
          <Panel title="Versão do SO">
            <DataTable
              rows={arr<R>(dev.os_version)}
              cols={[
                { label: "Plataforma", render: (r) => fmtText(r.platform) },
                { label: "SO", render: (r) => fmtText(r.os) },
                { label: "Usuários", num: true, render: (r) => fmtN(r.users) },
              ]}
            />
          </Panel>
        </div>
      </Section>

      <Section title="Rodas e pneus">
        <div className="adm-two">
          <Panel title="Tipo de bike">
            <BarList
              items={arr<R>(d.bike_types).map((b) => ({
                label: tr("bike", b.type),
                value: b.wheelsets,
                right: `${fmtN(b.users)} usuários · ${fmtPct(b.pct)}`,
              }))}
            />
          </Panel>
          <Panel title="Marcas de pneu">
            <BarList
              items={arr<R>(d.tire_brands).map((b) => ({ label: fmtText(b.brand), value: b.tires, right: fmtPct(b.pct) }))}
            />
          </Panel>
        </div>
        <Panel title="Medidas">
          <DataTable
            rows={arr<R>(d.tire_sizes)}
            cols={[
              { label: "Medida", render: (r) => fmtText(r.size) },
              { label: "Bike", render: (r) => tr("bike", r.bike_type) },
              { label: "Pneus", num: true, render: (r) => fmtN(r.tires) },
              { label: "Capacidade média (ml)", num: true, render: (r) => fmtN(r.avg_capacity_ml, 1) },
            ]}
          />
        </Panel>
        <Panel title="Modelos">
          <DataTable
            rows={arr<R>(d.tire_models)}
            cols={[
              { label: "Modelo", render: (r) => fmtText(r.model) },
              { label: "Medida", render: (r) => fmtText(r.size) },
              { label: "Bike", render: (r) => tr("bike", r.bike_type) },
              { label: "Pneus", num: true, render: (r) => fmtN(r.tires) },
              { label: "Rodas", num: true, render: (r) => fmtN(r.wheelsets) },
              { label: "Usuários", num: true, render: (r) => fmtN(r.users) },
            ]}
          />
        </Panel>
      </Section>

      <Section title="Selantes">
        <div className="adm-two">
          <Panel title="Uso em manutenções">
            <BarList
              items={arr<R>(d.sealant_share).map((s) => ({
                label: [s.brand, s.model].filter(Boolean).join(" ") || "—",
                value: s.maintenances,
                right: fmtPct(s.pct),
              }))}
            />
          </Panel>
          <Panel title="Instalado hoje">
            <BarList
              items={arr<R>(d.sealant_installed).map((s) => ({
                label: [s.brand, s.model].filter(Boolean).join(" ") || "—",
                value: s.tires,
                right: fmtPct(s.pct),
              }))}
            />
          </Panel>
        </div>
        <Panel title="Selante por tipo de bike">
          {bikeGroups.length === 0 ? (
            <Empty />
          ) : (
            bikeGroups.map((g) => (
              <div key={String(g)} className="adm-group">
                <SubTitle>{tr("bike", g)}</SubTitle>
                <DataTable
                  rows={sealantByBike.filter((r) => r.bike_type === g)}
                  cols={[
                    { label: "Marca", render: (r) => fmtText(r.brand) },
                    { label: "Modelo", render: (r) => fmtText(r.model) },
                    { label: "Manutenções", num: true, render: (r) => fmtN(r.maintenances) },
                  ]}
                />
              </div>
            ))
          )}
        </Panel>
      </Section>

      <Section title="Manutenções">
        <Panel title="Por tipo">
          <DataTable
            rows={arr<R>(d.maintenance_by_type)}
            cols={[
              { label: "Tipo", render: (r) => tr("maint", r.type) },
              { label: "Total", num: true, render: (r) => fmtN(r.total) },
              { label: "Com km", num: true, render: (r) => fmtN(r.with_km) },
              { label: "ml médio", num: true, render: (r) => fmtN(r.avg_ml, 1) },
            ]}
          />
        </Panel>
        <Panel title="Por mês">
          <Columns
            legend={["Troca completa", "Top-off"]}
            rows={arr<R>(d.maintenance_by_month).map((m) => ({
              label: fmtText(m.month),
              values: [num(m.full_replacement) ?? 0, num(m.top_off) ?? 0],
            }))}
          />
        </Panel>
        <SubTitle>Intervalos entre manutenções</SubTitle>
        {arr<R>(d.maintenance_intervals).length === 0 ? (
          <Empty />
        ) : (
          <Grid>
            {arr<R>(d.maintenance_intervals).map((m, i) => (
              <div key={i} className="adm-card">
                <div className="adm-label">{tr("maint", m.type)}</div>
                <div className="adm-kv">
                  <span>Pares</span>
                  <span className="mono">{fmtN(m.pairs)}</span>
                  <span>Dias (média / mediana)</span>
                  <span className="mono">
                    {fmtN(m.avg_days, 1)} / {fmtN(m.median_days, 1)}
                  </span>
                  <span>Km (média / mediana)</span>
                  <span className="mono">
                    {fmtN(m.avg_km, 1)} / {fmtN(m.median_km, 1)}
                  </span>
                </div>
              </div>
            ))}
          </Grid>
        )}
        <div className="adm-two">
          <Panel title="Condição do selante">
            <BarList items={arr<R>(d.sealant_condition).map((c) => ({ label: tr("condition", c.condition), value: c.total }))} />
          </Panel>
          <Panel title="Furos por resultado">
            <BarList items={arr<R>(d.punctures_by_outcome).map((p) => ({ label: tr("outcome", p.outcome), value: p.total }))} />
          </Panel>
        </div>
      </Section>

      <Section title="Engajamento (30 dias)">
        <Grid>
          <Card
            label="Formulário de manutenção → salvo"
            value={`${fmtN(eng.maintenance_form_opens)} → ${fmtN(eng.maintenances_saved)}`}
          />
          <Card
            label="Formulário de furo → salvo"
            value={`${fmtN(eng.puncture_form_opens)} → ${fmtN(eng.punctures_saved)}`}
          />
          <Card label="Conexões Strava iniciadas" value={fmtN(eng.strava_connect_starts)} />
          <Card
            label="Erros de conexão Strava"
            value={fmtN(eng.strava_connect_errors)}
            tone={tone(eng.strava_connect_errors, "warn")}
          />
        </Grid>
        <div className="adm-two">
          <Panel title="Aberturas de informação">
            <BarList items={arr<R>(eng.info_opens).map((i) => ({ label: fmtText(i.key), value: i.total }))} />
          </Panel>
          <Panel title="Aberturas de notificação">
            <BarList items={arr<R>(eng.notification_opens).map((n) => ({ label: fmtText(n.kind), value: n.total }))} />
          </Panel>
        </div>
      </Section>

      <Section title="Shop">
        <Grid>
          <Card label="Produtos ativos" value={fmtN(shop.active_products)} />
          <Card label="Views 7d" value={fmtN(shop.views_7d)} />
          <Card label="Views 30d" value={fmtN(shop.views_30d)} />
          <Card label="Visitantes 30d" value={fmtN(shop.viewers_30d)} />
          <Card label="Cliques 7d" value={fmtN(shop.clicks_7d)} />
          <Card label="Cliques 30d" value={fmtN(shop.clicks_30d)} />
          <Card label="Clicadores 30d" value={fmtN(shop.clickers_30d)} />
          <Card label="CTR 30d" value={fmtPct(ctr)} />
        </Grid>
        <div className="adm-two">
          <Panel title="Cliques por categoria (30d)">
            <BarList
              items={arr<R>(shop.clicks_by_category_30d).map((c) => ({
                label: tr("shop", c.category),
                value: c.clicks,
              }))}
            />
          </Panel>
          <Panel title="Cliques por posição (30d)">
            <BarList
              items={arr<R>(shop.clicks_by_placement_30d).map((c) => ({
                label: fmtText(c.placement),
                value: c.clicks,
              }))}
            />
          </Panel>
          <Panel title="Filtros (30d)">
            <BarList
              items={arr<R>(shop.filters_30d).map((c) => ({
                label: tr("shop", c.category),
                value: c.total,
              }))}
            />
          </Panel>
        </div>
        <Panel title="Produtos mais clicados (30d)">
          <DataTable
            rows={arr<R>(shop.top_products_30d)}
            cols={[
              { label: "Produto", render: (r) => fmtText(r.title) },
              { label: "Categoria", render: (r) => tr("shop", r.category) },
              { label: "Cliques", num: true, render: (r) => fmtN(r.clicks) },
            ]}
          />
        </Panel>
      </Section>

      <Section title="Strava">
        <Panel>
          <DataTable
            rows={arr<R>(d.strava)}
            cols={[
              { label: "E-mail", render: (r) => fmtText(r.email) },
              { label: "Atleta", num: true, render: (r) => fmtText(r.athlete_id) },
              {
                label: "Token",
                render: (r) => {
                  const t = r.token_expires_at ? Date.parse(r.token_expires_at) : NaN;
                  if (Number.isNaN(t)) return "—";
                  return t > now ? "Válido" : "Expirado";
                },
              },
              { label: "Expira em", num: true, render: (r) => fmtDateTime(r.token_expires_at) },
              { label: "Gear vinculado", num: true, render: (r) => fmtN(r.gear_linked) },
            ]}
          />
        </Panel>
      </Section>

      <Section title="Usuários mais ativos">
        <Panel>
          <DataTable
            rows={arr<R>(d.top_users)}
            cols={[
              { label: "E-mail", render: (r) => fmtText(r.email) },
              { label: "Rodas", num: true, render: (r) => fmtN(r.wheelsets) },
              { label: "Manutenções", num: true, render: (r) => fmtN(r.maintenances) },
              { label: "Troca completa", num: true, render: (r) => fmtN(r.full_replacement) },
              { label: "Top-off", num: true, render: (r) => fmtN(r.top_off) },
              { label: "Última roda criada", num: true, render: (r) => fmtDate(r.last_wheelset_at) },
              { label: "Última abertura", num: true, render: (r) => fmtDateTime(r.last_open_at) },
            ]}
          />
        </Panel>
      </Section>
    </>
  );
}
