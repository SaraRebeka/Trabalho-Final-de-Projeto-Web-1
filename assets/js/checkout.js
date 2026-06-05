const API = 'http://localhost:3000/api'

const carrinho = JSON.parse(localStorage.getItem('mvc_carrinho') || '[]')

// ── Redireciona se carrinho vazio ────────────────────────────
if (!carrinho.length) window.location.href = 'lojinha.html'

// ── Preenche resumo ──────────────────────────────────────────
const resumoItens = document.getElementById('resumo-itens')
const resumoTotal = document.getElementById('resumo-total')

const total = carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0)

resumoItens.innerHTML = carrinho.map(i => `
  <div class="resumo-item">
    <span>${i.nome} × ${i.quantidade}</span>
    <span>R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</span>
  </div>
`).join('')

resumoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`

// ── Máscaras simples ─────────────────────────────────────────
document.getElementById('cep').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9)
})

document.getElementById('estado').addEventListener('input', function () {
  this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
})

// ── Confirmar pedido ─────────────────────────────────────────
document.getElementById('btn-confirmar').addEventListener('click', async () => {
  const nome    = document.getElementById('nome').value.trim()
  const email   = document.getElementById('email').value.trim()
  const rua     = document.getElementById('rua').value.trim()
  const bairro  = document.getElementById('bairro').value.trim()
  const cidade  = document.getElementById('cidade').value.trim()
  const estado  = document.getElementById('estado').value.trim()
  const cep     = document.getElementById('cep').value.trim()
  const erroEl  = document.getElementById('erro-checkout')

  if (!nome || !email || !rua || !bairro || !cidade || !estado || !cep) {
    erroEl.textContent = '⚠️ Preencha todos os campos antes de confirmar.'
    erroEl.classList.remove('oculto')
    return
  }

  erroEl.classList.add('oculto')

  const enderecoCompleto = `${rua}, ${bairro}, ${cidade} - ${estado}, CEP ${cep}`

  const body = {
    nome_cliente:  nome,
    email_cliente: email,
    endereco:      enderecoCompleto,
    itens: carrinho.map(i => ({ produto_id: i.produto_id, quantidade: i.quantidade }))
  }

  const btn = document.getElementById('btn-confirmar')
  btn.disabled = true
  btn.textContent = 'Enviando...'

  try {
    const res  = await fetch(`${API}/pedidos`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    })

    const data = await res.json()

    if (!res.ok) {
      erroEl.textContent = `⚠️ ${data.erro || 'Erro ao processar pedido.'}`
      erroEl.classList.remove('oculto')
      btn.disabled = false
      btn.textContent = 'Confirmar Pedido 🚀'
      return
    }

    // Salva dados da confirmação e limpa carrinho
    localStorage.setItem('mvc_confirmacao', JSON.stringify({
      id:       data.id,
      nome,
      email,
      endereco: enderecoCompleto,
      total:    data.total,
      status:   data.status,
      itens:    carrinho
    }))
    localStorage.removeItem('mvc_carrinho')

    window.location.href = 'confirmacao.html'

  } catch {
    erroEl.textContent = '⚠️ Erro de conexão com o servidor. Verifique se o back-end está rodando.'
    erroEl.classList.remove('oculto')
    btn.disabled = false
    btn.textContent = 'Confirmar Pedido 🚀'
  }
})
