import React, { useState } from "react";
import "./Cadastro.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../images/icon2.png"
import axios from "axios"; // Importa o Axios


// Define a interface para o componente Cadastro
interface CadastroState {
  email: string;
  nome: string; // Este é o nome que você usa no frontend (será enviado como 'username')
  senha: string;
  confirmSenha: string;
  error: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

interface CadastroProps {
  onClose: () => void;
  onLoginClick: () => void; 
  onLoginSuccess: () => void; // Nova prop para o App.tsx lidar com o sucesso do login/cadastro
}

interface LocationState {
  email?: string;
}

const Cadastro: React.FC<CadastroProps> = ({ onClose, onLoginClick, onLoginSuccess }) => { // Adicionado onLoginSuccess
  const { state: locationState } = useLocation() as { state?: LocationState };

  const [stateCadastro, setStateCadastro] = useState<CadastroState>({
    email: locationState?.email || "",
    nome: "",
    senha: "",
    confirmSenha: "",
    error: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const handleSubmit = async () => {
    setStateCadastro((prev) => ({ ...prev, error: "" }));

    const nomeTrimmed = stateCadastro.nome.trim();
    const emailTrimmed = stateCadastro.email.trim();
    const senhaTrimmed = stateCadastro.senha.trim();
    const confirmSenhaTrimmed = stateCadastro.confirmSenha.trim();

    if (!nomeTrimmed || !emailTrimmed || !senhaTrimmed || !confirmSenhaTrimmed) {
      setStateCadastro((prev) => ({ ...prev, error: "Por favor, preencha todos os campos obrigatórios." }));
      return;
    }

    if (senhaTrimmed !== confirmSenhaTrimmed) {
      setStateCadastro((prev) => ({ ...prev, error: "As senhas não coincidem." }));
      return;
    }

    try {
      const response = await axios.post("https://desafio-05-api.onrender.com/api/auth/register", {
        username: nomeTrimmed,      // MUDANÇA CRÍTICA AQUI: AGORA É 'username'
        email: emailTrimmed,
        password: senhaTrimmed,
      });

      // Se o cadastro foi bem-sucedido (código 201 Created conforme a doc)
      // O backend retorna um token, ID, username e email.
      // Podemos logar o usuário diretamente após o cadastro.
      localStorage.setItem("authToken", response.data.token); // Armazena o token
      localStorage.setItem("isLoggedIn", "true"); // Marca como logado
      localStorage.setItem("userEmail", response.data.email); // Opcional, guardar email/username se precisar
      localStorage.setItem("userName", response.data.username);

      setStateCadastro((prev) => ({ ...prev, error: "Cadastro realizado com sucesso!" }));
      
      // Chamamos onLoginSuccess para fechar o modal e navegar para a página de jogo
      setTimeout(() => {
        onLoginSuccess(); // Esta função no App.tsx já fecha o modal e navega para /jogar
      }, 1000); // Pequeno atraso para o usuário ver a mensagem de sucesso

    } catch (error: unknown) {
      console.error("Erro ao tentar cadastrar:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const axiosResponseData = error.response.data;
          // Mensagem de erro do backend para "dados inválidos ou usuário já existente"
          setStateCadastro((prev) => ({ ...prev, error: axiosResponseData.message || "Erro ao cadastrar. Verifique os dados ou se o e-mail já está em uso." }));
        } else if (error.request) {
          setStateCadastro((prev) => ({ ...prev, error: "Sem resposta do servidor. Verifique sua conexão ou o CORS." }));
          console.error("Erro na requisição Axios (sem resposta):", error.request);
        } else {
          setStateCadastro((prev) => ({ ...prev, error: "Erro ao configurar a requisição. Tente novamente." }));
          console.error("Erro na configuração da requisição Axios:", error.message);
        }
      } else {
        setStateCadastro((prev) => ({ ...prev, error: "Ocorreu um erro inesperado. Tente novamente." }));
        console.error("Erro inesperado:", error);
      }
    }
  };

  return (
    <div className="cadastro-container" onClick={(e) => e.stopPropagation()}>
      <div className="cadastro-box" >
        <button className="back-button" onClick={onClose}>
          &larr;
        </button>
        <img src={logoImage} alt="ConectaSUS Logo" className="cadastro-logo" />
        <form className="formulario-container">
          <h2 className="cadastro-header">Cadastrar</h2>
          <input
            type="text"
            value={stateCadastro.nome}
            onChange={(e) => setStateCadastro((prev) => ({ ...prev, nome: e.target.value }))}
            placeholder="Nome de Usuário" // Mudei o placeholder para refletir 'username'
            className="cadastro-input"
          />
          <input
            type="email"
            value={stateCadastro.email}
            onChange={(e) => setStateCadastro((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="E-mail"
            className="cadastro-input"
          />
          <div className="password-container">
            <input
              type={stateCadastro.showPassword ? "text" : "password"}
              value={stateCadastro.senha}
              onChange={(e) => setStateCadastro((prev) => ({ ...prev, senha: e.target.value }))}
              placeholder="Senha"
              className="cadastro-input"
            />
            <span
              className="toggle-password"
              onClick={() => setStateCadastro((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
            >
              {stateCadastro.showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <div className="password-container">
            <input
              type={stateCadastro.showConfirmPassword ? "text" : "password"}
              value={stateCadastro.confirmSenha}
              onChange={(e) => setStateCadastro((prev) => ({ ...prev, confirmSenha: e.target.value }))}
              placeholder="Confirmar Senha"
              className="cadastro-input"
            />
            <span
              className="toggle-password"
              onClick={() => setStateCadastro((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
            >
              {stateCadastro.showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          {stateCadastro.error && <p className="error">{stateCadastro.error}</p>}
          <button type="button" className="cadastro-button" onClick={handleSubmit}>Cadastrar-se</button>
          <p className="cadastro-link">
            Tem uma conta? <Link to="/login" onClick={(e) => { e.preventDefault(); onClose(); onLoginClick() }}>Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;