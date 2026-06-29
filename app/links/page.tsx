// app/links/page.tsx
// Página de links (estilo "linktree") do Tubeless Lab.
// Auto-contida: usa apenas estilos inline + as fontes já carregadas no site.
// Não depende de classes do globals.css, então é só adicionar este arquivo.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tubeless Lab — Links",
  description: "Baixe o app, acesse o site e fale com a gente.",
};

const CARBON = "#0D0D0D";
const GRAPHITE = "#161616";
const ACID = "#B7FF00";
const WHITE = "#F2F2F2";
const MUTE = "#8A8A8A";

function Droplet({ size = 56 }: { size?: number }) {
  const w = (size * 56) / 72;
  return (
    <svg width={w} height={size} viewBox="0 0 56 72" aria-hidden="true">
      <path
        d="M28 4 C 28 4, 4 32, 4 48 C 4 62, 14 68, 28 68 C 42 68, 52 62, 52 48 C 52 32, 28 4, 28 4 Z"
        fill={ACID}
      />
      <path
        d="M 10 48 L 19 48 L 22 43 L 25 48 L 29 48 L 31 31 L 34 58 L 37 48 L 41 46 L 44 48 L 47 48"
        fill="none"
        stroke={CARBON}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.88 2.65 3.22 2.6 1.29-.05 1.78-.83 3.34-.83s2 .83 3.37.81c1.39-.03 2.27-1.27 3.12-2.53.98-1.45 1.39-2.85 1.41-2.92-.03-.01-2.7-1.04-2.72-4.13zM14.5 4.4c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-3 1.54-.66.76-1.24 1.98-1.08 3.14 1.14.09 2.3-.58 3.02-1.43z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 2.5v19c0 .8.9 1.3 1.6.9l15-9.5c.6-.4.6-1.4 0-1.8l-15-9.5C3.9 1.2 3 1.7 3 2.5z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACID} strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACID} strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

type LinkRow = {
  href: string;
  small: string;
  big: string;
  icon: React.ReactNode;
  variant: "primary" | "ghost";
  disabled?: boolean;
};

export default function LinksPage() {
  const links: LinkRow[] = [
    {
      href: "https://apps.apple.com/br/app/tubeless-lab/id6775593172",
      small: "Baixe na",
      big: "App Store",
      icon: <AppleIcon />,
      variant: "primary",
    },
    {
      href: "https://play.google.com/store/apps/details?id=com.tubelesslab.app",
      small: "Baixe no",
      big: "Google Play",
      icon: <PlayIcon />,
      variant: "primary",
    },
    {
      href: "https://tubelesslab.com",
      small: "Conheça o",
      big: "Site oficial",
      icon: <GlobeIcon />,
      variant: "ghost",
    },
    {
      href: "mailto:support@tubelesslab.com",
      small: "Dúvidas? ",
      big: "Fale conosco",
      icon: <MailIcon />,
      variant: "ghost",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: CARBON,
        backgroundImage:
          "radial-gradient(circle at 75% -5%, rgba(183,255,0,0.10), transparent 45%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "64px 20px 48px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Droplet size={68} />
          <div
            style={{
              fontFamily: "'Barlow Condensed', Inter, sans-serif",
              fontWeight: 800,
              fontSize: 38,
              letterSpacing: 2,
              color: WHITE,
            }}
          >
            TBLS <span style={{ color: ACID }}>LAB</span>
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              letterSpacing: 3,
              color: MUTE,
              textTransform: "uppercase",
            }}
          >
            Manutenção tubeless inteligente
          </div>
          <p
            style={{
              color: MUTE,
              fontSize: 16,
              lineHeight: 1.5,
              textAlign: "center",
              margin: "8px 0 0",
              maxWidth: 380,
            }}
          >
            Saiba quanto ainda dura o selante de cada roda — antes de ficar na mão.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 40 }}>
          {links.map((l, i) => {
            const isPrimary = l.variant === "primary";
            const base: React.CSSProperties = {
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 22px",
              borderRadius: 14,
              textDecoration: "none",
              border: isPrimary ? `2px solid ${ACID}` : "1px solid #2a2a2a",
              background: isPrimary ? ACID : GRAPHITE,
              color: isPrimary ? CARBON : WHITE,
              opacity: l.disabled ? 0.55 : 1,
              cursor: l.disabled ? "default" : "pointer",
              transition: "transform .12s ease, border-color .12s ease",
            };
            const content = (
              <>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    color: isPrimary ? CARBON : ACID,
                  }}
                >
                  {l.icon}
                </span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{ fontSize: 13, opacity: 0.7 }}>{l.small}</span>
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed', Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: 26,
                      letterSpacing: 0.5,
                    }}
                  >
                    {l.big}
                  </span>
                </span>
                {l.disabled && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      letterSpacing: 1,
                      color: MUTE,
                      border: `1px solid #333`,
                      borderRadius: 6,
                      padding: "4px 8px",
                    }}
                  >
                    EM BREVE
                  </span>
                )}
              </>
            );

            if (l.disabled) {
              return (
                <div key={i} style={base} aria-disabled="true">
                  {content}
                </div>
              );
            }
            return (
              <a
                key={i}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={base}
              >
                {content}
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 44,
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 2,
            color: MUTE,
          }}
        >
          © {new Date().getFullYear()} TUBELESS LAB
        </div>
      </div>
    </main>
  );
}

