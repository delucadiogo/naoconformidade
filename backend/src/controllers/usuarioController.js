const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * Mapeia os campos do banco de dados para o formato do frontend
 */
const mapUserToFrontend = (user) => ({
  id: user.id,
  nome: user.nome,
  email: user.email,
  funcao: user.funcao,
  departamento: user.departamento,
  ativo: user.ativo,
  criado_em: user.criado_em,
  atualizado_em: user.atualizado_em
});

/**
 * Controller para gerenciamento de usuários
 */
const usuarioController = {
  /**
   * Lista todos os usuários
   */
  async listar(req, res) {
    try {
      const resultado = await pool.query(
        'SELECT id, nome, email, funcao, departamento, ativo, criado_em, atualizado_em FROM usuarios ORDER BY nome'
      );
      res.json(resultado.rows.map(mapUserToFrontend));
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ mensagem: 'Erro ao listar usuários' });
    }
  },

  /**
   * Busca um usuário pelo ID
   */
  async buscarPorId(req, res) {
    const { id } = req.params;
    try {
      const resultado = await pool.query(
        'SELECT id, nome, email, funcao, departamento, ativo, criado_em, atualizado_em FROM usuarios WHERE id = $1',
        [id]
      );

      if (resultado.rows.length === 0) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      res.json(mapUserToFrontend(resultado.rows[0]));
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
  },

  /**
   * Cria um novo usuário
   */
  async criar(req, res) {
    const { nome, email, senha, funcao, departamento } = req.body;

    try {
      // Verifica se o usuário já existe
      const usuarioExistente = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );

      if (usuarioExistente.rows.length > 0) {
        return res.status(400).json({ mensagem: 'Email já cadastrado' });
      }

      // Criptografa a senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      // Insere o novo usuário
      const resultado = await pool.query(
        'INSERT INTO usuarios (nome, email, senha_hash, funcao, departamento, ativo) VALUES ($1, $2, $3, $4, $5, true) RETURNING id, nome, email, funcao, departamento, ativo, criado_em, atualizado_em',
        [nome, email, senhaHash, funcao, departamento]
      );

      res.status(201).json(mapUserToFrontend(resultado.rows[0]));
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ mensagem: 'Erro ao criar usuário' });
    }
  },

  /**
   * Atualiza um usuário existente
   */
  async atualizar(req, res) {
    const { id } = req.params;
    // Mapeia os campos do frontend para o formato do backend
    const { 
      name: nome, 
      email, 
      password: senha, 
      role: funcao, 
      department: departamento, 
      isActive: ativo 
    } = req.body;

    try {
      // Verifica se o usuário existe antes de tentar atualizar
      const usuarioExiste = await pool.query(
        'SELECT id FROM usuarios WHERE id = $1',
        [id]
      );

      if (usuarioExiste.rows.length === 0) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      let query = 'UPDATE usuarios SET nome = $1, email = $2, funcao = $3, departamento = $4, ativo = $5';
      let params = [nome, email, funcao, departamento, ativo];
      let paramCount = 5;

      // Se uma nova senha foi fornecida, atualiza a senha
      if (senha) {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        query += `, senha_hash = $${paramCount + 1}`;
        params.push(senhaHash);
        paramCount++;
      }

      query += ` WHERE id = $${paramCount + 1} RETURNING id, nome, email, funcao, departamento, ativo, criado_em, atualizado_em`;
      params.push(id);

      const resultado = await pool.query(query, params);

      if (resultado.rows.length === 0) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      res.json(mapUserToFrontend(resultado.rows[0]));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
    }
  },

  /**
   * Remove um usuário
   */
  async deletar(req, res) {
    const { id } = req.params;

    try {
      const resultado = await pool.query(
        'DELETE FROM usuarios WHERE id = $1 RETURNING id',
        [id]
      );

      if (resultado.rows.length === 0) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado' });
      }

      res.json({ mensagem: 'Usuário removido com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ mensagem: 'Erro ao deletar usuário' });
    }
  },

  /**
   * Realiza o login do usuário
   */
  async login(req, res) {
    console.log('Tentativa de login recebida:', req.body);
    const { email, senha } = req.body;

    try {
      console.log('Buscando usuário no banco de dados...');
      // Busca o usuário
      const resultado = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );

      const usuario = resultado.rows[0];
      console.log('Usuário encontrado:', usuario ? 'Sim' : 'Não');
      if (usuario) {
        console.log('Dados do usuário:', {
          id: usuario.id,
          email: usuario.email,
          senha_hash: usuario.senha_hash
        });
      }

      if (!usuario) {
        console.log('Usuário não encontrado');
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }

      console.log('Verificando senha...');
      console.log('Senha fornecida:', senha);
      console.log('Hash armazenado:', usuario.senha_hash);
      
      // Verifica a senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      console.log('Senha válida:', senhaValida ? 'Sim' : 'Não');

      if (!senhaValida) {
        console.log('Senha inválida');
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }

      console.log('Gerando token JWT...');
      // Gera o token JWT
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email,
          funcao: usuario.funcao 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Login realizado com sucesso');
      res.json({
        token,
        usuario: mapUserToFrontend(usuario)
      });
    } catch (error) {
      console.error('Erro detalhado ao realizar login:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        mensagem: 'Erro ao realizar login',
        erro: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = usuarioController; 