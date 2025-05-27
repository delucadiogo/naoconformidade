const pool = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

/**
 * Controller para gerenciamento de não conformidades
 */
const naoConformidadeController = {
  /**
   * Cria uma nova não conformidade
   */
  async criar(req, res) {
    console.log('Dados recebidos:', req.body);
    
    const {
      data_lancamento,
      nome_produto,
      validade,
      lote,
      tipo_produto,
      descricao,
      data_liberacao,
      acao_tomada
    } = req.body;

    // Validação dos campos obrigatórios
    const camposObrigatorios = {
      data_lancamento,
      nome_produto,
      validade,
      lote,
      tipo_produto,
      descricao
    };

    const camposFaltantes = Object.entries(camposObrigatorios)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (camposFaltantes.length > 0) {
      console.error('Campos obrigatórios faltando:', camposFaltantes);
      return res.status(400).json({
        mensagem: 'Campos obrigatórios faltando',
        campos: camposFaltantes
      });
    }

    // Função para formatar a data para o formato do PostgreSQL (YYYY-MM-DD)
    const formatarData = (data) => {
      if (!data) return null;
      // Remove qualquer parte de timezone ou hora
      return data.split('T')[0];
    };

    const fotos = req.files ? req.files.map(file => file.filename) : [];
    const criado_por = req.usuario.id;

    try {
      const resultado = await pool.query(
        `INSERT INTO nao_conformidades 
        (data_lancamento, nome_produto, validade, lote, tipo_produto, descricao, 
         fotos, data_liberacao, acao_tomada, criado_por)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          formatarData(data_lancamento),
          nome_produto,
          formatarData(validade),
          lote,
          tipo_produto,
          descricao,
          fotos,
          formatarData(data_liberacao),
          acao_tomada,
          criado_por
        ]
      );

      console.log(`Nova não conformidade criada - ID: ${resultado.rows[0].id}`);
      res.status(201).json(resultado.rows[0]);
    } catch (error) {
      console.error('Erro detalhado ao criar não conformidade:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        mensagem: 'Erro ao criar não conformidade',
        erro: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Lista todas as não conformidades
   */
  async listar(req, res) {
    try {
      const resultado = await pool.query(
        `SELECT nc.*, u.nome as criado_por_nome 
         FROM nao_conformidades nc 
         JOIN usuarios u ON nc.criado_por = u.id 
         ORDER BY nc.criado_em DESC`
      );
      res.json(resultado.rows);
    } catch (error) {
      console.error('Erro ao listar não conformidades:', error);
      res.status(500).json({ mensagem: 'Erro ao listar não conformidades' });
    }
  },

  /**
   * Busca uma não conformidade específica
   */
  async buscarPorId(req, res) {
    const { id } = req.params;

    try {
      const resultado = await pool.query(
        `SELECT nc.*, u.nome as criado_por_nome 
         FROM nao_conformidades nc 
         JOIN usuarios u ON nc.criado_por = u.id 
         WHERE nc.id = $1`,
        [id]
      );

      if (resultado.rows.length === 0) {
        return res.status(404).json({ mensagem: 'Não conformidade não encontrada' });
      }

      res.json(resultado.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar não conformidade:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar não conformidade' });
    }
  },

  /**
   * Atualiza uma não conformidade
   */
  async atualizar(req, res) {
    const { id } = req.params;
    const {
      data_lancamento,
      nome_produto,
      validade,
      lote,
      tipo_produto,
      descricao,
      data_liberacao,
      acao_tomada
    } = req.body;

    // Função para formatar a data para o formato do PostgreSQL (YYYY-MM-DD)
    const formatarData = (data) => {
      if (!data) return null;
      // Remove qualquer parte de timezone ou hora
      return data.split('T')[0];
    };

    try {
      // Verifica se existem novas fotos
      const fotosAtuais = req.files ? req.files.map(file => file.filename) : [];
      
      // Busca as fotos antigas
      const naoConformidadeAtual = await pool.query(
        'SELECT fotos FROM nao_conformidades WHERE id = $1',
        [id]
      );

      if (naoConformidadeAtual.rows.length === 0) {
        return res.status(404).json({ mensagem: 'Não conformidade não encontrada' });
      }

      const fotosAntigas = naoConformidadeAtual.rows[0].fotos || [];
      const todasFotos = [...fotosAntigas, ...fotosAtuais];

      const resultado = await pool.query(
        `UPDATE nao_conformidades 
         SET data_lancamento = $1, nome_produto = $2, validade = $3, 
             lote = $4, tipo_produto = $5, descricao = $6, 
             data_liberacao = $7, acao_tomada = $8, fotos = $9
         WHERE id = $10
         RETURNING *`,
        [
          formatarData(data_lancamento),
          nome_produto,
          formatarData(validade),
          lote,
          tipo_produto,
          descricao,
          formatarData(data_liberacao),
          acao_tomada,
          todasFotos,
          id
        ]
      );

      console.log(`Não conformidade atualizada - ID: ${id}`);
      res.json(resultado.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar não conformidade:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar não conformidade' });
    }
  },

  /**
   * Deleta uma não conformidade
   */
  async deletar(req, res) {
    const { id } = req.params;

    try {
      // Busca as fotos antes de deletar
      const naoConformidade = await pool.query(
        'SELECT fotos FROM nao_conformidades WHERE id = $1',
        [id]
      );

      if (naoConformidade.rows.length === 0) {
        return res.status(404).json({ mensagem: 'Não conformidade não encontrada' });
      }

      // Deleta o registro
      await pool.query('DELETE FROM nao_conformidades WHERE id = $1', [id]);

      // Deleta as fotos do sistema de arquivos
      const fotos = naoConformidade.rows[0].fotos || [];
      for (const foto of fotos) {
        try {
          await fs.unlink(path.join(__dirname, '..', '..', process.env.UPLOAD_FOLDER, foto));
        } catch (error) {
          console.error(`Erro ao deletar arquivo ${foto}:`, error);
        }
      }

      console.log(`Não conformidade deletada - ID: ${id}`);
      res.json({ mensagem: 'Não conformidade deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar não conformidade:', error);
      res.status(500).json({ mensagem: 'Erro ao deletar não conformidade' });
    }
  }
};

module.exports = naoConformidadeController; 