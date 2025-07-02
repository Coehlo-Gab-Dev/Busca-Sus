```markdown
# 🧩 Saúde em Ação — Projeto Fullstack

> 🎓 Este projeto foi desenvolvido como parte do **Desafio 5 do Trilhas 2B**, com foco em aplicar conceitos de desenvolvimento web moderno, autenticação, integração com APIs e experiência do usuário.


Plataforma educativa composta por três frentes integradas:

📌 Uma **API robusta** com autenticação e integração com o Google Maps  
🖥️ Uma **landing page moderna e responsiva** em React  
🎮 Um **jogo 2D interativo** que ensina sobre o SUS de forma lúdica

----

## 🧱 Estrutura do Projeto



saude-em-acao/
├── back-end/       # API Node.js + Express + MongoDB
├── front-end/      # Landing page React + Vite + Tailwind
└── game/           # Jogo educativo 2D (Flappy-style)

````

---

## 🧠 Visão Geral das Funcionalidades

| Módulo     | Tecnologias                        | Funcionalidade principal |
|------------|------------------------------------|---------------------------|
| API        | Node.js, MongoDB, OAuth, JWT       | Rotas e locais + Auth     |
| Front-end  | React, TypeScript, Tailwind, Axios | Página informativa + consumo da API |
| Game       | Phaser ou semelhante               | Educação sobre o SUS com jogabilidade leve |

---

# 🔧 Back-End — API de Locais e Autenticação

### 📦 Tecnologias

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** + **Passport (Google, GitHub)**
- **Google Maps Platform** (Places, Directions)
- **Swagger** para documentação

### 🔐 Autenticação

- Registro e login via e-mail + senha
- Login social (Google e GitHub OAuth)
- Autorização por papéis (`user`, `admin`)
- Recuperação e redefinição de senha
- JWT + sessões seguras com cookies

### 📍 Endpoints de Locais

- Listagem de municípios do eixo Grande Ilha 
- Unidades de saúde por município e categoria
- Fallback local utilizando o Mongo em caso de falha da API

### ▶️ Execução

```bash
git clone https://github.com/Coehlo-Gab-Dev/Desafio-05-Back-End.git
cd Desafio-05-Back-End
npm install
npm run dev
````

Documentação Swagger:
🔗 [https://desafio-05-api.onrender.com/api-docs](https://desafio-05-api.onrender.com/api-docs)

---

# 🎨 Front-End — Landing Page

### 🌐 Tecnologias

* **React** + **TypeScript**
* **Tailwind CSS** para design moderno
* **React Router DOM** para navegação SPA
* **Axios** para consumo da API
* **Vite** para build rápido

### 🧩 Funcionalidades

* Página informativa com design responsivo
* Componentes reutilizáveis
* Integração com a API (municipios, unidades)
* Tema centralizado (cores, fontes)

### ▶️ Como Rodar

```bash
git clone https://github.com/Desafio-5-Front/Front/tree/main
cd Front
npm install
npm run dev
```

🔗 Deploy: [Acesse aqui](https://buscasusma-7pgtj8a5d-pytwers-projects.vercel.app)

---

# 🎮 Game — Saúde em Ação

Jogo educativo inspirado em Flappy Bird, com foco em decisões clínicas e locais de atendimento.

### 🎯 Objetivos

* Ensinar o papel da **UBS**, **UPA** e **Hospital**
* Identificar sintomas e associar à unidade correta
* Reforçar o aprendizado de forma prática e divertida

### 🕹️ Mecânicas

* Pulo lateral automático
* Diálogo com NPCs que apresentam sintomas
* Escolha entre UBS, UPA ou Hospital
* Itens bônus e penalidades
* Cronômetro que reage a erros/acertosS

### 👤 Protagonista

**Clara**, agente comunitária de saúde de São Luís, orienta pacientes por diferentes bairros.

### 📍 Fases

* 🌾 Mapa 1: Área Rural ✅
* 🏙️ Mapa 2: Centro Urbano 🚧
* 🌆 Mapa 3: Em desenvolvimento

### ▶️ Como Executar

```bash
cd game/
npm install
npm run dev
```
🔗 Deploy: [Acesse aqui](https://saude-em-acao-ten.vercel.app/)

---

# 🛡️ Segurança

* Criptografia de senhas com bcrypt
* Tokens JWT (`HS256`)
* Sessões seguras com cookies `httpOnly`
* Controle de acesso baseado em papéis

---

# 🚧 Roadmap 
### Melhorias Futuras 

* [ x ] Deploy no Render/Vercel
* [   ] Integração de backend com o jogo
* [   ] Cache com Redis
* [   ] Testes automatizados (Jest, Supertest)
* [   ] Painel administrativo

---

# 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit: `git commit -m 'feat: minha feature'`
4. Push: `git push origin minha-feature`
5. Abra um **Pull Request**

---

# 👥 Autores 

### Back-End

* **Gabriel Coelho**
🔗 [GitHub](https://github.com/Coehlo-Gab-Dev) | 🌐 [LinkedIn](www.linkedin.com/in/gabriel-coelho-7184a32a3)

* **Hélvila Freitas**
| 🌐 [LinkedIn](https://www.linkedin.com/in/h%C3%A9vila-freitas-36344b203)

* **Rejane Aguilar**
🔗 [GitHub](https://github.com/rejaneaguiar) | 🌐 [LinkedIn](https://www.linkedin.com/in/rejane-aguiar-60447b304?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)

* **Marcio Danilo**
🌐 [LinkedIn](https://www.linkedin.com/in/m%C3%A1rcio-d-563659280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)





### Front-End

* **Pytwer Carvalho**
  🔗 [GitHub](https://github.com/Pytwer) | 🌐 [LinkedIn](https://www.linkedin.com/in/pytwerdev/)

* **Eduarda Serejo**
  🔗 [GitHub](https://github.com/EduPank) | 🌐 [LinkedIn](https://www.linkedin.com/in/eduarda-serejo-79989b2ab?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)

* **Yasmim Cosme**
  🔗 [GitHub](https://github.com/yasmimcosm) | 🌐 [LinkedIn](http://www.linkedin.com/in/yasmimcosme)

* **César Henrique**
  🔗 [GitHub](https://github.com/cesardeneves) | 🌐 [LinkedIn](https://www.linkedin.com/in/c%C3%A9sar-henrique-undefined-041840372?trk=contact-info)

* **Antonio Sergio**
  🔗 [GitHub](https://github.com/AntonioSergioNSJr) | 🌐 [LinkedIn](https://br.linkedin.com/in/antonio-sergio-n-de-sousa-junior-707332210)

### Game

* **Pedro Monteiro**
  🔗 [GitHub](http://github.com/o-addock) | 🌐 [LinkedIn](http://linkedin.com/in/pedro-asafe-monteiro)

* **Yasmim Neves**
  🔗 [GitHub](https://github.com/yas-neves) | 🌐 [LinkedIn](https://www.linkedin.com/in/yasmin-neves-780320358?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)

* **Bianca Malena**
  🔗 [GitHub](https://github.com/biancamalena) | 🌐 [LinkedIn](https://www.linkedin.com/in/bianca-malena-cordeiro-836958307/)


### UX Design

* **Madu Azevedo**
  🌐 [LinkedIn](https://www.linkedin.com/in/madu-azevedo-210058163/)

* **Gabriela Sousa**
  🌐 [LinkedIn](http://www.linkedin.com/in/gabriella-sousa-8bb8a2349)


## Protótipo no Figma
* **Confira o layout do projeto no Figma:**
 🎨 [Figma](https://www.figma.com/proto/ihJtM1XgiZhPPo24ZDGgBy/Landing-Page---ConecteSUS?node-id=599-3293&p=f&t=ZKXr8E9OvfiToYxS-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1)

