const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

/**
 * Controller para gerenciamento de usuários
 */
const usuarioController = {
  /**
   * Registra um novo usuário
   */
  async registrar(req, res) {
    const { nome, email, senha } = req.body;

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
      const novoUsuario = await pool.query(
        'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
        [nome, email, senhaHash]
      );

      console.log('Usuário registrado com sucesso:', novoUsuario.rows[0]);
      res.status(201).json(novoUsuario.rows[0]);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ mensagem: 'Erro ao registrar usuário' });
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

      if (!usuario) {
        console.log('Usuário não encontrado');
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }

      console.log('Verificando senha...');
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
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          funcao: usuario.funcao
        }
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