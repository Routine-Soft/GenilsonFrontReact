// Service worker mínimo, só para o navegador permitir instalar o painel como aplicativo.
// Não guarda nada em cache: toda abertura busca a versão mais nova (cada deploy chega na hora).
// Sem internet, mostra um aviso em vez da página de erro do navegador.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

const PAGINA_OFFLINE = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>CestSeg Trabalho</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#fbfaf3;color:#10261a;text-align:center;padding:24px">
<div><h1 style="font-size:1.3rem">Sem conexão com a internet</h1><p>Confira a internet e tente de novo.</p>
<button onclick="location.reload()" style="padding:12px 22px;border:0;border-radius:12px;background:#00803a;color:#fff;font-size:1rem;font-weight:600;cursor:pointer">Tentar de novo</button></div></body></html>`

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return
  event.respondWith(
    fetch(event.request).catch(() => new Response(PAGINA_OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))
  )
})
