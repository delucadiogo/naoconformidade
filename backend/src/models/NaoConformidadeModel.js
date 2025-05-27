const db = require('../config/database');

class NaoConformidadeModel {
  static async findAll() {
    const query = `
      SELECT 
        nc.id,
        nc.data_lancamento,
        nc.nome_produto,
        nc.validade,
        nc.lote,
        nc.tipo_produto,
        nc.descricao,
        nc.data_liberacao,
        nc.acao_tomada,
        nc.criado_em,
        nc.atualizado_em,
        nc.criado_por,
        u.nome as nome_usuario
      FROM nao_conformidades nc
      LEFT JOIN usuarios u ON nc.criado_por = u.id::text
      ORDER BY nc.data_lancamento DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        nc.id,
        nc.data_lancamento,
        nc.nome_produto,
        nc.validade,
        nc.lote,
        nc.tipo_produto,
        nc.descricao,
        nc.data_liberacao,
        nc.acao_tomada,
        nc.criado_em,
        nc.atualizado_em,
        nc.criado_por,
        u.nome as nome_usuario
      FROM nao_conformidades nc
      LEFT JOIN usuarios u ON nc.criado_por = u.id::text
      WHERE nc.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async create(data, userId) {
    const {
      data_lancamento,
      nome_produto,
      validade,
      lote,
      tipo_produto,
      descricao,
      data_liberacao,
      acao_tomada
    } = data;

    const query = `
      INSERT INTO nao_conformidades (
        data_lancamento,
        nome_produto,
        validade,
        lote,
        tipo_produto,
        descricao,
        data_liberacao,
        acao_tomada,
        criado_por
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING 
        id,
        data_lancamento,
        nome_produto,
        validade,
        lote,
        tipo_produto,
        descricao,
        data_liberacao,
        acao_tomada,
        criado_em,
        atualizado_em,
        criado_por
    `;

    const values = [
      data_lancamento,
      nome_produto,
      validade,
      lote,
      tipo_produto,
      descricao,
      data_liberacao,
      acao_tomada,
      userId
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, data) {
    const {
      data_lancamento,
      nome_produto,
      validade,
      lote,
      tipo_produto,
      descricao,
      data_liberacao,
      acao_tomada
    } = data;

    const query = `
      UPDATE nao_conformidades
      SET 
        data_lancamento = $1,
        nome_produto = $2,
        validade = $3,
        lote = $4,
        tipo_produto = $5,
        descricao = $6,
        data_liberacao = $7,
        acao_tomada = $8
      WHERE id = $9
      RETURNING 
        id,
        data_lancamento,
        nome_produto,
        validade,
        lote,
        tipo_produto,
        descricao,
        data_liberacao,
        acao_tomada,
        criado_em,
        atualizado_em,
        criado_por
    `;

    const values = [
      data_lancamento,
      nome_produto,
      validade,
      lote,
      tipo_produto,
      descricao,
      data_liberacao,
      acao_tomada,
      id
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM nao_conformidades WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = NaoConformidadeModel; 