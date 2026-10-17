// Pagina de suporte do Strava: https://tubelesslab.com/strava
export const dynamic = "force-static";

const html = `<!doctype html>
<html lang="en" data-lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Strava Support · Tubeless Lab</title>
<meta name="description" content="Support for the Strava integration in Tubeless Lab: how to connect, disconnect, and what happens to your data.">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --carbon:#0D0D0D; --graphite:#1C1C1E; --acid:#B7FF00; --white:#F5F7FA; --muted:#6E6E73; --line:#2a2a2d;
  }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{margin:0;background:var(--carbon);color:var(--white);font-family:Inter,system-ui,sans-serif;line-height:1.6;font-size:16px}
  .wrap{max-width:760px;margin:0 auto;padding:0 20px 64px}
  header{display:flex;align-items:center;justify-content:space-between;padding:24px 0;gap:16px}
  .brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit}
  .wordmark{font-family:"Barlow Condensed",sans-serif;font-weight:700;font-size:28px;letter-spacing:.04em;text-transform:uppercase}
  .wordmark b{color:var(--acid);font-weight:700}
  .lang{display:flex;gap:4px;background:var(--graphite);padding:4px;border-radius:12px}
  .lang button{font:500 13px Inter,sans-serif;border:0;background:transparent;color:var(--muted);padding:8px 14px;border-radius:9px;cursor:pointer}
  html[data-lang="en"] .lang [data-set="en"], html[data-lang="pt"] .lang [data-set="pt"]{background:var(--acid);color:#0D0D0D}
  html[data-lang="en"] .pt, html[data-lang="pt"] .en{display:none}
  .eyebrow{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--acid);margin:32px 0 8px}
  h1{font-family:"Barlow Condensed",sans-serif;font-weight:700;font-size:clamp(40px,8vw,60px);line-height:1.02;text-transform:uppercase;margin:0 0 16px}
  .lead{color:#c9ccd1;font-size:18px;margin:0 0 32px}
  h2{font-family:"Barlow Condensed",sans-serif;font-weight:600;font-size:26px;text-transform:uppercase;letter-spacing:.02em;margin:0 0 12px}
  section.card{background:var(--graphite);border:1px solid var(--line);border-radius:18px;padding:24px;margin:0 0 16px}
  p{margin:0 0 12px} p:last-child{margin-bottom:0}
  ol,ul{margin:0;padding-left:22px} li{margin:0 0 8px} li:last-child{margin-bottom:0}
  a{color:var(--acid);text-underline-offset:3px}
  code,.mono{font-family:"JetBrains Mono",monospace;font-size:.92em}
  .contact{display:inline-block;margin-top:4px;background:var(--acid);color:#0D0D0D;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:12px}
  .muted{color:var(--muted);font-size:14px}
  footer{margin-top:40px;border-top:1px solid var(--line);padding-top:24px}
  footer p{color:var(--muted);font-size:13px}
</style>
</head>
<body>
<div class="wrap">

<header>
  <a class="brand" href="/" aria-label="Tubeless Lab">
    <svg width="28" height="36" viewBox="0 0 56 72" aria-hidden="true"><path d="M28 2C28 2 4 30 4 46a24 24 0 0 0 48 0C52 30 28 2 28 2Z" fill="#B7FF00"/><polyline points="10,46 20,46 25,36 31,56 36,46 46,46" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="wordmark">TBLS <b>Lab</b></span>
  </a>
  <div class="lang" role="group" aria-label="Language">
    <button type="button" data-set="en">English</button>
    <button type="button" data-set="pt">Português</button>
  </div>
</header>

<!-- ======================= ENGLISH ======================= -->
<main class="en">
  <div class="eyebrow">Strava integration</div>
  <h1>Strava support</h1>
  <p class="lead">Help for athletes who connect Strava to Tubeless Lab (TBLS Lab): how it works, how to disconnect, and what happens to your data.</p>

  <section class="card">
    <h2>Contact support</h2>
    <p>Questions, problems with the connection, or data requests? Write to us and we will reply as soon as possible.</p>
    <a class="contact" href="mailto:support@tubelesslab.com?subject=Strava%20support">support@tubelesslab.com</a>
  </section>

  <section class="card">
    <h2>What the integration does</h2>
    <p>When you connect Strava, Tubeless Lab reads the distance of your own activities and the gear (bikes) on your account. You link each Strava bike to one of your wheelsets in the app, and the distance is used to:</p>
    <ul>
      <li>show <b>tire wear</b> (km accumulated since installation), and</li>
      <li>apply a soft adjustment to <b>your own</b> sealant-life estimate.</li>
    </ul>
    <p>This information is shown only to you. We do not share it with other users.</p>
  </section>

  <section class="card">
    <h2>How to connect</h2>
    <ol>
      <li>Open the app and go to <b>Settings → Integrations</b>.</li>
      <li>Tap <b>Connect with Strava</b> and approve access on the Strava page.</li>
      <li>Open <b>Edit wheels</b> on a wheelset and choose the matching Strava bike (gear).</li>
      <li>Your kilometers will sync automatically from then on.</li>
    </ol>
  </section>

  <section class="card">
    <h2>How to disconnect</h2>
    <p><b>In the app:</b> go to <b>Settings → Integrations</b> and tap <b>Disconnect from Strava</b>.</p>
    <p><b>On Strava:</b> open <a href="https://www.strava.com/settings/apps" rel="noopener">strava.com/settings/apps</a> and revoke access for Tubeless Lab.</p>
  </section>

  <section class="card">
    <h2>Your data</h2>
    <ul>
      <li>We use Strava data only to provide features to the athlete who authorized it. We do not sell it, share it, aggregate it across users, or use it to train any model, including AI models.</li>
      <li>On disconnect, we delete the Strava data we hold: the gear link and the last synced distance.</li>
      <li>The tire-wear counter inside the app is a number calculated for your own wheels. It stays in your account after you disconnect and can be reset at any time in <b>Edit wheels</b>.</li>
      <li>Strava data is cached for at most 7 days.</li>
      <li>To delete everything, delete your account in the app (<b>Settings</b>) or email us. Deletion requests are processed promptly.</li>
    </ul>
    <p>See also our <a href="/privacy">Privacy Policy</a>.</p>
  </section>

  <section class="card">
    <h2>Troubleshooting</h2>
    <ul>
      <li><b>Kilometers are not updating.</b> Open the app so it can sync, and confirm the wheelset is linked to the correct Strava bike.</li>
      <li><b>The bike I want is not listed.</b> Make sure the bike exists in your Strava profile under <i>Gear</i> and that the activity was recorded with it.</li>
      <li><b>I linked the wrong bike.</b> Open <b>Edit wheels</b> and choose the correct gear.</li>
      <li><b>Still stuck?</b> Email <a href="mailto:support@tubelesslab.com">support@tubelesslab.com</a>.</li>
    </ul>
  </section>

  <footer>
    <p>Powered by Strava. Tubeless Lab is not affiliated with, endorsed by, or sponsored by Strava, Inc. Strava is a trademark of Strava, Inc.</p>
    <p class="mono">Last updated: October 17, 2026</p>
  </footer>
</main>

<!-- ======================= PORTUGUÊS ======================= -->
<main class="pt">
  <div class="eyebrow">Integração com Strava</div>
  <h1>Suporte Strava</h1>
  <p class="lead">Ajuda para quem conecta o Strava ao Tubeless Lab (TBLS Lab): como funciona, como desconectar e o que acontece com os seus dados.</p>

  <section class="card">
    <h2>Fale com o suporte</h2>
    <p>Dúvidas, problemas na conexão ou pedidos sobre seus dados? Escreva para nós e responderemos o mais rápido possível.</p>
    <a class="contact" href="mailto:support@tubelesslab.com?subject=Suporte%20Strava">support@tubelesslab.com</a>
  </section>

  <section class="card">
    <h2>O que a integração faz</h2>
    <p>Ao conectar o Strava, o Tubeless Lab lê a distância das suas próprias atividades e os equipamentos (bikes) da sua conta. Você vincula cada bike do Strava a um conjunto de rodas no app, e a distância é usada para:</p>
    <ul>
      <li>mostrar o <b>desgaste do pneu</b> (km acumulados desde a instalação) e</li>
      <li>aplicar um ajuste suave na <b>sua própria</b> estimativa de vida do selante.</li>
    </ul>
    <p>Essas informações aparecem somente para você. Não as compartilhamos com outros usuários.</p>
  </section>

  <section class="card">
    <h2>Como conectar</h2>
    <ol>
      <li>Abra o app e vá em <b>Config. → Integrações</b>.</li>
      <li>Toque em <b>Connect with Strava</b> e autorize o acesso na página do Strava.</li>
      <li>Abra <b>Editar rodas</b> em um conjunto de rodas e escolha a bike (equipamento) correspondente do Strava.</li>
      <li>A partir daí, seus quilômetros sincronizam automaticamente.</li>
    </ol>
  </section>

  <section class="card">
    <h2>Como desconectar</h2>
    <p><b>No app:</b> vá em <b>Config. → Integrações</b> e toque em <b>Desconectar do Strava</b>.</p>
    <p><b>No Strava:</b> acesse <a href="https://www.strava.com/settings/apps" rel="noopener">strava.com/settings/apps</a> e revogue o acesso do Tubeless Lab.</p>
  </section>

  <section class="card">
    <h2>Seus dados</h2>
    <ul>
      <li>Usamos os dados do Strava apenas para oferecer recursos ao atleta que os autorizou. Não vendemos, não compartilhamos, não agregamos entre usuários e não os usamos para treinar nenhum modelo, inclusive de IA.</li>
      <li>Ao desconectar, apagamos os dados do Strava que mantemos: o vínculo do equipamento e a última distância sincronizada.</li>
      <li>O contador de desgaste do pneu dentro do app é um número calculado para as suas próprias rodas. Ele permanece na sua conta após a desconexão e pode ser zerado a qualquer momento em <b>Editar rodas</b>.</li>
      <li>Os dados do Strava ficam em cache por no máximo 7 dias.</li>
      <li>Para apagar tudo, exclua sua conta no app (<b>Config.</b>) ou escreva para nós. Pedidos de exclusão são processados com prioridade.</li>
    </ul>
    <p>Veja também a nossa <a href="/privacy">Política de Privacidade</a>.</p>
  </section>

  <section class="card">
    <h2>Solução de problemas</h2>
    <ul>
      <li><b>Os km não atualizam.</b> Abra o app para sincronizar e confirme que o conjunto de rodas está vinculado à bike correta do Strava.</li>
      <li><b>A bike que eu quero não aparece.</b> Verifique se ela existe no seu perfil do Strava, em <i>Equipamentos</i>, e se a atividade foi gravada com ela.</li>
      <li><b>Vinculei a bike errada.</b> Abra <b>Editar rodas</b> e escolha o equipamento correto.</li>
      <li><b>Continua com problema?</b> Escreva para <a href="mailto:support@tubelesslab.com">support@tubelesslab.com</a>.</li>
    </ul>
  </section>

  <footer>
    <p>Powered by Strava. O Tubeless Lab não é afiliado, endossado nem patrocinado pela Strava, Inc. Strava é marca registrada da Strava, Inc.</p>
    <p class="mono">Última atualização: 17 de outubro de 2026</p>
  </footer>
</main>

</div>
<script>
(function(){
  var root=document.documentElement, KEY='tbls:lang';
  function set(l){
    root.setAttribute('data-lang',l); root.setAttribute('lang',l==='pt'?'pt-BR':'en');
    document.title = l==='pt' ? 'Suporte Strava · Tubeless Lab' : 'Strava Support · Tubeless Lab';
    try{localStorage.setItem(KEY,l)}catch(e){}
  }
  var q=(location.search.match(/[?&]lang=(pt|en)/)||[])[1], saved=null;
  try{saved=localStorage.getItem(KEY)}catch(e){}
  var nav=(navigator.language||'en').toLowerCase().indexOf('pt')===0?'pt':'en';
  set(q||saved||nav);
  Array.prototype.forEach.call(document.querySelectorAll('.lang button'),function(b){
    b.addEventListener('click',function(){set(b.getAttribute('data-set'))});
  });
})();
</script>
</body>
</html>
`;

export async function GET() {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
