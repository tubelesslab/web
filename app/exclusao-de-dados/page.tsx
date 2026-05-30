import { Masthead, Foot } from "../components/chrome";

export const metadata = {
  title: "Exclusão de Dados — Tubeless Lab",
};

export default function ExclusaoDeDados() {
  return (
    <>
      <Masthead />
      <main className="shell doc">
        <div className="eyebrow">Seus dados, suas regras</div>
        <h1>Exclusão de Dados e Conta</h1>
        <p className="updated">Última atualização: 30 de maio de 2026</p>

        <p>
          Você pode solicitar a exclusão da sua conta do <strong>Tubeless Lab</strong> e de todos os dados
          associados a ela. Há duas formas: pelo próprio app (recomendado) ou por e-mail, caso você não
          consiga acessar o app.
        </p>

        <h2><span className="num">01</span>Pelo aplicativo (recomendado)</h2>
        <ul>
          <li>Abra o Tubeless Lab e faça login;</li>
          <li>Vá em <strong>Configurações</strong>;</li>
          <li>Toque em <strong>Excluir conta</strong>;</li>
          <li>Confirme a solicitação.</li>
        </ul>
        <p>
          Sua conta entra imediatamente em um período de carência e você pode cancelar a exclusão a qualquer
          momento durante esse prazo, voltando a fazer login.
        </p>

        <h2><span className="num">02</span>Por e-mail</h2>
        <p>
          Se você não consegue acessar o app, envie um e-mail para
          <a href="mailto:setup@tubelesslab.com?subject=Exclus%C3%A3o%20de%20conta%20-%20Tubeless%20Lab"> setup@tubelesslab.com</a> com
          o assunto <strong>&quot;Exclusão de conta&quot;</strong>, usando o mesmo endereço de e-mail da sua
          conta. Confirmaremos a solicitação e processaremos a exclusão.
        </p>
        <div className="contact-card">
          <div><span className="k">Para:&nbsp;</span><span className="v">setup@tubelesslab.com</span></div>
          <div><span className="k">Assunto:&nbsp;</span><span className="v">Exclusão de conta</span></div>
          <div><span className="k">Inclua:&nbsp;</span><span className="v">o e-mail da sua conta</span></div>
        </div>

        <h2><span className="num">03</span>O que é excluído</h2>
        <p>Ao concluir a exclusão, removemos permanentemente:</p>
        <ul>
          <li>Sua conta e credenciais de autenticação;</li>
          <li>Suas rodas e pneus cadastrados;</li>
          <li>Todo o histórico de manutenções;</li>
          <li>O histórico de saúde do selante;</li>
          <li>Suas preferências (cidade de referência, idioma, etc.).</li>
        </ul>

        <h2><span className="num">04</span>Prazo</h2>
        <div className="callout">
          <div className="label">Período de carência: 30 dias</div>
          <p>
            Após a solicitação, seus dados ficam em carência por <strong>30 dias</strong>. Durante esse
            período você pode reverter a exclusão fazendo login novamente. Passados os 30 dias, todos os dados
            listados acima são <strong>apagados em definitivo</strong> e não podem ser recuperados.
          </p>
        </div>

        <h2><span className="num">05</span>Dados retidos</h2>
        <p>
          Após a exclusão, não retemos dados pessoais identificáveis. Eventuais registros mínimos podem ser
          mantidos apenas quando exigidos por obrigação legal, sempre de forma desvinculada da sua identidade.
        </p>

        <p style={{ marginTop: 36 }}>
          Dúvidas? Fale com a gente em <a href="mailto:setup@tubelesslab.com">setup@tubelesslab.com</a>. Veja
          também nossa <a href="/privacidade">Política de Privacidade</a>.
        </p>
      </main>
      <Foot />
    </>
  );
}
