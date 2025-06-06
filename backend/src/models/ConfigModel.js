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
      if (error.code === '23505') { // Código de erro do PostgreSQL para violação de unique
        throw new Error('Já existe um tipo de produto com este nome');
      }
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

  // Tipos de Situação (antigo Tipos de Ação)
  static async getAllSituationTypes() {
    try {
      const query = `
        SELECT 
          id,
          nome as label,
          descricao as value,
          criado_em as "createdAt",
          atualizado_em as "updatedAt"
        FROM tipos_situacao
        WHERE ativo = true
        ORDER BY nome ASC
      `;
      console.log('Executando query getAllSituationTypes:', query);
      
      const { rows } = await db.query(query);
      console.log('Resultado getAllSituationTypes:', rows);
      return rows;
    } catch (error) {
      console.error('Erro em getAllSituationTypes:', error);
      throw error;
    }
  }

  static async createSituationType(data) {
    try {
      const { label, value } = data;
      console.log('Dados recebidos em createSituationType:', { label, value });

      const query = `
        INSERT INTO tipos_situacao (nome, descricao)
        VALUES ($1, $2)
        RETURNING 
          id,
          nome as label,
          descricao as value,
          criado_em as "createdAt",
          atualizado_em as "updatedAt"
      `;
      console.log('Executando query createSituationType:', query, [label, value]);
      
      const { rows } = await db.query(query, [label, value]);
      console.log('Resultado createSituationType:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro em createSituationType:', error);
      if (error.code === '23505') {
        throw new Error('Já existe um tipo de situação com este nome');
      }
      throw error;
    }
  }

  static async deleteSituationType(id) {
    try {
      const query = 'UPDATE tipos_situacao SET ativo = false WHERE id = $1 RETURNING id';
      console.log('Executando query deleteSituationType:', query, [id]);
      
      const { rows } = await db.query(query, [id]);
      console.log('Resultado deleteSituationType:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro em deleteSituationType:', error);
      throw error;
    }
  }

  // Ações
  static async getAllActions() {
    try {
      const query = `
        SELECT 
          id,
          nome as label,
          descricao as value,
          criado_em as "createdAt",
          atualizado_em as "updatedAt"
        FROM acao
        WHERE ativo = true
        ORDER BY nome ASC
      `;
      console.log('Executando query getAllActions:', query);
      
      const { rows } = await db.query(query);
      console.log('Resultado getAllActions:', rows);
      return rows;
    } catch (error) {
      console.error('Erro em getAllActions:', error);
      throw error;
    }
  }

  static async createAction(data) {
    try {
      const { label, value } = data;
      console.log('Dados recebidos em createAction:', { label, value });

      const query = `
        INSERT INTO acao (nome, descricao)
        VALUES ($1, $2)
        RETURNING 
          id,
          nome as label,
          descricao as value,
          criado_em as "createdAt",
          atualizado_em as "updatedAt"
      `;
      console.log('Executando query createAction:', query, [label, value]);
      
      const { rows } = await db.query(query, [label, value]);
      console.log('Resultado createAction:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro em createAction:', error);
      if (error.code === '23505') {
        throw new Error('Já existe uma ação com este nome');
      }
      throw error;
    }
  }

  static async deleteAction(id) {
    try {
      const query = 'UPDATE acao SET ativo = false WHERE id = $1 RETURNING id';
      console.log('Executando query deleteAction:', query, [id]);
      
      const { rows } = await db.query(query, [id]);
      console.log('Resultado deleteAction:', rows[0]);
      return rows[0];
    } catch (error) {
      console.error('Erro em deleteAction:', error);
      throw error;
    }
  }
}

module.exports = ConfigModel; 