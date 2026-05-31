import { Masthead, Foot } from "@/app/components/chrome";

export default function Home() {
  return (
    <>
      <Masthead />
      <main className="shell doc" style={{ minHeight: "60vh" }}>
        <div className="eyebrow">Tubeless, sob controle</div>
        <h1 style={{ maxWidth: 540 }}>Saiba quando recarregar o selante. Antes de secar.</h1>
        <p style={{ fontSize: 19, maxWidth: 520 }}>
          O Tubeless Lab acompanha a saúde do selante dos seus pneus e te avisa antes que ele seque — levando
          em conta o tipo de pneu e o clima da sua cidade.
        </p>
        <div className="callout" style={{ maxWidth: 520 }}>
          <div className="label">Em breve</div>
          <p>O app está a caminho das lojas. Enquanto isso, dê uma olhada nos nossos documentos.</p>
        </div>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
          <a href="/privacidade">Privacidade</a> &nbsp;·&nbsp;
          <a href="/termos">Termos</a> &nbsp;·&nbsp;
          <a href="/exclusao-de-dados">Excluir dados</a>
        </p>
      </main>
      <Foot />
    </>
  );
}
