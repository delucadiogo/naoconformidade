const UserModel = require('../models/UserModel');

class UserController {
  // Listar todos os usuários
  static async index(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar um usuário específico
  static async show(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Criar um novo usuário
  static async create(req, res) {
    try {
      const userData = req.body;
      const newUser = await UserModel.create(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if (error.code === '23505') { // Código de erro do PostgreSQL para violação de unique
        res.status(400).json({ error: 'Email já cadastrado' });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  // Atualizar um usuário
  static async update(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      
      const updatedUser = await UserModel.update(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (error.code === '23505') {
        res.status(400).json({ error: 'Email já cadastrado' });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  // Deletar um usuário
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await UserModel.delete(id);
      
      if (!deletedUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = UserController; 