function DropLogo() {
  return (
    <svg className="logo-drop" viewBox="0 0 100 100" width="22" height="22" aria-hidden="true">
      <path
        d="M50 6 C50 6 84 46 84 66 A34 34 0 0 1 16 66 C16 46 50 6 50 6 Z"
        fill="var(--accent)"
      />
      <path
        d="M28 60 L42 60 L46 52 L52 72 L58 44 L62 60 L72 60"
        fill="none"
        stroke="#0D0D0D"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <a className="brand" href="/">
          <DropLogo />
          <span className="brand-text">
            <span className="brand-tbls">TBLS</span>
            <span className="brand-lab">Lab</span>
          </span>
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

