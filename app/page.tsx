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

function StoreButtons() {
  return (
    <div className="cta-row">
      <span className="store-btn" aria-label="App Store — em breve">
        <span className="ico"></span>
        <span className="tt"><small>Em breve na</small><b>App Store</b></span>
        <span className="soon-tag">Em breve</span>
      </span>
      <span className="store-btn" aria-label="Google Play — em breve">
        <span className="ico">▶</span>
        <span className="tt"><small>Em breve no</small><b>Google Play</b></span>
        <span className="soon-tag">Em breve</span>
      </span>
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
        <p>Em breve na App Store e no Google Play.</p>
        <StoreButtons />
      </section>

      <Foot />
    </div>
  );
}
