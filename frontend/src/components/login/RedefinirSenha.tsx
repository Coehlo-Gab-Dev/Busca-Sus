import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import logoImage from "../../images/icon.png";
import axios from "axios"; // Importa o Axios

interface RedefinirSenhaState {
  senha: string;
  confirmSenha: string;
  error: string;
  success: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

interface RedefinirSenhaProps {
  onClose: () => void;
  onLoginClick: () => void;
}

const RedefinirSenha: React.FC<RedefinirSenhaProps> = ({ onClose, onLoginClick }) => {
  const [state, setState] = useState<RedefinirSenhaState>({
    senha: "",
    confirmSenha: "",
    error: "",
    success: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setState((prev) => ({ ...prev, error: "Token de redefinição de senha não encontrado na URL. Por favor, use o link do e-mail." }));
    }
  }, [location.search, navigate]);

  const handleSubmit = async () => {
    setState((prev) => ({ ...prev, error: "", success: "" }));

    if (!state.senha || !state.confirmSenha) {
      setState((prev) => ({ ...prev, error: "Ambos os campos são obrigatórios." }));
      return;
    }
    if (state.senha !== state.confirmSenha) {
      setState((prev) => ({ ...prev, error: "As senhas não coincidem." }));
      return;
    }
    if (!token) {
      setState((prev) => ({ ...prev, error: "Token de redefinição inválido ou ausente." }));
      return;
    }

    try {
      // Linhas de depuração (manter para ver o payload)
      const requestBody = {
        token: token,
        newPassword: state.senha, // <-- MUDANÇA AQUI: Corrigido de 'password' para 'newPassword'
      };
      console.log("Token a ser enviado:", token);
      console.log("Senha a ser enviada:", state.senha);
      console.log("Objeto de requisição:", requestBody);

      const response = await axios.post("https://desafio-05-api.onrender.com/api/auth/reset-password", requestBody);

      setState((prev) => ({ ...prev, success: response.data.message || "Senha redefinida com sucesso!" }));
      setTimeout(() => {
        onClose();
        onLoginClick();
      }, 2000);

    } catch (error: unknown) {
      console.error("Erro ao redefinir senha:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const axiosResponseData = error.response.data;
          setState((prev) => ({ ...prev, error: axiosResponseData.message || "Erro ao redefinir a senha." }));
        } else if (error.request) {
          setState((prev) => ({ ...prev, error: "Sem resposta do servidor. Verifique sua conexão ou o CORS." }));
          console.error("Erro na requisição Axios (sem resposta):", error.request);
        } else {
          setState((prev) => ({ ...prev, error: "Erro ao configurar a requisição. Tente novamente." }));
          console.error("Erro na configuração da requisição Axios:", error.message);
        }
      } else {
        setState((prev) => ({ ...prev, error: "Ocorreu um erro inesperado. Tente novamente." }));
        console.error("Erro inesperado:", error);
      }
    }
  };

  return (
    <div className="login-container" onClick={(e) => e.stopPropagation()}>
      <div className="login-box">
        <button className="back-button" onClick={onClose}>
          ←
        </button>
        <div className="login-header-container">
          <img src={logoImage} alt="ConectaSUS Logo" className="login-logo" />
        </div>
        <form className="form-container">
          <h2 className="login-header">Redefinir Senha</h2>
          {state.error && <p className="error">{state.error}</p>}
          {state.success && <p style={{ color: "green" }}>{state.success}</p>}

          <div className="password-container">
            <input
              type={state.showPassword ? "text" : "password"}
              value={state.senha}
              onChange={(e) => setState((prev) => ({ ...prev, senha: e.target.value }))}
              className="login-input"
              placeholder="Nova Senha"
            />
            <span
              className="toggle-password"
              onClick={() => setState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
            >
              {state.showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <div className="password-container">
            <input
              type={state.showConfirmPassword ? "text" : "password"}
              value={state.confirmSenha}
              onChange={(e) => setState((prev) => ({ ...prev, confirmSenha: e.target.value }))}
              className="login-input"
              placeholder="Confirmar Nova Senha"
            />
            <span
              className="toggle-password"
              onClick={() => setState((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
            >
              {state.showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <button type="button" className="login-button" onClick={handleSubmit}>
            Salvar Nova Senha
          </button>
          <p className="login-link">
            <button type="button" className="login-link-bold" onClick={onLoginClick}>Voltar ao Login</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RedefinirSenha;