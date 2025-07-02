import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import 'dotenv/config'; 

// Serialização do usuário para a sessão  login interno e social
// Salva apenas o ID do usuário

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Desserialização do usuário
// Busca o usuário pelo ID

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

//  Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
      scope: ['profile', 'email'], // Solicita acesso ao perfil e e-mail
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Encontra o usuário pelo Google ID 
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Usuário  existente, retorna o usuário
          return done(null, user);
        }

        // Se não encontrou pelo Google ID, tenta encontrar pelo e-mail
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (email) {
          user = await User.findOne({ email });

          if (user) {
            // Usuário com este e-mail já existe seja interno ou externo 
            // Se o Google ID não estiver definido para o usuário, vincula-o
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save(); // Salva a atualização
              console.log(`Conta existente vinculada ao Google: ${email}`);
            } else if (user.googleId !== profile.id) {
                // Caso o email esteja vinculado a outro GoogleId ( improvável )
                console.warn(`Conflito: Email ${email} já vinculado a outro Google ID.`);
                }
            return done(null, user);
          }
        }

        // Se o usuário não foi encontrado por Google ID nem por e-mail, cria um novo usuário
        console.log(`Criando novo usuário Google: ${email}`);
        user = await User.create({
          googleId: profile.id,
          email: email || `${profile.id}@google.com`, // Fallback para email
          username: profile.displayName || profile.name.givenName || `googleUser${profile.id}`,
        });
        done(null, user);

      } catch (error) {
        console.error('Erro na autenticação Google:', error);
        done(error, null);
      }
    }
  )
);

// Estratégia GitHub OAuth 2.0
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`,
      scope: ['user:email'], // Solicita acesso ao e-mail do usuário
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Tenta encontrar o usuário pelo GitHub ID (se já logou com GitHub antes)
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          // Usuário GitHub existente, retorna o usuário
          return done(null, user);
        }

        // Se não encontrou pelo GitHub ID, tenta encontrar pelo e-mail
        // GitHub pode não fornecer o email diretamente se for privado(Preciso entender como lidar)
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        if (email) {
          user = await User.findOne({ email });

          if (user) {
            // Usuário com este e-mail já existe (seja interno ou Google)
            // Se o GitHub ID não estiver definido para este usuário, vincula-o
            if (!user.githubId) {
              user.githubId = profile.id;
              await user.save(); // Salva a atualização
              console.log(`Conta existente vinculada ao GitHub: ${email}`);
            } else if (user.githubId !== profile.id) {
                console.warn(`Conflito: Email ${email} já vinculado a outro GitHub ID.`);
            }
            return done(null, user);
          }
        }
        
        // Se o usuário não foi encontrado , cria um novo usuário
        console.log(`Criando novo usuário GitHub: ${profile.username || profile.id}`);
        user = await User.create({
          githubId: profile.id,
          email: email || `${profile.username || profile.id}@github.com`, // Fallback para email
          username: profile.username,
        });
        done(null, user);

      } catch (error) {
        console.error('Erro na autenticação GitHub:', error);
        done(error, null);
      }
    }
  )
);
