export function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <a className="brand" href="/">
          <span className="dot" />
          TBLS&nbsp;LAB
        </a>
        <nav className="nav">
          <a href="/privacidade">Privacidade</a>
          <a href="/termos">Termos</a>
          <a href="/exclusao-de-dados">Excluir dados</a>
        </nav>
      </div>
    </header>
  );
}

export function Foot() {
  return (
    <footer className="foot">
      <div className="foot-inner">
        <div>© {new Date().getFullYear()} Tubeless Lab</div>
        <div className="links">
          <a href="/privacidade">Política de Privacidade</a>
          <a href="/termos">Termos de Uso</a>
          <a href="/exclusao-de-dados">Exclusão de Dados</a>
          <a href="mailto:setup@tubelesslab.com">setup@tubelesslab.com</a>
        </div>
      </div>
    </footer>
  );
}
