const dados = JSON.parse(localStorage.getItem('mvc_confirmacao') || 'null')

// ── Redireciona se não houver dados ─────────────────────────
if (!dados) window.location.href = 'lojinha.html'

// ── Preenche a tela de confirmação ───────────────────────────
document.getElementById('conf-id').textContent      = `#${dados.id}`
document.getElementById('conf-nome').textContent    = dados.nome
document.getElementById('conf-email').textContent   = dados.email
document.getElementById('conf-endereco').textContent = dados.endereco
document.getElementById('conf-total').textContent   = `R$ ${parseFloat(dados.total).toFixed(2).replace('.', ',')}`
document.getElementById('conf-status').textContent  = dados.status.charAt(0).toUpperCase() + dados.status.slice(1)

document.getElementById('conf-itens').innerHTML = `
  <h4 style="margin-bottom:10px; color:#e100ff;">Itens do pedido:</h4>
  ${dados.itens.map(i => `
    <div class="resumo-item">
      <span>${i.nome} × ${i.quantidade}</span>
      <span>R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</span>
    </div>
  `).join('')}
`

// ── Limpa dados de confirmação após exibir ───────────────────
localStorage.removeItem('mvc_confirmacao')
