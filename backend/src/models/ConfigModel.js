const db = require('../config/database');

class ConfigModel {
  // Tipos de Produto
  static async getAllProductTypes() {
    const query = `
      SELECT 
        id,
        rotulo as label,
        valor as value,
        criado_em as "createdAt",
        atualizado_em as "updatedAt"
      FROM tipos_produto
      ORDER BY criado_em DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async createProductType(data) {
    const { label, value } = data;
    const query = `
      INSERT INTO tipos_produto (rotulo, valor)
      VALUES ($1, $2)
      RETURNING 
        id,
        rotulo as label,
        valor as value,
        criado_em as "createdAt",
        atualizado_em as "updatedAt"
    `;
    const { rows } = await db.query(query, [label, value]);
    return rows[0];
  }

  static async deleteProductType(id) {
    const query = 'DELETE FROM tipos_produto WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Tipos de Ação
  static async getAllActionTypes() {
    const query = `
      SELECT 
        id,
        rotulo as label,
        valor as value,
        criado_em as "createdAt",
        atualizado_em as "updatedAt"
      FROM tipos_acao
      ORDER BY criado_em DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async createActionType(data) {
    const { label, value } = data;
    const query = `
      INSERT INTO tipos_acao (rotulo, valor)
      VALUES ($1, $2)
      RETURNING 
        id,
        rotulo as label,
        valor as value,
        criado_em as "createdAt",
        atualizado_em as "updatedAt"
    `;
    const { rows } = await db.query(query, [label, value]);
    return rows[0];
  }

  static async deleteActionType(id) {
    const query = 'DELETE FROM tipos_acao WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = ConfigModel; 