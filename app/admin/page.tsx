import { requireSession } from "@/lib/admin/guard";
import { getLatestSnapshot } from "@/lib/admin/supabase";
import { Header } from "./_components/Header";
import { Dashboard } from "./_components/Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireSession();
  const snapshot = await getLatestSnapshot();
  return (
    <>
      <Header showRefresh updatedAt={snapshot?.created_at} />
      <main className="adm-main">
        {snapshot ? (
          <Dashboard data={snapshot.data} />
        ) : (
          <div className="adm-panel adm-empty-big">Nenhum snapshot ainda</div>
        )}
      </main>
    </>
  );
}
