import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  forgotPassword,
  resetPassword,
  socialAuthCallback, 
} from '../controllers/authController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Endpoints relacionados à autenticação de usuários (registro, login, OAuth, senha)
 */

/* ========================= Registro ========================= */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um novo usuário com nome de usuário, e-mail e senha.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos ou usuário já existente
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', registerUser);

/* ========================= Login ========================= */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     description: Realiza o login de um usuário e retorna um token JWT.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: senhaSegura123
 *     responses:
 *       200:
 *         description: Login bem-sucedido, token JWT retornado
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginUser);

/* ========================= OAuth - Google ========================= */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Inicia autenticação via Google
 *     description: Redireciona o usuário para o login via Google OAuth 2.0.
 *     tags: [Autenticação]
 *     responses:
 *       302:
 *         description: Redirecionamento para o provedor Google OAuth
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback da autenticação via Google
 *     description: Processa a resposta de autenticação do Google e redireciona o usuário.
 *     tags: [Autenticação]
 *     responses:
 *       302:
 *         description: Redirecionamento para o frontend após login
 */
router.get('/google/callback', socialAuthCallback('google'));

/* ========================= OAuth - GitHub ========================= */

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Inicia autenticação via GitHub
 *     description: Redireciona o usuário para o login via GitHub OAuth.
 *     tags: [Autenticação]
 *     responses:
 *       302:
 *         description: Redirecionamento para o GitHub OAuth
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: Callback da autenticação via GitHub
 *     description: Processa a resposta de autenticação do GitHub e redireciona o usuário.
 *     tags: [Autenticação]
 *     responses:
 *       302:
 *         description: Redirecionamento para o frontend após login com GitHub
 */
router.get('/github/callback', socialAuthCallback('github'));

/* ========================= Recuperação de Senha ========================= */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicita redefinição de senha
 *     description: Envia um e-mail com instruções para redefinir a senha do usuário.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *     responses:
 *       200:
 *         description: E-mail de redefinição enviado
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefine a senha do usuário
 *     description: Atualiza a senha do usuário com base no token de redefinição enviado por e-mail.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *                 example: token123abc
 *               password:
 *                 type: string
 *                 example: novaSenhaForte456
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/reset-password', resetPassword);

/* ========================= Perfil do Usuário ========================= */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário retornadas
 *       401:
 *         description: Token JWT ausente ou inválido
 */
router.get('/profile', protect, getUserProfile);

/* ========================= Acesso de Administrador ========================= */

/**
 * @swagger
 * /api/auth/admin:
 *   get:
 *     summary: Exemplo de rota protegida para administradores
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso concedido ao administrador
 *       403:
 *         description: Acesso negado – requer privilégios de administrador
 */
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}!` });
});

/* ========================= Logout ========================= */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Realiza logout do usuário
 *     description: Encerra a sessão do usuário atual.
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.get('/logout', logoutUser);

export default router;
