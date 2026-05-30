import { Masthead, Foot } from "@/app/components/chrome";

export const metadata = {
  title: "Termos de Uso — Tubeless Lab",
};

export default function Termos() {
  return (
    <>
      <Masthead />
      <main className="shell doc">
        <div className="eyebrow">Documento legal</div>
        <h1>Termos de Uso</h1>
        <p className="updated">Última atualização: 30 de maio de 2026</p>

        <p>
          Estes Termos de Uso regem o uso do aplicativo <strong>Tubeless Lab</strong>. Ao criar uma conta ou
          usar o app, você concorda com estes termos. Se não concordar, não use o app.
        </p>

        <h2><span className="num">01</span>O que o app faz</h2>
        <p>
          O Tubeless Lab ajuda ciclistas a acompanhar a manutenção do selante (líquido tubeless) dos seus
          pneus, estimando quando o selante pode estar secando com base na data da última manutenção, no tipo
          de pneu e no clima da cidade de referência escolhida.
        </p>
        <div className="callout warn">
          <div className="label">Aviso importante</div>
          <p>
            As estimativas do app são <strong>aproximações baseadas em médias</strong> de fabricantes e
            condições típicas. Elas não substituem a sua própria inspeção. O estado real do selante depende de
            muitos fatores (uso, furos, temperatura, marca, armazenamento). <strong>Sempre verifique seus
            pneus antes de pedalar.</strong> O app é uma ferramenta de apoio, não uma garantia.
          </p>
        </div>

        <h2><span className="num">02</span>Sua conta</h2>
        <ul>
          <li>Você é responsável por manter a segurança da sua conta e das credenciais de acesso.</li>
          <li>As informações que você cadastra (rodas, pneus, manutenções) são de sua responsabilidade.</li>
          <li>Você pode excluir sua conta a qualquer momento — veja a página de <a href="/exclusao-de-dados">Exclusão de Dados</a>.</li>
        </ul>

        <h2><span className="num">03</span>Uso aceitável</h2>
        <p>Você concorda em não:</p>
        <ul>
          <li>Usar o app para fins ilegais ou não autorizados;</li>
          <li>Tentar acessar contas, dados ou sistemas de terceiros;</li>
          <li>Interferir no funcionamento do app ou de sua infraestrutura;</li>
          <li>Realizar engenharia reversa ou copiar o app sem autorização.</li>
        </ul>

        <h2><span className="num">04</span>Limitação de responsabilidade</h2>
        <p>
          O app é fornecido &quot;como está&quot;. Na máxima extensão permitida pela lei, não nos
          responsabilizamos por danos diretos ou indiretos decorrentes do uso ou da impossibilidade de uso do
          app, incluindo decisões tomadas com base nas estimativas fornecidas. A manutenção dos seus
          equipamentos é sempre de sua responsabilidade.
        </p>

        <h2><span className="num">05</span>Propriedade intelectual</h2>
        <p>
          O app, sua marca, design e conteúdo pertencem ao desenvolvedor. Estes termos não transferem nenhum
          direito de propriedade intelectual para você.
        </p>

        <h2><span className="num">06</span>Disponibilidade e mudanças</h2>
        <p>
          Podemos modificar, suspender ou descontinuar funcionalidades a qualquer momento. Também podemos
          atualizar estes termos; mudanças relevantes serão comunicadas no app ou por e-mail.
        </p>

        <h2><span className="num">07</span>Lei aplicável</h2>
        <p>
          Estes termos são regidos pelas leis da República Federativa do Brasil. Eventuais disputas serão
          resolvidas no foro do domicílio do usuário, conforme aplicável.
        </p>

        <h2><span className="num">08</span>Contato</h2>
        <p>
          Dúvidas sobre estes termos? Escreva para <a href="mailto:setup@tubelesslab.com">setup@tubelesslab.com</a>.
        </p>
      </main>
      <Foot />
    </>
  );
}
