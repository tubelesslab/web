"use client";

import { useState } from "react";
import type { Campaign, Product } from "@/lib/admin/push-validate";
import { refreshCampaignsAction } from "../actions";
import { CampaignForm, type Draft } from "./CampaignForm";
import { CampaignList } from "./CampaignList";

export function PushClient({
  products,
  initialCampaigns,
  loadError,
}: {
  products: Product[];
  initialCampaigns: Campaign[];
  loadError: boolean;
}) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    loadError ? { ok: false, text: "Não foi possível carregar tudo do Supabase. Use Atualizar lista." } : null,
  );
  const [formKey, setFormKey] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);

  async function refresh() {
    setRefreshing(true);
    try {
      const r = await refreshCampaignsAction();
      if (r.ok) setCampaigns(r.data);
      else setNotice({ ok: false, text: r.error });
    } catch {
      setNotice({ ok: false, text: "Falha de rede. Tente de novo." });
    } finally {
      setRefreshing(false);
    }
  }

  function onSaved(kind: "campaign" | "test", text: string) {
    setNotice({ ok: true, text });
    if (kind === "campaign") {
      setDraft(null);
      setFormKey((k) => k + 1); // limpa o formulario
    }
    void refresh();
  }

  function onDuplicate(c: Campaign) {
    const a = c.audience ?? {};
    setDraft({
      titlePt: c.title_pt,
      bodyPt: c.body_pt,
      titleEn: c.title_en ?? "",
      bodyEn: c.body_en ?? "",
      target: c.target,
      productId: c.product_id === null || c.product_id === undefined ? "" : String(c.product_id),
      audience: a,
    });
    setFormKey((k) => k + 1);
    setNotice({ ok: true, text: "Campanha duplicada no formulário. Escolha a data e confira o público." });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {notice && (
        <p className={notice.ok ? "adm-notice" : "adm-error"} role="status">
          {notice.text}
        </p>
      )}
      <CampaignForm key={formKey} products={products} initial={draft} onSaved={onSaved} />
      <CampaignList
        campaigns={campaigns}
        refreshing={refreshing}
        onRefresh={refresh}
        onDuplicate={onDuplicate}
        onNotice={setNotice}
      />
    </>
  );
}
