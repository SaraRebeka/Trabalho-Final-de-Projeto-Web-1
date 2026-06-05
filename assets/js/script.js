// ============================================================
//  Header & Footer — injetados automaticamente em todas as páginas
// ============================================================

;(function () {
  const path = window.location.pathname

  let raiz = ''

  if (path.includes('/pages/departamentos/')){
    raiz = '../../'
  } else if (path.includes('/pages/')) {
    raiz = '../'
  }

  const header = document.createElement('header')
  header.innerHTML = `
    <h1>Multiversal Void Company</h1>
    <nav>
      <ul>
        <li><a href="${raiz}index.html">Início</a></li>
        <li><a href="${raiz}pages/servicos.html">Serviços</a></li>
        <li><a href="${raiz}pages/lojinha.html">Lojinha</a></li>
        <li><a href="${raiz}pages/faq.html">FAQ</a></li>
        <li><a href="${raiz}pages/portal.html">Portal</a></li>
      </ul>
    </nav>
  `

  const footer = document.createElement('footer')
  footer.innerHTML = `
    <ul class="Baixo">
      <li><a href="${raiz}pages/quem-somos.html">Quem Somos</a></li>
      <li><a href="${raiz}pages/parcerias.html">Parcerias</a></li>
      <li><a href="${raiz}pages/contato.html">Contato</a></li>
      <li><a href="${raiz}pages/sobre.html">Sobre</a></li>
    </ul>

    <p>©2026 Multiversal Void Company. By : <a href="https://sararebeka.github.io/Sasotsu-D.-Sara/">S.D.S</a></p>
  `

  document.body.prepend(header)
  document.body.append(footer)

  const links = header.querySelectorAll('nav a')
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.style.background = '#fff'
      link.style.color = 'rgb(100, 0, 83)'
    }
  })
})()

// ============================================================
//  Multiversal Void Company — Script Global
//  Easter Egg: Digite "VOID" em qualquer página para abrir o portal
// ============================================================

// ── Overlay do portal ────────────────────────────────────────
const portalOverlay = document.createElement('div')
portalOverlay.id = 'portal-overlay'
portalOverlay.innerHTML = `
  <div id="portal-container">
    <canvas id="portal-canvas"></canvas>
    <div id="portal-mensagem">
      <p id="portal-texto"></p>
    </div>
    <button id="portal-fechar">✕ Fechar Portal</button>
  </div>
`
portalOverlay.style.cssText = `
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
document.body.appendChild(portalOverlay)

const style = document.createElement('style')
style.textContent = `
  #portal-overlay {
    display: none;
  }
  #portal-overlay.ativo {
    display: flex !important;
  }
  #portal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  #portal-canvas {
    border-radius: 50%;
    box-shadow: 0 0 60px #e100ff, 0 0 120px #e100ff66, 0 0 200px #e100ff33;
  }
  #portal-mensagem {
    font-family: 'Orbitron', sans-serif;
    color: #e100ff;
    font-size: 1rem;
    text-align: center;
    text-shadow: 0 0 10px #e100ff;
    max-width: 400px;
    min-height: 28px;
  }
  #portal-fechar {
    font-family: 'Orbitron', sans-serif;
    margin-top: 0;
    padding: 10px 28px;
    border: 2px solid #e100ff;
    background: transparent;
    color: #e100ff;
    font-size: 0.85rem;
    cursor: pointer;
    border-radius: 8px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px #e100ff;
  }
  #portal-fechar:hover {
    background: #e100ff;
    color: #000;
  }
  #portal-hint {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Orbitron', sans-serif;
    font-size: 0.75rem;
    color: #e100ff;
    background: rgba(0,0,0,0.8);
    padding: 8px 18px;
    border-radius: 20px;
    border: 1px solid #e100ff44;
    box-shadow: 0 0 10px #e100ff33;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }
`
document.head.appendChild(style)

// ── Hint flutuante ───────────────────────────────────────────
const hint = document.createElement('div')
hint.id = 'portal-hint'
hint.textContent = '🌀 Um portal foi detectado...'
document.body.appendChild(hint)

// ── Detecção da sequência "VOID" ─────────────────────────────
const CODIGO = 'VOID'
let buffer = ''

document.addEventListener('keydown', (e) => {
  buffer += e.key.toUpperCase()
  if (buffer.length > CODIGO.length) {
    buffer = buffer.slice(-CODIGO.length)
  }
  if (buffer === CODIGO) {
    buffer = ''
    abrirPortal()
  }
})

// ── Mensagens do portal ──────────────────────────────────────
const mensagens = [
  'Conexão estabelecida com o universo 42-S...',
  'Boas-vindas, viajante dimensional.',
  'O vazio não é ausência — é possibilidade.',
  'A Multiversal Void Company observa todas as realidades.',
  'Você encontrou o que não devia ser encontrado.',
  'Este portal foi aberto por: VOID',
  'Feche antes que algo passe para este lado...'
]

// ── Animação do portal (canvas) ──────────────────────────────
let animFrame = null
let startTime = null

function desenharPortal(canvas, progresso) {
  const ctx = canvas.getContext('2d')
  const cx  = canvas.width / 2
  const cy  = canvas.height / 2
  const raioMax = cx - 10

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const raioAtual = raioMax * progresso

  // Camadas do portal (do centro pra fora)
  const camadas = [
    { r: raioAtual * 0.25, cor: '#ffffff', alpha: 0.95 },
    { r: raioAtual * 0.45, cor: '#cc00ff', alpha: 0.85 },
    { r: raioAtual * 0.65, cor: '#7700cc', alpha: 0.70 },
    { r: raioAtual * 0.82, cor: '#3a0066', alpha: 0.55 },
    { r: raioAtual * 1.00, cor: '#0d0010', alpha: 0.40 },
  ]

  camadas.forEach(({ r, cor, alpha }) => {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    grad.addColorStop(0, cor + 'ff')
    grad.addColorStop(1, cor + '00')
    ctx.globalAlpha = alpha
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
  })

  // Anéis giratórios
  const t = Date.now() / 1000
  ctx.globalAlpha = 0.6 * progresso
  ;[0.55, 0.75, 0.92].forEach((fator, i) => {
    const r    = raioAtual * fator
    const vel  = (i % 2 === 0 ? 1 : -1) * (0.8 + i * 0.3)
    const ang  = t * vel
    const dash = Math.max(4, 30 * progresso)

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(ang)
    ctx.strokeStyle = i === 1 ? '#ff52ff' : '#e100ff'
    ctx.lineWidth   = 2 + i
    ctx.setLineDash([dash, dash * 0.6])
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  })

  // Partículas orbitando
  ctx.globalAlpha = 0.8 * progresso
  const nPart = 18
  for (let i = 0; i < nPart; i++) {
    const ang  = (i / nPart) * Math.PI * 2 + t * 1.2
    const r    = raioAtual * 0.88
    const px   = cx + Math.cos(ang) * r
    const py   = cy + Math.sin(ang) * r
    const size = 2.5 + Math.sin(t * 3 + i) * 1.5
    ctx.beginPath()
    ctx.arc(px, py, size, 0, Math.PI * 2)
    ctx.fillStyle = i % 3 === 0 ? '#ffffff' : '#e100ff'
    ctx.fill()
  }

  ctx.globalAlpha = 1
}

function animar(canvas, timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed  = timestamp - startTime
  const duracao  = 1200 // ms para abrir
  const progresso = Math.min(elapsed / duracao, 1)

  desenharPortal(canvas, progresso)
  animFrame = requestAnimationFrame((ts) => animar(canvas, ts))
}

// ── Digitar mensagem ─────────────────────────────────────────
function digitarMensagem(el, texto, cb) {
  el.textContent = ''
  let i = 0
  const timer = setInterval(() => {
    el.textContent += texto[i]
    i++
    if (i >= texto.length) {
      clearInterval(timer)
      if (cb) setTimeout(cb, 1200)
    }
  }, 45)
}

function exibirMensagens(el, lista, idx = 0) {
  if (idx >= lista.length) return
  digitarMensagem(el, lista[idx], () => exibirMensagens(el, lista, idx + 1))
}

// ── Abrir / Fechar portal ────────────────────────────────────
function abrirPortal() {
  const overlay  = document.getElementById('portal-overlay')
  const canvas   = document.getElementById('portal-canvas')
  const textoEl  = document.getElementById('portal-texto')
  const size     = Math.min(window.innerWidth * 0.7, 420)

  canvas.width  = size
  canvas.height = size
  startTime     = null

  overlay.classList.add('ativo')

  animFrame = requestAnimationFrame((ts) => animar(canvas, ts))

  setTimeout(() => exibirMensagens(textoEl, mensagens), 600)
}

function fecharPortal() {
  const overlay = document.getElementById('portal-overlay')
  overlay.classList.remove('ativo')
  if (animFrame) cancelAnimationFrame(animFrame)
  animFrame = null
}

document.getElementById('portal-fechar').addEventListener('click', fecharPortal)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharPortal()
})

// ── Hint sutil ao digitar V ──────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key.toUpperCase() === 'V') {
    hint.style.opacity = '1'
    clearTimeout(hint._timer)
    hint._timer = setTimeout(() => { hint.style.opacity = '0' }, 2500)
  }
})

// Recalcula canvas ao girar/redimensionar
window.addEventListener('resize', () => {
  const canvas = document.getElementById('portal-canvas')
  if (!canvas) return
  const size = Math.min(window.innerWidth * 0.7, 420)
  canvas.width = size
  canvas.height = size
})

// Trigger mobile — 4 toques no h1 abre o portal
let toquesH1 = 0, timerToques
document.querySelector('h1')?.addEventListener('click', () => {
  toquesH1++
  clearTimeout(timerToques)
  timerToques = setTimeout(() => { toquesH1 = 0 }, 1500)
  if (toquesH1 >= 4) { toquesH1 = 0; abrirPortal() }
})

const CODIGO_ADMIN = 'ADMIN'
let bufferAdmin = ''

document.addEventListener('keydown', (e) => {
  // Não faz nada se já estiver no admin
  if (window.location.pathname.includes('admin.html')) return

  bufferAdmin += e.key.toUpperCase()
  if (bufferAdmin.length > CODIGO_ADMIN.length) {
    bufferAdmin = bufferAdmin.slice(-CODIGO_ADMIN.length)
  }
  if (bufferAdmin === CODIGO_ADMIN) {
  bufferAdmin = ''

    const path = window.location.pathname

    if (path.includes('/pages/departamentos/')) {
      window.location.href = '../../pages/admin.html'
    } else if (path.includes('/pages/')) {
      window.location.href = 'admin.html'
    } else {
      window.location.href = 'pages/admin.html'
    }
  
  }
})