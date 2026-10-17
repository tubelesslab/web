type Lang = "pt" | "en";

const LABELS = {
  pt: {
    privacy: "Privacidade",
    terms: "Termos",
    deleteData: "Excluir dados",
    strava: "Strava",
    privacyLong: "Política de Privacidade",
    termsLong: "Termos de Uso",
    deleteLong: "Exclusão de Dados",
    stravaLong: "Suporte Strava",
    stravaHref: "/strava",
  },
  en: {
    privacy: "Privacy",
    terms: "Terms",
    deleteData: "Delete data",
    strava: "Strava",
    privacyLong: "Privacy Policy",
    termsLong: "Terms of Use",
    deleteLong: "Data Deletion",
    stravaLong: "Strava Support",
    stravaHref: "/strava/en",
  },
} as const;

function DropLogo() {
  return (
    <svg className="logo-drop" viewBox="0 0 56 72" width="20" height="26" aria-hidden="true">
      <path
        d="M28 4 C 28 4, 4 32, 4 48 C 4 62, 14 68, 28 68 C 42 68, 52 62, 52 48 C 52 32, 28 4, 28 4 Z"
        fill="var(--accent)"
      />
      <path
        d="M 8 46 L 18 46 L 21 42 L 24 46 L 28 46 L 30 30 L 33 56 L 36 46 L 40 44 L 43 46 L 48 46"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Masthead({ lang = "pt" }: { lang?: Lang }) {
  const t = LABELS[lang];
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
          <a href="/privacidade">{t.privacy}</a>
          <a href="/termos">{t.terms}</a>
          <a href="/exclusao-de-dados">{t.deleteData}</a>
          <a href={t.stravaHref}>{t.strava}</a>
        </nav>
      </div>
    </header>
  );
}

export function Foot({ lang = "pt" }: { lang?: Lang }) {
  const t = LABELS[lang];
  return (
    <footer className="foot">
      <div className="foot-inner">
        <div>© {new Date().getFullYear()} Tubeless Lab</div>
        <div className="links">
          <a href="/privacidade">{t.privacyLong}</a>
          <a href="/termos">{t.termsLong}</a>
          <a href="/exclusao-de-dados">{t.deleteLong}</a>
          <a href={t.stravaHref}>{t.stravaLong}</a>
          <a href="mailto:setup@tubelesslab.com">setup@tubelesslab.com</a>
        </div>
      </div>
    </footer>
  );
}
