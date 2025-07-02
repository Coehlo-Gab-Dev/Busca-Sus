import User from '../models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js'; 
import bcrypt from 'bcryptjs';
import crypto from 'crypto'; 
import transporter from '../config/emailTransporter.js';
import jwt from 'jsonwebtoken';   
import passport from 'passport';  

/**
 * Gera  token JWT  o usuário.
 * @param {string} id - O ID do usuário -geralmente o do MongoDB
 * @returns {string} - O token JWT gerado
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, //  um objeto com o ID do usuário
    process.env.JWT_SECRET, // O segredo para assinar o token
    {
      expiresIn: '1d', // O token expira em 1 dia
    }
  );
};

/**
 * Função auxiliar para validar a complexidade da senha.
 * @param {string} password 
 * @returns {string|null} - Uma mensagem de erro se a senha não for forte, ou null se for válida.
 */
const validateStrongPassword = (password) => {
  if (password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra maiúscula.';
  }
  if (!/[a-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra minúscula.';
  }
  if (!/[0-9]/.test(password)) {
    return 'A senha deve conter pelo menos um número.';
  }
  if (!/[!@#$%^&*()_+={}[\]:;<>,.?~\\-]/.test(password)) { 
    return 'A senha deve conter pelo menos um caractere especial.';
  }
  return null; // Senha forte
};


/**
 * @desc Registra um novo usuário (login interno).
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
  }

  // Validação da senha
  const passwordError = validateStrongPassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário com este e-mail já existe.' });
    }

    const user = await User.create({
      username,
      email,
      password, // A senha será hasheada pelo middleware
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválidos.' });
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor ao registrar usuário.' });
  }
};

/**
 * @desc Autentica um usuário e gera um token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, preencha o e-mail e a senha.' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro no servidor ao fazer login.' });
  }
};

/**
 * @desc Obtém o perfil do usuário logado.
 * @route GET /api/auth/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado.' });
  }
};

/**
 * @desc Logout do usuário 
 * @route GET /auth/logout
 * @access Public
 */
export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.session.destroy((err) => {
      if (err) { return next(err); }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout bem-sucedido.' });
    });
  });
};

/**
 * @desc Solicita um link de redefinição de senha.
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Sempre responda com uma mensagem genérica para evitar enumeração de e-mails
    if (!user) {
      console.log(`Tentativa de recuperação para e-mail não encontrado: ${email}`);
      return res.json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação será enviado.' });
    }

    // Gera um token de 32 bytes 
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token válido por 1 Hora 
    
    // Salva o token no banco de dados, substituindo tokens não usados para este usuário
    await PasswordResetToken.findOneAndUpdate(
      { userId: user._id, used: false },
      { userId: user._id, token, expiresAt, used: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const resetLink = `${process.env.BASE_RESET_URL}/redefinir-senha?token=${token}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: 'Redefinição de Senha para sua Conta',
      html: `
        <p>Olá,</p>
        <p>Você solicitou uma redefinição de senha para sua conta.</p>
        <p>Clique no link a seguir para redefinir sua senha:</p>
        <p><a href="${resetLink}">Redefinir Senha</a></p>
        <p>Este link expirará em 1 hora.</p>
        <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
        <p>Atenciosamente,<br>Sua Equipe de Suporte</p>
        <p style="font-size: 0.8em; color: #888;">
            <span style="font-weight: bold;">Por favor, verifique também sua caixa de spam ou lixo eletrônico.</span>
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`E-mail de recuperação enviado para: ${user.email}`);
    res.json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação será enviado.' });

  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('Erros do SendGrid:', error.response.body.errors);
    }
    res.status(500).json({ message: 'Erro ao processar sua solicitação. Tente novamente mais tarde.' });
  }
};

/**
 * @desc Redefine a senha do usuário com um token válido.
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
  }

  // Validação da senha forte
  const passwordError = validateStrongPassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  try {
    const resetRecord = await PasswordResetToken.findOne({ token });

    if (!resetRecord || resetRecord.expiresAt < Date.now() || resetRecord.used) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.password = newPassword; // Atribui a nova senha 
    await user.save(); // Salva o usuário, acionando o hook de hashing no modelo

    // Marca o token como usado para evitar reutilização
    resetRecord.used = true;
    await resetRecord.save();

    // email que confirma a ateração da senha 
    const confirmationMailOptions = {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: 'Senha alterada com sucesso!',
      html: `
        <p>Olá,</p>
        <p>Sua senha em nossa aplicação foi alterada com sucesso.</p>
        <p>Se você não realizou essa alteração, entre em contato conosco imediatamente.</p>
        <p>Atenciosamente,<br>Sua Equipe de Suporte</p>
      `,
    };
    try {
      await transporter.sendMail(confirmationMailOptions);
      console.log(`E-mail de confirmação enviado para: ${user.email}`);
    } catch (emailError) {
      console.error('Erro ao enviar e-mail de confirmação:', emailError);
      if (emailError.response && emailError.response.body && emailError.response.body.errors) {
        console.error('Erros do SendGrid (confirmação):', emailError.response.body.errors);
      }
    }

    res.json({ message: 'Senha redefinida com sucesso!' });

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro no servidor ao redefinir senha.' });
  }
};

export const socialAuthCallback = (provider) => (req, res, next) => {
  passport.authenticate(provider, { session: false }, (err, user, info) => {
    if (err)   return res.redirect('/?authError=server_error');
    if (!user) return res.redirect(`/?authError=${info?.message ?? 'auth_failed'}`);

    const token = generateToken(user._id);
    return res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  })(req, res, next);
};