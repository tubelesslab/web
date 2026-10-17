import { Masthead, Foot } from "@/app/components/chrome";

export const metadata = {
  title: "Suporte Strava — Tubeless Lab",
  description:
    "Suporte para a integração com o Strava no Tubeless Lab: como conectar, desconectar e o que acontece com os seus dados.",
};

export default function StravaSuporte() {
  return (
    <>
      <Masthead />
      <main className="shell doc">
        <div className="eyebrow">Integração com Strava</div>
        <h1>Suporte Strava</h1>
        <p className="updated">
          Última atualização: 17 de outubro de 2026 · <a href="/strava/en">Read in English</a>
        </p>

        <p>
          Ajuda para quem conecta o Strava ao <strong>Tubeless Lab</strong> (TBLS Lab): como a integração
          funciona, como desconectar e o que acontece com os seus dados.
        </p>

        <h2><span className="num">01</span>Fale com o suporte</h2>
        <p>
          Dúvidas, problemas na conexão ou pedidos sobre os seus dados? Escreva para nós e responderemos o
          mais rápido possível.
        </p>
        <div className="contact-card">
          <div><span className="k">E-mail:&nbsp;</span><span className="v">setup@tubelesslab.com</span></div>
          <div><span className="k">Assunto:&nbsp;</span><span className="v">Suporte Strava</span></div>
        </div>
        <p>
          <a href="mailto:setup@tubelesslab.com?subject=Suporte%20Strava">Enviar e-mail para o suporte</a>
        </p>

        <h2><span className="num">02</span>O que a integração faz</h2>
        <p>
          Ao conectar o Strava, o Tubeless Lab lê a distância das suas próprias atividades e os equipamentos
          (bikes) da sua conta. Você vincula cada bike do Strava a um conjunto de rodas no app, e a distância é
          usada para:
        </p>
        <ul>
          <li>mostrar o <strong>desgaste do pneu</strong> (km acumulados desde a instalação);</li>
          <li>aplicar um ajuste suave na <strong>sua própria</strong> estimativa de vida do selante.</li>
        </ul>
        <p>Essas informações aparecem somente para você. Não as compartilhamos com outros usuários.</p>

        <h2><span className="num">03</span>Como conectar</h2>
        <ol>
          <li>Abra o app e vá em <strong>Config. → Integrações</strong>;</li>
          <li>Toque em <strong>Connect with Strava</strong> e autorize o acesso na página do Strava;</li>
          <li>Em <strong>Editar rodas</strong>, escolha a bike (equipamento) correspondente do Strava;</li>
          <li>A partir daí, os quilômetros sincronizam automaticamente.</li>
        </ol>

        <h2><span className="num">04</span>Como desconectar</h2>
        <ul>
          <li><strong>No app:</strong> vá em <strong>Config. → Integrações</strong> e toque em <strong>Desconectar do Strava</strong>;</li>
          <li>
            <strong>No Strava:</strong> acesse{" "}
            <a href="https://www.strava.com/settings/apps" rel="noopener">strava.com/settings/apps</a> e
            revogue o acesso do Tubeless Lab.
          </li>
        </ul>

        <h2><span className="num">05</span>Seus dados</h2>
        <div className="callout">
          <div className="label">Resumo</div>
          <p>
            Usamos os dados do Strava <strong>somente</strong> para oferecer recursos ao atleta que os
            autorizou. Não vendemos, não compartilhamos, não agregamos entre usuários e não usamos esses dados
            para treinar nenhum modelo, inclusive de IA.
          </p>
        </div>
        <ul>
          <li>Ao desconectar, apagamos os dados do Strava que mantemos: o vínculo do equipamento e a última distância sincronizada;</li>
          <li>
            O contador de desgaste do pneu é um número calculado para as suas próprias rodas. Ele permanece na
            sua conta após a desconexão e pode ser zerado a qualquer momento em <strong>Editar rodas</strong>;
          </li>
          <li>Os dados do Strava ficam em cache por no máximo 7 dias;</li>
          <li>
            Para apagar tudo, exclua sua conta no app ou veja a página de{" "}
            <a href="/exclusao-de-dados">Exclusão de Dados</a>.
          </li>
        </ul>
        <p>
          Veja também a nossa <a href="/privacidade">Política de Privacidade</a>.
        </p>

        <h2><span className="num">06</span>Solução de problemas</h2>
        <h3>Os km não atualizam</h3>
        <p>
          Abra o app para sincronizar e confirme que o conjunto de rodas está vinculado à bike correta do
          Strava.
        </p>
        <h3>A bike que eu quero não aparece</h3>
        <p>
          Verifique se ela existe no seu perfil do Strava, em Equipamentos, e se a atividade foi gravada com
          ela.
        </p>
        <h3>Vinculei a bike errada</h3>
        <p>Abra <strong>Editar rodas</strong> e escolha o equipamento correto.</p>
        <h3>Continua com problema?</h3>
        <p>
          Escreva para <a href="mailto:setup@tubelesslab.com">setup@tubelesslab.com</a>.
        </p>

        <div className="callout">
          <div className="label">Strava</div>
          <p>
            Powered by Strava. O Tubeless Lab não é afiliado, endossado nem patrocinado pela Strava, Inc.
            Strava é marca registrada da Strava, Inc.
          </p>
        </div>
      </main>
      <Foot />
    </>
  );
}
