import { Foot } from "@/app/components/chrome";

function HeroLogo() {
  return (
    <div className="hero-logo">
      <svg viewBox="0 0 56 72" width="34" height="44" aria-hidden="true">
        <path d="M28 4 C 28 4, 4 32, 4 48 C 4 62, 14 68, 28 68 C 42 68, 52 62, 52 48 C 52 32, 28 4, 28 4 Z" fill="var(--accent)" />
        <path d="M 8 46 L 18 46 L 21 42 L 24 46 L 28 46 L 30 30 L 33 56 L 36 46 L 40 44 L 43 46 L 48 46" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="brand-text">
        <span className="brand-tbls">TBLS</span>
        <span className="brand-lab">Lab</span>
      </span>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg className="ico-svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
      <path d="M16.36 12.84c-.02-2.1 1.72-3.11 1.8-3.16-.98-1.43-2.5-1.63-3.04-1.65-1.29-.13-2.52.76-3.18.76-.65 0-1.67-.74-2.74-.72-1.41.02-2.71.82-3.43 2.08-1.46 2.54-.37 6.29 1.05 8.35.69 1.01 1.52 2.14 2.61 2.1 1.05-.04 1.44-.68 2.71-.68 1.27 0 1.62.68 2.73.66 1.13-.02 1.84-1.03 2.53-2.04.8-1.17 1.13-2.3 1.15-2.36-.03-.01-2.2-.84-2.22-3.34-.02.01.95-.6.95-.6zM14.27 6.5c.58-.7.97-1.68.86-2.65-.83.03-1.84.55-2.44 1.25-.54.62-1.01 1.61-.88 2.56.93.07 1.88-.47 2.46-1.16z"/>
    </svg>
  );
}

function StoreButtons() {
  return (
    <div className="cta-row">
      <a
        className="store-btn live"
        href="https://apps.apple.com/br/app/tubeless-lab/id6775593172"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Baixar na App Store"
      >
        <span className="ico"><AppleIcon /></span>
        <span className="tt"><small>Baixar na</small><b>App Store</b></span>
      </a>
      <a
      <className="store-btn live"
        href="https://play.google.com/store/apps/details?id=com.tubelesslab.app"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Baixar no Google Play"
      >
        <span className="ico">▶</span>
        <span className="tt"><small>Baixar no</small><b>Google Play</b></span>
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <HeroLogo />
        <div className="tagline">Manutenção tubeless inteligente</div>
        <h1>A manutenção do seu tubeless, <span className="hl">sob controle.</span></h1>
        <p className="hero-sub">
          Saiba a saúde do selante de cada pneu — antes de rodar. Sem abrir, sem adivinhar.
        </p>
        <StoreButtons />
      </section>

      {/* PROBLEMA */}
      <section className="problem">
        <div className="section">
          <div className="section-eyebrow">O problema</div>
          <h2>O selante não avisa quando seca.</h2>
          <p className="lead">
            O líquido tubeless perde a eficácia com o tempo, mas por fora o pneu parece o mesmo.
            Sem um registro, é fácil perder a conta de quando recarregou — e descobrir que o selante
            secou justamente quando você mais precisa dele, longe de casa.
          </p>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="section">
        <div className="section-eyebrow">Como o app ajuda</div>
        <h2>Um registro que trabalha por você.</h2>
        <div className="features">
          <div className="feature">
            <div className="fico">📊</div>
            <h3>Saúde por pneu</h3>
            <p>Cada pneu tem um indicador de saúde do selante, calculado a partir da última recarga e da vida útil do produto que você usa.</p>
          </div>
          <div className="feature">
            <div className="fico">🔔</div>
            <h3>Aviso antes de secar</h3>
            <p>Receba um alerta quando o selante estiver chegando ao fim — com tempo de recarregar antes do próximo pedal, não depois.</p>
          </div>
          <div className="feature">
            <div className="fico">🌡️</div>
            <h3>Ajustado ao seu clima</h3>
            <p>Tipo de pneu e o clima da sua cidade influenciam a estimativa, deixando a previsão mais próxima da sua realidade.</p>
          </div>
        </div>
      </section>

      {/* SHOWCASE 1 — dial */}
      <section className="section">
        <div className="showcase">
          <div className="shot">
            <img src="/tire-detail.png" alt="Tela de detalhe do pneu mostrando 91% de saúde do selante" />
          </div>
          <div className="showcase-text">
            <div className="pill">Saúde do selante</div>
            <h3>Um número que você entende na hora.</h3>
            <p>
              Abriu o app, viu o percentual. Verde quer dizer protegido; conforme o selante envelhece,
              o indicador cai e muda de cor. Registrar uma recarga é um toque — e o histórico fica salvo.
            </p>
          </div>
        </div>
      </section>

      {/* SHOWCASE 2 — garagem (diferencial) */}
      <section className="section">
        <div className="showcase flip">
          <div className="shot">
            <img src="/garage.png" alt="Tela da garagem com vários jogos de rodas e suas saúdes" />
          </div>
          <div className="showcase-text">
            <div className="pill">Sua garagem</div>
            <h3>Vários jogos de rodas? Todos sob controle.</h3>
            <p>
              Roda de treino, roda de prova, par de reserva parado há semanas. O app acompanha cada jogo
              separadamente, então você sabe na hora qual está pronto para rodar e qual precisa de atenção
              antes de sair.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="final-cta">
        <h2>Comece a rodar tranquilo.</h2>
        <p>Já disponível na App Store e no Google Play.</p>
        <StoreButtons />
      </section>

      <Foot />
    </div>
  );
}
