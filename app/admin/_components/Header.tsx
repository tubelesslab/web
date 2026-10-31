import { logoutAction } from "../actions";
import { RefreshButton } from "./RefreshButton";
import { fmtDateTime } from "./format";

export function Header({
  showRefresh,
  updatedAt,
  page = "dashboard",
}: {
  showRefresh?: boolean;
  updatedAt?: string | null;
  page?: "dashboard" | "push";
}) {
  return (
    <header className="adm-header">
      <div className="adm-header-left">
        <span className="adm-wordmark">TBLS LAB · Admin{page === "push" ? " · Push" : ""}</span>
        {showRefresh && (
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
        {showRefresh && <RefreshButton />}
        {page === "push" ? (
          <a className="adm-link" href="/admin">
            Painel
          </a>
        ) : (
          <a className="adm-link" href="/admin/push">
            Push
          </a>
        )}
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
