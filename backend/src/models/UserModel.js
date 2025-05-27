const db = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  static async findAll() {
    const query = `
      SELECT 
        id,
        nome as name,
        email,
        funcao as role,
        departamento as department,
        ativo as "isActive",
        criado_em as "createdAt",
        atualizado_em as "updatedAt"
      FROM usuarios
      ORDER BY criado_em DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        id,
        nome as name,
        email,
        funcao as role,
        departamento as department,
        ativo as "isActive",
        criado_em as "createdAt",
        atualizado_em as "updatedAt"
      FROM usuarios
      WHERE id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async create(userData) {
    const { name, email, password, role, department, isActive } = userData;
    
    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO usuarios (
        nome,
        email,
        senha_hash,
        funcao,
        departamento,
        ativo
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id,
        nome as name,
        email,
        funcao as role,
        departamento as department,
        ativo as "isActive",
        criado_em as "createdAt",
        atualizado_em as "updatedAt"
    `;
    const values = [name, email, senha_hash, role, department, isActive];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, userData) {
    const { name, email, password, role, department, isActive } = userData;
    let senha_hash = undefined;
    
    // Se uma nova senha foi fornecida, gera o hash
    if (password) {
      const salt = await bcrypt.genSalt(10);
      senha_hash = await bcrypt.hash(password, salt);
    }

    // Constrói a query dinamicamente baseado na presença ou não da senha
    const setClauses = [
      'nome = $1',
      'email = $2',
      'funcao = $3',
      'departamento = $4',
      'ativo = $5'
    ];
    
    const values = [name, email, role, department, isActive];
    let paramCount = values.length;

    if (senha_hash) {
      setClauses.push(`senha_hash = $${paramCount + 1}`);
      values.push(senha_hash);
      paramCount++;
    }

    values.push(id); // Adiciona o ID como último parâmetro

    const query = `
      UPDATE usuarios
      SET ${setClauses.join(', ')}
      WHERE id = $${paramCount + 1}
      RETURNING 
        id,
        nome as name,
        email,
        funcao as role,
        departamento as department,
        ativo as "isActive",
        criado_em as "createdAt",
        atualizado_em as "updatedAt"
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Método para verificar senha
  static async checkPassword(email, password) {
    const query = `
      SELECT id, senha_hash
      FROM usuarios
      WHERE email = $1
    `;
    const { rows } = await db.query(query, [email]);
    if (rows.length === 0) return false;

    const user = rows[0];
    return bcrypt.compare(password, user.senha_hash);
  }
}

module.exports = UserModel; 