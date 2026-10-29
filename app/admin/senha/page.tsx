import { requireSession } from "@/lib/admin/guard";
import { Header } from "../_components/Header";
import { changePasswordAction } from "./actions";

const ERROS: Record<string, string> = {
  atual: "Senha atual incorreta.",
  curta: "A nova senha precisa ter pelo menos 12 caracteres.",
  confirmacao: "A confirmação não confere com a nova senha.",
  igual: "A nova senha precisa ser diferente da atual.",
};

export default async function SenhaPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  await requireSession({ allowMustChange: true });
  const { erro } = await searchParams;
  return (
    <>
      <Header />
      <main className="adm-auth">
        <form action={changePasswordAction} className="adm-panel adm-form">
          <h1 className="adm-h1">Trocar senha</h1>
          {erro && ERROS[erro] && <p className="adm-error">{ERROS[erro]}</p>}
          <label>
            Senha atual
            <input name="atual" type="password" autoComplete="current-password" required />
          </label>
          <label>
            Nova senha (mínimo 12 caracteres)
            <input name="nova" type="password" autoComplete="new-password" minLength={12} required />
          </label>
          <label>
            Confirmar nova senha
            <input name="confirmacao" type="password" autoComplete="new-password" minLength={12} required />
          </label>
          <button className="adm-btn adm-btn-primary" type="submit">
            Salvar
          </button>
        </form>
      </main>
    </>
  );
}
