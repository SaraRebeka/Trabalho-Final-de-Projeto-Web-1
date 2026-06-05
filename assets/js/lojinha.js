const API = 'http://localhost:3000/api'

// ── Estado do carrinho ──────────────────────────────────────
let carrinho = JSON.parse(localStorage.getItem('mvc_carrinho') || '[]')

// ── Elementos ───────────────────────────────────────────────
const grade          = document.getElementById('grade-produtos')
const carrinhoPanel  = document.getElementById('carrinho-flutuante')
const carrinhoItens  = document.getElementById('carrinho-itens')
const carrinhoTotal  = document.getElementById('carrinho-total')
const carrinhoContador = document.getElementById('carrinho-contador')
const btnAbrir       = document.getElementById('btn-abrir-carrinho')
const btnFechar      = document.getElementById('fechar-carrinho')
const btnCheckout    = document.getElementById('btn-checkout')
const buscaInput     = document.getElementById('busca-input')

// ── Carregar produtos ────────────────────────────────────────
async function carregarProdutos(busca = '') {
  grade.innerHTML = '<p class="carregando">Carregando produtos do multiverso...</p>'
  try {
    const url = busca ? `${API}/produtos?busca=${encodeURIComponent(busca)}` : `${API}/produtos`
    const res  = await fetch(url)
    const produtos = await res.json()

    if (!produtos.length) {
      grade.innerHTML = '<p class="carregando">Nenhum produto encontrado nessa realidade.</p>'
      return
    }

    grade.innerHTML = produtos.map(p => `
      <div class="card-produto">
        <div class="card-imagem">
          ${p.imagem_url
            ? `<img src="${p.imagem_url}" alt="${p.nome}" />`
            : `<div class="sem-imagem">🌌</div>`}
        </div>
        <div class="card-info">
          <h3 class="card-nome">${p.nome}</h3>
          <p class="card-desc">${p.descricao}</p>
          <p class="card-preco">R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')}</p>
          <p class="card-estoque">Estoque: ${p.estoque}</p>
        </div>
        <button class="btn-adicionar" data-id="${p.id}" data-nome="${p.nome}" data-preco="${p.preco}" data-estoque="${p.estoque}">
          + Adicionar
        </button>
      </div>
    `).join('')

    document.querySelectorAll('.btn-adicionar').forEach(btn => {
      btn.addEventListener('click', adicionarAoCarrinho)
    })

  } catch {
    grade.innerHTML = '<p class="carregando">Erro ao conectar com o servidor. Verifique se o back-end está rodando.</p>'
  }
}

// ── Carrinho ─────────────────────────────────────────────────
function adicionarAoCarrinho(e) {
  const { id, nome, preco, estoque } = e.currentTarget.dataset
  const item = carrinho.find(i => i.produto_id === Number(id))

  if (item) {
    if (item.quantidade >= Number(estoque)) return alert('Estoque máximo atingido!')
    item.quantidade++
  } else {
    carrinho.push({ produto_id: Number(id), nome, preco: parseFloat(preco), quantidade: 1, estoque: Number(estoque) })
  }

  salvarCarrinho()
  renderCarrinho()
  abrirCarrinho()
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(i => i.produto_id !== id)
  salvarCarrinho()
  renderCarrinho()
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(i => i.produto_id === id)
  if (!item) return
  if (delta > 0 && item.quantidade >= item.estoque) {
    return alert('Estoque máximo atingido!')
  }
  item.quantidade += delta
  if (item.quantidade <= 0) removerDoCarrinho(id)
  else { salvarCarrinho(); renderCarrinho() }
}

function salvarCarrinho() {
  localStorage.setItem('mvc_carrinho', JSON.stringify(carrinho))
}

function renderCarrinho() {
  const total = carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0)
  carrinhoContador.textContent = carrinho.reduce((acc, i) => acc + i.quantidade, 0)
  carrinhoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`
  btnCheckout.disabled = carrinho.length === 0

  if (!carrinho.length) {
    carrinhoItens.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>'
    return
  }

  carrinhoItens.innerHTML = carrinho.map(i => `
    <div class="carrinho-item">
      <span class="item-nome">${i.nome}</span>
      <div class="item-controles">
        <button class="btn-qty" data-id="${i.produto_id}" data-delta="-1">−</button>
        <span>${i.quantidade}</span>
        <button class="btn-qty" data-id="${i.produto_id}" data-delta="1">+</button>
      </div>
      <span class="item-subtotal">R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</span>
      <button class="btn-remover" data-id="${i.produto_id}">🗑</button>
    </div>
  `).join('')

  document.querySelectorAll('.btn-qty').forEach(b => {
    b.addEventListener('click', () => alterarQuantidade(Number(b.dataset.id), Number(b.dataset.delta)))
  })
  document.querySelectorAll('.btn-remover').forEach(b => {
    b.addEventListener('click', () => removerDoCarrinho(Number(b.dataset.id)))
  })
}

function abrirCarrinho()  { carrinhoPanel.classList.remove('oculto') }
function fecharCarrinho() { carrinhoPanel.classList.add('oculto') }

// ── Eventos ──────────────────────────────────────────────────
btnAbrir.addEventListener('click', abrirCarrinho)
btnFechar.addEventListener('click', fecharCarrinho)

btnCheckout.addEventListener('click', () => {
  window.location.href = 'checkout.html'
})

let buscaTimer
buscaInput.addEventListener('input', () => {
  clearTimeout(buscaTimer)
  buscaTimer = setTimeout(() => carregarProdutos(buscaInput.value.trim()), 400)
})

// ── Init ─────────────────────────────────────────────────────
renderCarrinho()
carregarProdutos()