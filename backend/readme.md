# 🗺️ API de Rotas e Locais com Google Cloud e Autenticação

Back‑end de uma aplicação web que integra **Google Maps Platform** (Maps, Places e Directions) a um sistema de **autenticação completo** (login interno via JWT + Google OAuth + GitHub OAuth).  
Persistência em **MongoDB**, com _fallback_ local caso as APIs externas fiquem indisponíveis.

---

## 📁 Estrutura do Projeto

```text
.
├── .env                        # Variáveis de ambiente (NÃO FAÇA COMMIT!)
├── package.json                # Dependências e scripts
├── README.md                   # Este arquivo
└── src/
    ├── app.js                  # Ponto de entrada (Express)
    ├── config/
    │   ├── db.js               # Conexão MongoDB
    │   └── passport-setup.js   # Estratégias OAuth (Google, GitHub)
    ├── controllers/
    │   ├── authController.js   # Autenticação (interno + social)
    │   └── placesController.js # Integração Google Places + fallback
    ├── middlewares/
    │   └── authMiddleware.js   # JWT + autorização por papel (role)
    ├── models/
    │   ├── User.js             # Modelo de usuário
    │   └── Place.js            # Modelo de locais para fallback
    └── routes/
        ├── authRoutes.js       # Rotas de autenticação
        └── placesRoutes.js     # Rotas de locais
```

---

## 🚀 Como Começar

### ✅ Pré‑requisitos

- **Node.js** v18+
    
- **MongoDB** (local ou Atlas)
    
- Conta na **Google Cloud** com as APIs
    
    - Maps JavaScript API
        
    - Places API
        
    - Directions API
        
- Credenciais **OAuth 2.0** (Google e GitHub)
    

### 🔧 Instalação

```bash
git clone https://github.com/Coehlo-Gab-Dev/Desafio-05-Back-End
cd Desafio-05-Back-End
npm install
```

### ⚙️ Configuração (`.env`)

```env
PORT=3001
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority

JWT_SECRET=sua_chave_jwt_super_secreta
SESSION_SECRET=sua_chave_para_sessao

PLACES_API_KEY=sua_chave_google_places

GOOGLE_CLIENT_ID=client_id_google
GOOGLE_CLIENT_SECRET=client_secret_google

GITHUB_CLIENT_ID=client_id_github
GITHUB_CLIENT_SECRET=client_secret_github

BASE_URL=http://localhost:3001
```

> **Importante:** cadastre as _callback URLs_ exatamente como acima nos painéis do Google e do GitHub.

---

## ▶️ Execução

```bash
# Desenvolvimento
npm run dev           # nodemon

# Produção
npm start
```

Servidor de produção: **[https://desafio-05-api.onrender.com](https://desafio-05-api.onrender.com/)**

---

## 📚 Documentação da API

Documentação interativa **Swagger UI**  
[https://desafio-05-api.onrender.com/api-docs](https://desafio-05-api.onrender.com/api-docs)

---

## 🔐 Endpoints de Autenticação (`/api/auth`)

|Método|Rota|Descrição|Proteção|
|---|---|---|---|
|POST|`/register`|Cria usuário interno|—|
|POST|`/login`|Login interno (JWT)|—|
|GET|`/google`|Login via Google OAuth|—|
|GET|`/google/callback`|Callback Google|—|
|GET|`/github`|Login via GitHub OAuth|—|
|GET|`/github/callback`|Callback GitHub|—|
|POST|`/forgot-password`|Solicita redefinição de senha (envia e‑mail)|—|
|POST|`/reset-password`|Redefine senha a partir de token|—|
|GET|`/profile`|Perfil do usuário autenticado|JWT|
|GET|`/admin`|Acesso restrito a administradores|JWT + Role|
|GET|`/logout`|Logout (sessões OAuth)|—|

_Fontes: definição de rotas em_ `src/routes/authRoutes.js` ([raw.githubusercontent.com](https://raw.githubusercontent.com/Coehlo-Gab-Dev/Desafio-05-Back-End/main/src/routes/authRoutes.js "raw.githubusercontent.com"))

---

### Exemplo — Login Interno

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "MinhaSenha123"
}
```

Resposta

```json
{
  "_id": "60d5ec49f8c7d60015f8e1a1",
  "username": "user",
  "email": "user@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🗺️ Endpoints de Locais (`/api`)

|Método|Rota|Descrição|Proteção|
|---|---|---|---|
|GET|`/municipios`|Lista municípios do Maranhão|—|
|GET|`/health-units`|Unidades de saúde por `municipio` e `category`|—|

_Fontes: definição de rotas em_ `src/routes/placesRoutes.js` ([raw.githubusercontent.com](https://raw.githubusercontent.com/Coehlo-Gab-Dev/Desafio-05-Back-End/main/src/routes/placesRoutes.js "raw.githubusercontent.com"))

**Exemplo de requisição**

```http
GET /api/health-units?category=Clínica+General&municipio=São+Luís
```

---

## 🧰 Tecnologias

- **Node.js** + **Express**
    
- **MongoDB** + **Mongoose**
    
- **Passport.js** (OAuth)
    
- **JWT**
    
- **Google Maps Platform**
    
- **Swagger** (Swagger UI + Swagger JSDoc)
    

---

## 🛡️ Segurança

- Hash de senhas (_bcrypt_)
    
- Tokens **JWT** (HS256)
    
- Controle de acesso por papéis
    
- Cookies `httpOnly`/`secure` (produção)
    

---

## 📌 Roadmap

-  Deploy (Render)
    
-  Cache com Redis
    
-  Testes (Jest + Supertest)
    

---

## 🤝 Como Contribuir

1. **Fork** do repositório
    
2. Crie sua branch: `git checkout -b minha-feature`
    
3. Commit: `git commit -m 'feat: minha feature'`
    
4. Push: `git push origin minha-feature`
    
5. Abra um **Pull Request** 😀
    

---
