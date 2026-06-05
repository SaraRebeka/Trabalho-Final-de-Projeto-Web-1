import { database } from "./database.js";
import { ProdutoRepository } from "./repository.js";

const produtoRep = new ProdutoRepository(database);

export async function getProdutos(request, response) {
  const { busca } = request.query;

  const result = await produtoRep.getProdutos(busca);

  if (result.error) return response.status(500).json({ erro: result.error });

  response.status(200).json(result);
}

export async function criarPedido(request, response) {
  const { nome_cliente, email_cliente, itens } = request.body;

  if (!nome_cliente || !email_cliente || !itens || itens.length === 0) {
    return response
      .status(400)
      .json({ erro: "Nome, e-mail e itens são obrigatórios" });
  }

  const client = await database.connect();

  try {
    await client.query("BEGIN");

    let total = 0;
    const itensFinal = [];

    for (const item of itens) {
      const { produto_id, quantidade } = item;

      const produto = await client.query(
        `SELECT id, nome, preco, estoque FROM produtos WHERE id = $1 FOR UPDATE`,
        [produto_id]
      );

      if (produto.rows.length === 0) {
        await client.query("ROLLBACK");
        return response
          .status(400)
          .json({ erro: `Produto de id ${produto_id} não encontrado` });
      }

      const p = produto.rows[0];

      if (p.estoque < quantidade) {
        await client.query("ROLLBACK");
        return response.status(400).json({
          erro: `Estoque insuficiente para: ${p.nome} (disponível: ${p.estoque})`,
        });
      }

      await produtoRep.decrementarEstoque(client, produto_id, quantidade);

      const preco_unit = parseFloat(p.preco);
      total += preco_unit * quantidade;

      itensFinal.push({ produto_id, nome: p.nome, quantidade, preco_unit });
    }

    const pedido = await produtoRep.criarPedido(
      client,
      nome_cliente,
      email_cliente,
      itensFinal,
      total
    );

    if (pedido.error) {
      await client.query("ROLLBACK");
      return response.status(500).json({ erro: pedido.error });
    }

    await client.query("COMMIT");

    response.status(201).json({
      id:        pedido.id,
      total:     parseFloat(pedido.total),
      status:    pedido.status,
      criado_em: pedido.criado_em,
      mensagem:  "Pedido recebido com sucesso!",
    });
  } catch (erro) {
    await client.query("ROLLBACK");
    console.error("Erro ao criar pedido:", erro);
    response.status(500).json({ erro: "Falha ao processar o pedido" });
  } finally {
    client.release();
  }
}

// ── Admin Controllers ────────────────────────────────────────
import { AdminRepository } from './repository.js'

const adminRep = new AdminRepository(database)

export async function getTodosProdutos(request, response) {
  try {
    const result = await adminRep.getTodosProdutos()
    response.status(200).json(result)
  } catch (erro) {
    response.status(500).json({ erro: erro.message })
  }
}

export async function criarProduto(request, response) {
  const { nome, descricao, preco, estoque, imagem_url } = request.body
  if (!nome || !descricao || preco == null || estoque == null)
    return response.status(400).json({ erro: 'Campos obrigatórios ausentes.' })
  try {
    const result = await adminRep.criarProduto(nome, descricao, preco, estoque, imagem_url)
    response.status(201).json(result)
  } catch (erro) {
    response.status(500).json({ erro: erro.message })
  }
}

export async function atualizarProduto(request, response) {
  const { id } = request.params
  const { nome, descricao, preco, estoque, imagem_url } = request.body
  try {
    const result = await adminRep.atualizarProduto(id, nome, descricao, preco, estoque, imagem_url)
    if (!result) return response.status(404).json({ erro: 'Produto não encontrado.' })
    response.status(200).json(result)
  } catch (erro) {
    response.status(500).json({ erro: erro.message })
  }
}

export async function deletarProduto(request, response) {
  const { id } = request.params
  try {
    const result = await adminRep.deletarProduto(id)
    if (!result) return response.status(404).json({ erro: 'Produto não encontrado.' })
    response.status(200).json({ mensagem: 'Produto removido com sucesso.' })
  } catch (erro) {
    response.status(500).json({ erro: erro.message })
  }
}

export async function getTodosPedidos(request, response) {
  try {
    const result = await adminRep.getTodosPedidos()
    response.status(200).json(result)
  } catch (erro) {
    response.status(500).json({ erro: erro.message })
  }
}

export async function atualizarStatusPedido(request, response) {
  const { id } = request.params
  const { status } = request.body
  const validos = ['pendente', 'confirmado', 'cancelado']
  if (!validos.includes(status))
    return response.status(400).json({ erro: 'Status inválido.' })
  try {
    const result = await adminRep.atualizarStatusPedido(id, status)
    if (!result) return response.status(404).json({ erro: 'Pedido não encontrado.' })
    response.status(200).json(result)
  } catch (erro) {
    response.status(500).json({ erro: erro.message })
  }
}
