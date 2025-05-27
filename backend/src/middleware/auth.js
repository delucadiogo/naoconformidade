const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // O token vem no formato "Bearer <token>"
    const [, token] = authHeader.split(' ');

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adicionar o ID do usuário decodificado à requisição
    req.userId = decoded.id;

    return next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware; 