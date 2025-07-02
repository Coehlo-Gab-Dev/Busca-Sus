import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import 'dotenv/config';
import connectDB from './config/db.js';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import passport from 'passport';
import './config/passport-setup.js';
import './config/emailTransporter.js';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import MongoStore from 'connect-mongo'; 

import placesRoutes from './routes/placesRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Conecta ao MongoDB
connectDB();

const app = express();

// 1. CORS
app.use(cors(corsOptions));

// 2. Body parser para JSON
app.use(express.json());

// 3. Proteção contra injeção de NoSQL
app.use(mongoSanitize());

// 4. Servir a documentação Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 5. Middleware de Sessão 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // Configura o MongoStore para armazenar as sessões no MongoDB
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, 
        collectionName: 'sessions', // Nome da coleção onde as sessões serão salvas
        ttl: 24 * 60 * 60, // Tempo de vida da sessão em segundos (24 horas)
    }),
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        secure: process.env.NODE_ENV === 'production' 
    },
  })
);

// Middleware do Passport
app.use(passport.initialize());
app.use(passport.session());

// ROTAS DA API

// Rotas principais da API
app.use('/api', placesRoutes);
app.use('/api/auth', authRoutes); // Rotas de autenticação (interna, social e redefinição de senha)

// Rota raiz para verificar se a API está online
app.get('/', (req, res) => {
    res.json({ message: 'API Desafio-05 está no ar!', docs: '/api-docs' });
});


// Rota para verificar o status de autenticação do usuário
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Verifica autenticação do utilizador via sessão
 *     tags: [Utilizador]
 *     responses:
 *       200:
 *         description: Utilizador autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64a3219cf2a1e90017c3b7e2"
 *                 username:
 *                   type: string
 *                   example: "joaosilva"
 *                 email:
 *                   type: string
 *                   example: "joao@example.com"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *       401:
 *         description: Utilizador não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilizador não autenticado via sessão"
 */

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(401).json({ message: 'Utilizador não autenticado via sessão' });
  }
});


// Tratamento de rotas não encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint não encontrado.' });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado no servidor!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`Variáveis de ambiente carregadas. Verifique o seu .env`);
});
