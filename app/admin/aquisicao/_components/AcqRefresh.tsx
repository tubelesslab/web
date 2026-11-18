"use client";

import { useState } from "react";
import { refreshAcquisitionAction } from "../actions";

export function AcqRefresh({ from, to }: { from: string; to: string }) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onClick() {
    setPending(true);
    setFailed(false);
    try {
      const r = await refreshAcquisitionAction(from, to);
      if (!r.ok) setFailed(true);
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
