import express from 'express'
import cors    from 'cors'
import {
  getProdutos,
  criarPedido,
  getTodosProdutos,
  criarProduto,
  atualizarProduto,
  deletarProduto,
  getTodosPedidos,
  atualizarStatusPedido
} from './controller.js'

const server = express()
const PORT   = 3000

server.use(cors())
server.use(express.json())

// ── Rotas públicas ───────────────────────────────────────────
server.get('/api/produtos',   getProdutos)
server.post('/api/pedidos',   criarPedido)

// ── Rotas admin ──────────────────────────────────────────────
server.get('/api/admin/produtos',              getTodosProdutos)
server.post('/api/admin/produtos',             criarProduto)
server.put('/api/admin/produtos/:id',          atualizarProduto)
server.delete('/api/admin/produtos/:id',       deletarProduto)

server.get('/api/admin/pedidos',               getTodosPedidos)
server.patch('/api/admin/pedidos/:id/status',  atualizarStatusPedido)

server.listen(PORT, () => console.log(`Servidor MVC rodando em http://localhost:${PORT}`))
