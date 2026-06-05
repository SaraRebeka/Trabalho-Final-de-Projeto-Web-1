export class ProdutoRepository {
  constructor(database) {
    this.database = database;
  }

  async getProdutos(busca) {
    try {
      if (busca) {
        const sql = `
          SELECT id, nome, descricao, preco, estoque, imagem_url
          FROM produtos
          WHERE estoque > 0
            AND nome ILIKE $1
          ORDER BY nome
        `;
        const result = await this.database.query(sql, [`%${busca}%`]);
        return result.rows;
      }

      const sql = `
        SELECT id, nome, descricao, preco, estoque, imagem_url
        FROM produtos
        WHERE estoque > 0
        ORDER BY nome
      `;
      const result = await this.database.query(sql);
      return result.rows;
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async getProdutoById(id) {
    try {
      const sql = `
        SELECT id, nome, preco, estoque
        FROM produtos
        WHERE id = $1
        FOR UPDATE
      `;
      const result = await this.database.query(sql, [id]);
      return result.rows[0] ?? null;
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async decrementarEstoque(client, produto_id, quantidade) {
    const sql = `UPDATE produtos SET estoque = estoque - $1 WHERE id = $2`;
    await client.query(sql, [quantidade, produto_id]);
  }

  async criarPedido(client, nome_cliente, email_cliente, itens, total) {
    try {
      const sql = `
        INSERT INTO pedidos (nome_cliente, email_cliente, itens, total, status)
        VALUES ($1, $2, $3, $4, 'confirmado')
        RETURNING id, total, status, criado_em
      `;
      const result = await client.query(sql, [
        nome_cliente,
        email_cliente,
        JSON.stringify(itens),
        total.toFixed(2),
      ]);
      return result.rows[0];
    } catch (erro) {
      return { error: erro.message };
    }
  }
}

// ── Admin: Produtos ──────────────────────────────────────────
export class AdminRepository {
  constructor(database) {
    this.database = database
  }

  async getTodosProdutos() {
    const result = await this.database.query(
      `SELECT id, nome, descricao, preco, estoque, imagem_url FROM produtos ORDER BY id`
    )
    return result.rows
  }

  async criarProduto(nome, descricao, preco, estoque, imagem_url) {
    const result = await this.database.query(
      `INSERT INTO produtos (nome, descricao, preco, estoque, imagem_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, descricao, preco, estoque, imagem_url]
    )
    return result.rows[0]
  }

  async atualizarProduto(id, nome, descricao, preco, estoque, imagem_url) {
    const result = await this.database.query(
      `UPDATE produtos SET nome=$1, descricao=$2, preco=$3, estoque=$4, imagem_url=$5
       WHERE id=$6 RETURNING *`,
      [nome, descricao, preco, estoque, imagem_url, id]
    )
    return result.rows[0] ?? null
  }

  async deletarProduto(id) {
    const result = await this.database.query(
      `DELETE FROM produtos WHERE id=$1 RETURNING id`, [id]
    )
    return result.rows[0] ?? null
  }

  // ── Admin: Pedidos ──
  async getTodosPedidos() {
    const result = await this.database.query(
      `SELECT id, nome_cliente, email_cliente, total, status, criado_em
       FROM pedidos ORDER BY criado_em DESC`
    )
    return result.rows
  }

  async atualizarStatusPedido(id, status) {
    const result = await this.database.query(
      `UPDATE pedidos SET status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    )
    return result.rows[0] ?? null
  }
}
