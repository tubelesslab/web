import { loginAction } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <main className="adm-auth">
      <form action={loginAction} className="adm-panel adm-form">
        <div className="adm-wordmark">TBLS LAB · Admin</div>
        {erro && <p className="adm-error">Credenciais inválidas.</p>}
        <label>
          E-mail
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Senha
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="adm-btn adm-btn-primary" type="submit">
          Entrar
        </button>
      </form>
    </main>
  );
}
