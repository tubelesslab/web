import { Masthead, Foot } from "@/app/components/chrome";

export const metadata = {
  title: "Política de Privacidade — Tubeless Lab",
};

export default function Privacidade() {
  return (
    <>
      <Masthead />
      <main className="shell doc">
        <div className="eyebrow">Documento legal</div>
        <h1>Política de Privacidade</h1>
        <p className="updated">Última atualização: 30 de maio de 2026</p>

        <p>
          Esta Política de Privacidade descreve como o aplicativo <strong>Tubeless Lab</strong> (&quot;app&quot;,
          &quot;nós&quot;) coleta, usa, armazena e protege seus dados pessoais, em conformidade com a Lei
          Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — &quot;LGPD&quot;). Ao usar o app, você
          concorda com as práticas descritas aqui.
        </p>

        <h2><span className="num">01</span>Controlador dos dados</h2>
        <p>O responsável pelo tratamento dos seus dados pessoais (controlador, nos termos da LGPD) é:</p>
        <div className="contact-card">
          <div><span className="k">Controlador:&nbsp;</span><span className="v">Alexandre Carlos de Campos Filho</span></div>
          <div><span className="k">Contato:&nbsp;</span><span className="v">setup@tubelesslab.com</span></div>
          <div><span className="k">App:&nbsp;</span><span className="v">Tubeless Lab</span></div>
        </div>
        <p>
          Para qualquer dúvida sobre esta política ou sobre o tratamento dos seus dados, e para exercer
          seus direitos como titular, escreva para <a href="mailto:setup@tubelesslab.com">setup@tubelesslab.com</a>.
        </p>

        <h2><span className="num">02</span>Quais dados coletamos</h2>
        <p>Coletamos apenas o necessário para o app funcionar:</p>
        <table className="dt">
          <thead>
            <tr><th>Dado</th><th>Origem</th><th>Por quê</th></tr>
          </thead>
          <tbody>
            <tr><td>E-mail / identificador de conta</td><td>Você, ao criar conta (e-mail, Apple ou Google)</td><td>Autenticar você e vincular seus dados</td></tr>
            <tr><td>Nome (se fornecido pelo login social)</td><td>Apple / Google, ao fazer login</td><td>Identificar sua conta no app</td></tr>
            <tr><td>Suas rodas e pneus</td><td>Você, ao cadastrar no app</td><td>Calcular a saúde do selante</td></tr>
            <tr><td>Histórico de manutenções</td><td>Você, ao registrar no app</td><td>Estimar quando o selante vai secar</td></tr>
            <tr><td>Cidade de referência</td><td>Você, ao escolher uma cidade</td><td>Ajustar a estimativa conforme o clima</td></tr>
            <tr><td>Preferências (idioma, etc.)</td><td>Você, nas configurações</td><td>Personalizar sua experiência</td></tr>
          </tbody>
        </table>
        <div className="callout">
          <div className="label">Importante</div>
          <p>
            O app <strong>não coleta sua localização por GPS</strong>. A cidade de referência é escolhida
            manualmente por você e usada apenas para buscar a temperatura média da região. Também
            <strong> não coletamos dados de pagamento</strong> dentro do app.
          </p>
        </div>

        <h2><span className="num">03</span>Base legal do tratamento</h2>
        <p>Tratamos seus dados com fundamento em:</p>
        <ul>
          <li><strong>Execução de contrato (Art. 7º, V da LGPD):</strong> dados necessários para fornecer as funcionalidades do app que você solicitou.</li>
          <li><strong>Consentimento (Art. 7º, I):</strong> coletado no primeiro acesso, para o tratamento dos dados descritos nesta política.</li>
        </ul>

        <h2><span className="num">04</span>Com quem compartilhamos</h2>
        <p>
          Não vendemos seus dados. Para operar, o app usa os seguintes prestadores de serviço (operadores),
          que tratam dados em nosso nome:
        </p>
        <ul>
          <li><strong>Supabase</strong> — hospedagem do banco de dados e autenticação. Armazena sua conta, rodas, pneus, manutenções e preferências.</li>
          <li><strong>Apple</strong> — quando você usa &quot;Entrar com a Apple&quot;, para autenticar sua identidade.</li>
          <li><strong>Google</strong> — quando você usa &quot;Entrar com o Google&quot;, para autenticar sua identidade.</li>
          <li><strong>Open-Meteo</strong> — serviço de dados climáticos. Recebe apenas as coordenadas aproximadas da cidade que você escolheu, sem qualquer dado que te identifique.</li>
        </ul>
        <p>
          Esses serviços podem armazenar dados fora do Brasil. Ao usar o app, você concorda com essa
          transferência internacional, realizada com salvaguardas adequadas conforme a LGPD.
        </p>

        <h2><span className="num">05</span>Por quanto tempo guardamos</h2>
        <p>
          Mantemos seus dados enquanto sua conta existir. Quando você solicita a exclusão, seus dados entram
          em um período de carência de <strong>30 dias</strong> (durante o qual você pode cancelar a exclusão)
          e, após esse prazo, são <strong>apagados permanentemente</strong> dos nossos sistemas. Veja a página
          de <a href="/exclusao-de-dados">Exclusão de Dados</a>.
        </p>

        <h2><span className="num">06</span>Seus direitos como titular</h2>
        <p>Pela LGPD, você pode a qualquer momento:</p>
        <ul>
          <li>Confirmar a existência de tratamento e acessar seus dados;</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação de dados;</li>
          <li>Solicitar a portabilidade dos seus dados;</li>
          <li>Revogar o consentimento e solicitar a exclusão da conta;</li>
          <li>Ser informado sobre com quem compartilhamos seus dados.</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, use o botão de exclusão dentro do app ou escreva para
          <a href="mailto:setup@tubelesslab.com"> setup@tubelesslab.com</a>.
        </p>

        <h2><span className="num">07</span>Segurança</h2>
        <p>
          Adotamos medidas técnicas e administrativas para proteger seus dados, incluindo conexões
          criptografadas, controle de acesso por usuário e isolamento de dados entre contas. Nenhum sistema
          é perfeitamente seguro, mas trabalhamos para reduzir riscos de acesso não autorizado, perda ou
          vazamento.
        </p>

        <h2><span className="num">08</span>Crianças</h2>
        <p>
          O app não é direcionado a menores de 13 anos e não coletamos intencionalmente dados dessa faixa
          etária.
        </p>

        <h2><span className="num">09</span>Alterações nesta política</h2>
        <p>
          Podemos atualizar esta política periodicamente. Mudanças relevantes serão comunicadas no app ou
          por e-mail. A data no topo indica a última revisão.
        </p>
      </main>
      <Foot />
    </>
  );
}
