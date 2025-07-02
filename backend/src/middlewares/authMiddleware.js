import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware para proteger rotas: verifica se o token JWT é válido.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 * @param {Function} next - Função para passar para o próximo middleware.
 */
export const protect = async (req, res, next) => {
  let token;

  // Verifica se o token está no cabeçalho Authorization, "Bearer TOKEN"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token
      token = req.headers.authorization.split(' ')[1];

      // Verifica o token e decodifica
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Busca o usuário pelo ID do token e anexa ao objeto de requisição 
      req.user = await User.findById(decoded.id).select('-password');
      next(); // Prossegue para a próxima função de middleware
    } catch (error) {
      console.error('Erro de autenticação (token inválido):', error.message);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  // Se nenhum token for fornecido
  if (!token) {
    res.status(401).json({ message: 'Não autorizado, nenhum token' });
  }
};

/**
 * @param {Array<string>} roles - Array de papéis permitidos para acessar a rota.
 * @returns {Function} - Middleware de autorização.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Verifica se o papel do usuário (anexado por `protect`) está entre os papéis permitidos
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Usuário com papel '${req.user ? req.user.role : 'desconhecido'}' não tem permissão para acessar esta rota` });
    }
    next(); // Permite o acesso
  };
};
