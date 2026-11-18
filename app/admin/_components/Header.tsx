import type { ReactNode } from "react";
import { logoutAction } from "../actions";
import { RefreshButton } from "./RefreshButton";
import { fmtDateTime } from "./format";

type Page = "dashboard" | "push" | "aquisicao";

const TITLE_SUFFIX: Record<Page, string> = { dashboard: "", push: " · Push", aquisicao: " · Aquisição" };
const NAV: { page: Page; href: string; label: string }[] = [
  { page: "dashboard", href: "/admin", label: "Painel" },
  { page: "push", href: "/admin/push", label: "Push" },
  { page: "aquisicao", href: "/admin/aquisicao", label: "Aquisição" },
];

export function Header({
  showRefresh,
  refresh,
  updatedAt,
  page = "dashboard",
}: {
  showRefresh?: boolean;
  // Botao de atualizar proprio da pagina (ex.: aquisicao, que atualiza por periodo).
  refresh?: ReactNode;
  updatedAt?: string | null;
  page?: Page;
}) {
  const withUpdated = showRefresh || refresh !== undefined;
  return (
    <header className="adm-header">
      <div className="adm-header-left">
        <span className="adm-wordmark">TBLS LAB · Admin{TITLE_SUFFIX[page]}</span>
        {withUpdated && (
          <span className="adm-updated">
            {updatedAt ? (
              <>
                Atualizado em <span className="mono">{fmtDateTime(updatedAt)}</span>
              </>
            ) : (
              "Sem snapshot"
            )}
          </span>
        )}
      </div>
      <div className="adm-header-actions">
        {refresh ?? (showRefresh && <RefreshButton />)}
        {NAV.filter((n) => n.page !== page).map((n) => (
          <a key={n.page} className="adm-link" href={n.href}>
            {n.label}
          </a>
        ))}
        <a className="adm-link" href="/admin/senha">
          Trocar senha
        </a>
        <form action={logoutAction}>
          <button type="submit" className="adm-btn">
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
