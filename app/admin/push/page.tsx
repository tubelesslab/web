import { requireSession } from "@/lib/admin/guard";
import { audienceCount, listCampaigns, listShopProducts } from "@/lib/admin/push";
import type { AudienceCount, Campaign, Product } from "@/lib/admin/push-validate";
import { Header } from "../_components/Header";
import { Card, Grid, Section } from "../_components/ui";
import { fmtN } from "../_components/format";
import { PushClient } from "./_components/PushClient";

export const dynamic = "force-dynamic";

async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function PushPage() {
  await requireSession();
  const [counts, products, campaigns] = await Promise.all([
    safe<AudienceCount>(() => audienceCount({})),
    safe<Product[]>(listShopProducts),
    safe<Campaign[]>(listCampaigns),
  ]);
  const loadError = !counts || !products || !campaigns;

  return (
    <>
      <Header page="push" />
      <main className="adm-main">
        <Section title="Push">
          <Grid>
            <Card label="Aceitaram ofertas" value={fmtN(counts?.opted_in_total)} />
            <Card label="Aparelhos registrados" value={fmtN(counts?.with_token_total)} />
          </Grid>
        </Section>
        <PushClient products={products ?? []} initialCampaigns={campaigns ?? []} loadError={loadError} />
      </main>
    </>
  );
}
