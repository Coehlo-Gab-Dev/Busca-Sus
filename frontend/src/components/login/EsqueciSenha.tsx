import React, { useState } from "react";
import "./Login.css";
import logoImage from "../../images/icon2.png";
import axios from "axios";

interface EsqueciSenhaState {
  email: string;
  error: string;
  message: string;
}

interface EsqueciSenhaProps {
  onClose: () => void;
  onLoginClick: () => void;
  onRedefinirSenhaClick: () => void;
}

const EsqueciSenha: React.FC<EsqueciSenhaProps> = ({ onClose, onLoginClick, onRedefinirSenhaClick }) => {
  const [state, setState] = useState<EsqueciSenhaState>({
    email: "",
    error: "",
    message: "",
  });

  // CORREÇÃO: Renomeando a função para handleSubmit (que é referenciada no JSX)
  const handleSubmit = async () => {
    setState((prev) => ({ ...prev, error: "", message: "" }));

    if (!state.email) {
      setState((prev) => ({ ...prev, error: "Por favor, insira seu e-mail." }));
      return;
    }

    try {
      const response = await axios.post("https://desafio-05-api.onrender.com/api/auth/forgot-password", {
        email: state.email,
      });

      setState((prev) => ({ ...prev, message: response.data.message || "Um e-mail de recuperação foi enviado, verifique sua caixa de entrada." }));
      
      setTimeout(() => {
        onClose();
        onLoginClick();
      }, 3000);

    } catch (error: unknown) {
      console.error("Erro ao enviar solicitação de recuperação de senha:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const axiosResponseData = error.response.data;
          setState((prev) => ({ ...prev, error: axiosResponseData.message || "Erro ao enviar e-mail de recuperação." }));
        } else if (error.request) {
          setState((prev) => ({ ...prev, error: "Sem resposta do servidor. Verifique sua conexão ou o CORS." }));
        } else {
          setState((prev) => ({ ...prev, error: "Erro ao configurar a requisição. Tente novamente." }));
        }
      } else {
        setState((prev) => ({ ...prev, error: "Ocorreu um erro inesperado. Tente novamente." }));
      }
    }
  };

  return (
    <div className="login-container" onClick={(e) => e.stopPropagation()}>
      <div className="login-modal">
        <button
          className="esqueci-senha-close-button"
          onClick={onClose}
        >
          &larr;
        </button>

        <div className="login-logo-container">
          <img
            src={logoImage}
            alt="ConectaSUS Logo"
            className="login-logo"
          />
        </div>

        <form className="login-form">
          <h2 className="esqueci-senha-title">Esqueceu a Senha?</h2>

          <input
            type="email"
            value={state.email}
            onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
            className="login-input"
            placeholder="E-mail"
          />

          {state.error && <p className="error-message">{state.error}</p>}
          {state.message && <p className="success-message">{state.message}</p>}

          <button
            type="button"
            className="login-button"
            onClick={handleSubmit}
          >
            Enviar
          </button>

          <p className="register-text">
            Lembrou a senha?
            <button
              type="button"
              className="register-link"
              onClick={onLoginClick}
            >
              Voltar ao Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default EsqueciSenha;