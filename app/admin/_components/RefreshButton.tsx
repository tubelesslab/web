"use client";

import { useState } from "react";
import { refreshAction } from "../actions";

export function RefreshButton() {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onClick() {
    setPending(true);
    setFailed(false);
    try {
      await refreshAction();
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button type="button" className="adm-btn adm-btn-primary" onClick={onClick} disabled={pending}>
        {pending ? "Atualizando…" : "Atualizar"}
      </button>
      {failed && <span className="adm-error-inline">Falha ao atualizar</span>}
    </>
  );
}
