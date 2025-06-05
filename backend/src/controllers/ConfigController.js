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

  // Tipos de Ação
  static async getAllActionTypes(req, res) {
    try {
      const types = await ConfigModel.getAllActionTypes();
      res.json(types);
    } catch (error) {
      console.error('Erro ao listar tipos de ação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async createActionType(req, res) {
    try {
      console.log('Dados recebidos para criar tipo de ação:', req.body);
      const { label, value } = req.body;
      
      if (!label || !value) {
        console.log('Campos obrigatórios faltando:', { label, value });
        return res.status(400).json({ error: 'Rótulo e valor são obrigatórios' });
      }

      console.log('Tentando criar tipo de ação:', { label, value });
      const newType = await ConfigModel.createActionType({ label, value });
      console.log('Tipo de ação criado com sucesso:', newType);
      
      res.status(201).json(newType);
    } catch (error) {
      console.error('Erro detalhado ao criar tipo de ação:', error);
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

  static async deleteActionType(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ConfigModel.deleteActionType(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Tipo de ação não encontrado' });
      }
      res.json({ message: 'Tipo de ação deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar tipo de ação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = ConfigController; 