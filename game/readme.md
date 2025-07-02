# 🎮 Saúde em Ação – O Jogo

**Saúde em Ação** é um jogo educativo 2D que combina ação simples (estilo Flappy Bird) com decisões importantes sobre saúde pública. O objetivo é orientar pacientes para a unidade correta de atendimento (UBS, UPA ou Hospital), promovendo o aprendizado prático sobre o SUS de forma leve e divertida.

---

## 🎯 Objetivo Educacional

Ensinar, de forma interativa:

- A diferença entre UBS, UPA e Hospital
- Quais sintomas são urgentes/emergenciais
- O que prejudica ou beneficia a saúde

---

## 🧠 Mecânicas do Jogo

- **Movimento automático lateral** com pulo
- **Encontrar pacientes (NPCs)** com sintomas
- **Escolher a unidade adequada** (UBS, UPA, Hospital)
- **Coletar itens:**
  - **Buffs** (velocidade, redução de tempo)
  - **Debuffs** (lentidão, penalidades)
- **Cronômetro dinâmico:** erros tiram tempo, acertos aumentam

---

## 👩🏻 Protagonista: Clara

- Profissão: Agente Comunitária de Saúde
- Origem: São Luís - MA
- Atua na UBS do bairro
- Missão: orientar corretamente a população e salvar vidas

---

## 👥 NPCs (Casos clínicos)

Exemplos:
- Mulher com febre e dor no corpo → **UBS**
- Homem com dor no peito → **Hospital**
- Criança com tosse e falta de ar → **UPA**
*(Lista completa no GDD)*

---

## 🗺️ Fases e Cenários

- **Mapa 1:** Área Rural ✅
- **Mapa 2:** Centro Urbano 🚧
- **Mapa 3:** (em desenvolvimento)

---

## 🔊 Trilha Sonora

- Música calma no tutorial
- Música dinâmica nos momentos críticos
- Efeitos sonoros: pulo, coleta, acerto/erro

---

## 📺 Telas do Jogo

- Tela de login (nome ou CPF)
- Tela inicial
- Fases/bairros
- Game Over / Conclusão
- Ranking (localStorage e BD)

---

## 💾 Salvamento

- **localStorage:** Pontuação e tempo
- **Back-End:** Integração futura com BD central (via API)

---

## 🚀 Como Rodar Localmente

```bash
# 1. Acesse a pasta do jogo
cd game/

# 2. Instale as dependências (se usar npm/yarn)
npm install

# 3. Rode o projeto
npm run dev
