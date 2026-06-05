// ============================================================
//  Multiversal Void Company — Admin JS
// ============================================================

const API = 'http://localhost:3000/api'

// Credenciais admin (front-end apenas — validação real deve ser no back)
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'mvc@void2026'

// ── Login ────────────────────────────────────────────────────
const loginDiv  = document.getElementById('admin-login')
const painelDiv = document.getElementById('admin-painel')

function verificarSessao() {
  if (sessionStorage.getItem('mvc_admin') === 'true') mostrarPainel()
}

document.getElementById('btn-login').addEventListener('click', fazerLogin)
document.getElementById('login-senha').addEventListener('keydown', e => {
  if (e.key === 'Enter') fazerLogin()
})

function fazerLogin() {
  const usuario = document.getElementById('login-usuario').value.trim()
  const senha   = document.getElementById('login-senha').value
  const erroEl  = document.getElementById('login-erro')

  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    sessionStorage.setItem('mvc_admin', 'true')
    erroEl.textContent = ''

    // Efeito de portal antes de mostrar o painel
    abrirPortalAdmin()
  } else {
    erroEl.textContent = '⚠️ Credenciais inválidas. Acesso negado.'
    document.getElementById('login-senha').value = ''
  }
}

function abrirPortalAdmin() {
  // Reutiliza a função do script.js com mensagens customizadas
  const mensagensOriginais = window._mensagensPortal
  window._mensagensPortal = [
    'Verificando credenciais dimensionais...',
    'Acesso autorizado, Agente.',
    'Iniciando protocolo de controle...',
    'Bem-vindo ao Painel de Controle MVC.'
  ]

  abrirPortal()

  // Após 4 segundos mostra o painel e fecha o portal
  setTimeout(() => {
    fecharPortal()
    if (mensagensOriginais) window._mensagensPortal = mensagensOriginais
    mostrarPainel()
  }, 4200)
}

function mostrarPainel() {
  loginDiv.style.display  = 'none'
  painelDiv.classList.add('ativo')
  carregarProdutos()
  carregarPedidos()
}

document.getElementById('btn-logout').addEventListener('click', () => {
  sessionStorage.removeItem('mvc_admin')
  painelDiv.classList.remove('ativo')
  loginDiv.style.display = 'flex'
  document.getElementById('login-usuario').value = ''
  document.getElementById('login-senha').value   = ''
})

// ── Abas ─────────────────────────────────────────────────────
document.querySelectorAll('.aba').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'))
    btn.classList.add('ativa')
    const aba = btn.dataset.aba
    document.getElementById('aba-produtos').classList.toggle('oculto', aba !== 'produtos')
    document.getElementById('aba-pedidos').classList.toggle('oculto',  aba !== 'pedidos')
  })
})

// ── PRODUTOS ─────────────────────────────────────────────────
let editandoId = null

async function carregarProdutos() {
  const tbody = document.getElementById('tbody-produtos')
  try {
    // Busca todos os produtos (incluindo sem estoque) via endpoint admin
    const res  = await fetch(`${API}/admin/produtos`)
    const list = await res.json()

    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#555">Nenhum produto cadastrado.</td></tr>'
      return
    }

    tbody.innerHTML = list.map(p => `
      <tr>
        <td>#${p.id}</td>
        <td>${p.nome}</td>
        <td>R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</td>
        <td>${p.estoque}</td>
        <td>
          <button class="aba btn-acao btn-editar"  onclick="editarProduto(${p.id}, '${escapar(p.nome)}', '${escapar(p.descricao)}', ${p.preco}, ${p.estoque}, '${p.imagem_url || ''}')">✏️ Editar</button>
          <button class="aba btn-acao btn-deletar" onclick="deletarProduto(${p.id}, '${escapar(p.nome)}')">🗑 Remover</button>
        </td>
      </tr>
    `).join('')
  } catch {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#ff5050">Erro ao carregar produtos.</td></tr>'
  }
}

function escapar(str) {
  return String(str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;')
}

document.getElementById('btn-salvar-produto').addEventListener('click', salvarProduto)

async function salvarProduto() {
  const nome     = document.getElementById('prod-nome').value.trim()
  const descricao = document.getElementById('prod-descricao').value.trim()
  const preco    = parseFloat(document.getElementById('prod-preco').value)
  const estoque  = parseInt(document.getElementById('prod-estoque').value)
  const imagem   = document.getElementById('prod-imagem').value.trim()
  const msgEl    = document.getElementById('msg-produtos')

  if (!nome || !descricao || isNaN(preco) || isNaN(estoque)) {
    msgEl.style.color = '#ff8080'
    msgEl.textContent = '⚠️ Preencha todos os campos obrigatórios.'
    return
  }

  const body = { nome, descricao, preco, estoque, imagem_url: imagem || null }
  const url  = editandoId ? `${API}/admin/produtos/${editandoId}` : `${API}/admin/produtos`
  const method = editandoId ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (res.ok) {
      msgEl.style.color = '#00dc64'
      msgEl.textContent = editandoId ? '✅ Produto atualizado!' : '✅ Produto cadastrado!'
      limparFormProduto()
      carregarProdutos()
      setTimeout(() => { msgEl.textContent = '' }, 3000)
    } else {
      const data = await res.json()
      msgEl.style.color = '#ff8080'
      msgEl.textContent = `⚠️ ${data.erro || 'Erro ao salvar.'}`
    }
  } catch {
    msgEl.style.color = '#ff8080'
    msgEl.textContent = '⚠️ Erro de conexão com o servidor.'
  }
}

function editarProduto(id, nome, descricao, preco, estoque, imagem) {
  editandoId = id
  document.getElementById('prod-id').value       = id
  document.getElementById('prod-nome').value      = nome
  document.getElementById('prod-descricao').value = descricao
  document.getElementById('prod-preco').value     = preco
  document.getElementById('prod-estoque').value   = estoque
  document.getElementById('prod-imagem').value    = imagem
  document.getElementById('form-titulo').textContent = '✏️ Editando Produto'
  document.getElementById('btn-cancelar-produto').classList.remove('oculto')
  document.getElementById('form-produto').scrollIntoView({ behavior: 'smooth' })
}

function limparFormProduto() {
  editandoId = null
  document.getElementById('prod-id').value       = ''
  document.getElementById('prod-nome').value      = ''
  document.getElementById('prod-descricao').value = ''
  document.getElementById('prod-preco').value     = ''
  document.getElementById('prod-estoque').value   = ''
  document.getElementById('prod-imagem').value    = ''
  document.getElementById('form-titulo').textContent = '➕ Novo Produto'
  document.getElementById('btn-cancelar-produto').classList.add('oculto')
}

document.getElementById('btn-cancelar-produto').addEventListener('click', limparFormProduto)

async function deletarProduto(id, nome) {
  if (!confirm(`Remover "${nome}" do multiverso?\nEsta ação não pode ser desfeita.`)) return
  const msgEl = document.getElementById('msg-produtos')
  try {
    const res = await fetch(`${API}/admin/produtos/${id}`, { method: 'DELETE' })
    if (res.ok) {
      msgEl.style.color = '#00dc64'
      msgEl.textContent = `✅ "${nome}" removido com sucesso.`
      carregarProdutos()
      setTimeout(() => { msgEl.textContent = '' }, 3000)
    }
  } catch {
    msgEl.style.color = '#ff8080'
    msgEl.textContent = '⚠️ Erro ao remover produto.'
  }
}

// ── PEDIDOS ──────────────────────────────────────────────────
async function carregarPedidos() {
  const tbody = document.getElementById('tbody-pedidos')
  try {
    const res  = await fetch(`${API}/admin/pedidos`)
    const list = await res.json()

    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#555">Nenhum pedido registrado.</td></tr>'
      return
    }

    tbody.innerHTML = list.map(p => `
      <tr>
        <td>#${p.id}</td>
        <td>${p.nome_cliente}</td>
        <td style="font-size:0.7rem">${p.email_cliente}</td>
        <td>R$ ${parseFloat(p.total).toFixed(2).replace('.', ',')}</td>
        <td>
          <select class="status-select" onchange="alterarStatus(${p.id}, this.value)">
            <option value="pendente"   ${p.status === 'pendente'   ? 'selected' : ''}>Pendente</option>
            <option value="confirmado" ${p.status === 'confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="cancelado"  ${p.status === 'cancelado'  ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
        <td style="font-size:0.7rem">${new Date(p.criado_em).toLocaleString('pt-BR')}</td>
      </tr>
    `).join('')
  } catch {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#ff5050">Erro ao carregar pedidos.</td></tr>'
  }
}

async function alterarStatus(id, status) {
  const msgEl = document.getElementById('msg-pedidos')
  try {
    const res = await fetch(`${API}/admin/pedidos/${id}/status`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status })
    })
    if (res.ok) {
      msgEl.style.color = '#00dc64'
      msgEl.textContent = `✅ Status do pedido #${id} atualizado para "${status}".`
      setTimeout(() => { msgEl.textContent = '' }, 3000)
    }
  } catch {
    msgEl.style.color = '#ff8080'
    msgEl.textContent = '⚠️ Erro ao atualizar status.'
  }
}

// ── Init ─────────────────────────────────────────────────────
verificarSessao()
