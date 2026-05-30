# tubelesslab.com — site + páginas legais

Next.js (App Router) configurado para **Cloudflare Workers** via **OpenNext** (método recomendado pela Cloudflare em 2026). Inclui home placeholder e as 3 páginas legais exigidas pelas lojas e pela LGPD. Estrutura pronta para o admin/dashboard futuro (rotas de servidor + Supabase).

## Rotas

| URL | Para quê |
|---|---|
| `/` | Home (placeholder por enquanto) |
| `/privacidade` | Política de Privacidade (LGPD) |
| `/termos` | Termos de Uso |
| `/exclusao-de-dados` | **URL de exclusão de dados — cole essa no Google Play** |

URL para o Google Play Console (Data safety → Account deletion):
`https://tubelesslab.com/exclusao-de-dados`

---

## COMO PUBLICAR (passo a passo, via GitHub + Cloudflare)

Você NÃO precisa instalar nada no seu PC. A Cloudflare constrói o site na nuvem.

### 1. Atualizar a pasta no GitHub
Substitua os arquivos antigos do repositório `web` pelos desta pasta (apague os de antes e suba estes), e dê "Commit changes".

### 2. Na tela de setup da Cloudflare, preencher EXATAMENTE:

- **Project name:** `web` (ou o que preferir)
- **Build command:**
  ```
  npx opennextjs-cloudflare build
  ```
- **Deploy command:**
  ```
  npx wrangler deploy
  ```

Não precisa procurar "output directory" — no fluxo OpenNext/Workers ele não existe; o destino já está definido no arquivo `wrangler.jsonc`.

Depois clique em **Deploy**. O primeiro build leva 1–3 min.

### 3. Apontar o domínio
Quando o deploy terminar, vá em **Settings → Domains/Routes** do projeto e adicione `tubelesslab.com` e `www.tubelesslab.com`. Como o DNS já está na Cloudflare, é só confirmar — SSL é automático. Isso substitui a landing page temporária da Apple/Cloudflare.

---

## Notas técnicas
- `wrangler.jsonc` já tem `nodejs_compat` e `compatibility_date` corretos — não precisa mexer.
- Windows: o build roda na NUVEM da Cloudflare (Linux), então você NÃO precisa de WSL nem de buildar localmente. (WSL só seria necessário se você quisesse rodar `npm run preview` no seu PC.)
- A pasta de build é `.open-next/` e está no `.gitignore` (não vai pro GitHub, é gerada no build).

## Próximo passo: admin/backoffice
Estrutura pronta. Admin entra como rota protegida (ex.: `app/admin/`) lendo o **mesmo Supabase** do app. Regra de ouro: **service_role key nunca vai pro browser** — acesso admin passa por Route Handlers server-side (`app/api/.../route.ts`) com allow-list de e-mails. OpenNext suporta isso nativamente (foi por isso que escolhemos o caminho robusto).

## Pendências da Parte 7 (fora deste pacote)
- Consentimento LGPD no 1º login do app (modal leve — próximo item)
- Assets: ícone do app, ícone de notificação, adaptive-icon Android, splash, screenshots
- Warnings do app.json (newArchEnabled, edgeToEdgeEnabled)
- Build de produção (eas build --profile production)
- TestFlight (iOS) + internal track (Play)
