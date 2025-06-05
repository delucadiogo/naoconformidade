const db = require('../config/database');

class ConfigModel {
  // Tipos de Produto
  static async getAllProductTypes() {
    try {
      const query = `
        SELECT 
          id,
          nome as label,
          descricao as value,
          criado_em as "createdAt",
          atualizado_em as "updatedAt"
        FROM tipos_produto
        WHERE ativo = true
        ORDER BY nome ASC
      `;
      console.log('Executando query getAllProductTypes:', query);
      const { rows } = await db.query(query);
      console.log('Resultado getAllProductTypes:', rows);
      return rows;
    } catch (error) {
      console.error('Erro em getAllProductTypes:', error);
      throw error;
    }
  }

  static async createProductType(data) {
    try {
      const { label, value } = data;
      console.log('Dados recebidos em createProductType:', { label, value });

      const query = `
        INSERT INTO tipos_produto (nome, descricao)
        VALUES ($1, $2)
        RETURNING 
          id,
          nome as label,
          descricao as value,
          criado_em as "createdAt",
          atualizado_em as "updatedAt"
      `;
      console.log('Executando query createProductType:', query, [label, value]);
      
      const { rows } = await db.query(query, [label, value]);
      console.log('Resultado createProductType:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro em createProductType:', error);
      throw error;
    }
  }

  static async deleteProductType(id) {
    try {
      const query = 'UPDATE tipos_produto SET ativo = false WHERE id = $1 RETURNING id';
      console.log('Executando query deleteProductType:', query, [id]);
      
      const { rows } = await db.query(query, [id]);
      console.log('Resultado deleteProductType:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro em deleteProductType:', error);
      throw error;
    }
  }

  // Tipos de Ação
  static async getAllActionTypes() {
    try {
      const query = `
        SELECT 
          id,
          nome as label,
          descricao as value,
          criado_em as "createdAt",
          atualizado_em as "updatedAt"
        FROM tipos_acao
        WHERE ativo = true
        ORDER BY nome ASC
      `;
      console.log('Executando query getAllActionTypes:', query);
      
      const { rows } = await db.query(query);
      console.log('Resultado getAllActionTypes:', rows);
      return rows;
    } catch (error) {
      console.error('Erro em getAllActionTypes:', error);
      throw error;
    }
  }

  static async createActionType(data) {
    try {
      const { label, value } = data;
      console.log('Dados recebidos em createActionType:', { label, value });

      const query = `
        INSERT INTO tipos_acao (nome, descricao)
        VALUES ($1, $2)
        RETURNING 
          id,
          nome as label,
          descricao as value,
          criado_em as "createdAt",
          atualizado_em as "updatedAt"
      `;
      console.log('Executando query createActionType:', query, [label, value]);
      
      const { rows } = await db.query(query, [label, value]);
      console.log('Resultado createActionType:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro em createActionType:', error);
      throw error;
    }
  }

  static async deleteActionType(id) {
    try {
      const query = 'UPDATE tipos_acao SET ativo = false WHERE id = $1 RETURNING id';
      console.log('Executando query deleteActionType:', query, [id]);
      
      const { rows } = await db.query(query, [id]);
      console.log('Resultado deleteActionType:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro em deleteActionType:', error);
      throw error;
    }
  }
}

module.exports = ConfigModel; 