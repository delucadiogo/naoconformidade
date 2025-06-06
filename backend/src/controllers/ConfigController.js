const ConfigModel = require('../models/ConfigModel');

class ConfigController {
  // Tipos de Produto
  static async getAllProductTypes(req, res) {
    try {
      const types = await ConfigModel.getAllProductTypes();
      res.json(types);
    } catch (error) {
      console.error('Erro ao listar tipos de produto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async createProductType(req, res) {
    try {
      console.log('Dados recebidos para criar tipo de produto:', req.body);
      const { label, value } = req.body;
      
      if (!label || !value) {
        console.log('Campos obrigatórios faltando:', { label, value });
        return res.status(400).json({ error: 'Rótulo e valor são obrigatórios' });
      }

      console.log('Tentando criar tipo de produto:', { label, value });
      const newType = await ConfigModel.createProductType({ label, value });
      console.log('Tipo de produto criado com sucesso:', newType);
      
      res.status(201).json(newType);
    } catch (error) {
      console.error('Erro detalhado ao criar tipo de produto:', error);
      console.error('Stack trace:', error.stack);
      
      if (error.code === '23505') { // Código de erro do PostgreSQL para violação de unique
        res.status(400).json({ error: 'Valor já existe' });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  }

  static async deleteProductType(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ConfigModel.deleteProductType(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Tipo de produto não encontrado' });
      }
      res.json({ message: 'Tipo de produto deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar tipo de produto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Tipos de Situação (antigo Tipos de Ação)
  static async getAllSituationTypes(req, res) {
    try {
      const types = await ConfigModel.getAllSituationTypes();
      res.json(types);
    } catch (error) {
      console.error('Erro ao listar tipos de situação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async createSituationType(req, res) {
    try {
      console.log('Dados recebidos para criar tipo de situação:', req.body);
      const { label, value } = req.body;
      
      if (!label || !value) {
        console.log('Campos obrigatórios faltando:', { label, value });
        return res.status(400).json({ error: 'Rótulo e valor são obrigatórios' });
      }

      console.log('Tentando criar tipo de situação:', { label, value });
      const newType = await ConfigModel.createSituationType({ label, value });
      console.log('Tipo de situação criado com sucesso:', newType);
      
      res.status(201).json(newType);
    } catch (error) {
      console.error('Erro detalhado ao criar tipo de situação:', error);
      console.error('Stack trace:', error.stack);
      
      if (error.code === '23505') {
        res.status(400).json({ error: 'Valor já existe' });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  }

  static async deleteSituationType(req, res) {
    try {
      const { id } = req.params;
      await ConfigModel.deleteSituationType(id);
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar tipo de situação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Ações
  static async getAllActions(req, res) {
    try {
      const actions = await ConfigModel.getAllActions();
      res.json(actions);
    } catch (error) {
      console.error('Erro ao listar ações:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async createAction(req, res) {
    try {
      console.log('Dados recebidos para criar ação:', req.body);
      const { label, value } = req.body;
      
      if (!label || !value) {
        console.log('Campos obrigatórios faltando:', { label, value });
        return res.status(400).json({ error: 'Rótulo e valor são obrigatórios' });
      }

      console.log('Tentando criar ação:', { label, value });
      const newAction = await ConfigModel.createAction({ label, value });
      console.log('Ação criada com sucesso:', newAction);
      
      res.status(201).json(newAction);
    } catch (error) {
      console.error('Erro detalhado ao criar ação:', error);
      console.error('Stack trace:', error.stack);
      
      if (error.code === '23505') {
        res.status(400).json({ error: 'Valor já existe' });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  }

  static async deleteAction(req, res) {
    try {
      const { id } = req.params;
      await ConfigModel.deleteAction(id);
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar ação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = ConfigController; 