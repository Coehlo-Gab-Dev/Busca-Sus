import React from "react";
import { useEffect } from "react"
import "./App.css";
import homeImage from "./images/home.png";
import iconImage from "./images/icon2.png";
import { Route, Routes, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/login/Login";
import Cadastro from "./components/cadastro/Cadastro";
import EsqueciSenha from "./components/login/EsqueciSenha";
import RedefinirSenha from "./components/login/RedefinirSenha";
import HealthUnitsSearch from "./components/HealthUnitsSearch/HealthUnitsSearch";

import Jogar from "./jogar/Jogar"
import axios from "axios";

interface BaseProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<BaseProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  console.log("ProtectedRoute - isLoggedIn:", isLoggedIn);
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

const App: React.FC = () => {
  const router = useNavigate();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConsulta, setShowConsulta] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const [showCadastro, setShowCadastro] = React.useState(false);
  const [showEsqueciSenha, setShowEsqueciSenha] = React.useState(false);
  const [showRedefinirSenha, setShowRedefinirSenha] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => {
  setMenuOpen(prev => !prev);
};

  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    if (showConsulta) {
      const scrollY = window.scrollY; document.body.style.position = 'fixed'; document.body.style.top = `-${scrollY}px`; document.body.style.width = '100%';
      return () => { const scrollY = document.body.style.top; document.body.style.position = ''; document.body.style.top = ''; window.scrollTo(0, parseInt(scrollY || '0') * -1); };
    }
  }, [showConsulta]);

  useEffect(() => {
    console.log("Rota atual:", location.pathname)
    setIsUserLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    if (location.pathname === "/login" && !showLogin) {
      setShowLogin(true);
    }
    if (location.pathname !== "/login" && showLogin) {
      setShowLogin(false);
    }
    if (location.pathname === "/redefinir-senha" && !showRedefinirSenha) {
      setShowRedefinirSenha(true);
    }
    if (location.pathname !== "/redefinir-senha" && showRedefinirSenha) {
      setShowRedefinirSenha(false);
    }

    if (location.pathname === "/oauth-success") {
      const params = new URLSearchParams(location.search);
      const token = params.get("token"); // Extrai o token da URL

      if (token) {
        localStorage.setItem("authToken", token); // Armazena o token
        localStorage.setItem("isLoggedIn", "true"); // Marca como logado
        setIsUserLoggedIn(true); // Atualiza o estado
        console.log("Token OAuth recebido e usuário logado. Redirecionando para /jogar.");
        navigate("/jogar", { replace: true }); // Redireciona para a página de jogo
      } else {
        console.error("Token não encontrado na URL de sucesso OAuth.");
        // Opcional: Redirecionar para home ou login com erro se o token não for encontrado
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, showLogin, showRedefinirSenha, navigate]);

  const handleLoginClick = () => {
    setShowLogin(true);
    navigate("/login");
  };

  const handleJogarClick = () => {
    if (!isUserLoggedIn) { // Usa o novo estado para verificar
      setShowLogin(true);
      navigate("/login");
    } else {
      navigate("/jogar");
    }
  };

  const handleCadastroClick = () => {
    setShowLogin(false);
    setShowCadastro(true);
  };

  const handleEsqueciSenhaClick = () => {
    setShowLogin(false);
    setShowEsqueciSenha(true);
  };

  const handleRedefinirSenhaClick = () => {
    setShowEsqueciSenha(false);
    setShowRedefinirSenha(true);
    navigate("/redefinir-senha");
  };

  const handleGoToLogin = () => {
    setShowCadastro(false);
    setShowEsqueciSenha(false);
    setShowRedefinirSenha(false);
    setShowLogin(true);
    navigate("/login");
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setIsUserLoggedIn(true);
    navigate("/jogar", { replace: true });
  };

  // Novo:  Esta função agora lida com a navegação E rolagem.
  const scrollToSection = (id: string) => {
    // Sempre navega para a Home primeiro (/) para garantir que o conteúdo da Home esteja visível
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    setMenuOpen(false);
  }

  // NOVO: Função para lidar com o Logout
  const handleLogout = async () => {
    try {
      // Opcional: Avisar o backend que o usuário está fazendo logout
      // Isso é bom para invalidar sessões ou tokens no lado do servidor.
      await axios.get("https://desafio-05-api.onrender.com/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}` // Envia o token se existir
        }
      });
      console.log("Logout realizado com sucesso no backend.");
    } catch (error) {
      console.error("Erro ao realizar logout no backend (pode ser CORS, token expirado, etc.):", error);
      // Mesmo com erro no backend, o frontend deve limpar os dados
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isLoggedIn");
      setIsUserLoggedIn(false); // MUDANÇA: Atualiza o estado de login
      navigate("/"); // Redireciona para a página inicial após o logout
      alert("Você foi desconectado."); // Feedback visual para o usuário
    }
  };

  const isHomePage = location.pathname === "/";
  // NOVO: Verifica se NÃO estamos na homepage, para renderizar apenas o conteúdo da rota
  const isNotHomePage = location.pathname !== "/";





  return (
    <div className="app" style={{ zIndex: 1000 }}>
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src={iconImage} alt="BuscaSUS Logo" />
          </div>
           <button className="menu-toggle" onClick={toggleMenu}>
                        ☰
                    </button>
          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            {/* Mudança: Botões para navegação e rolagem*/}
            <button className="nav-link" onClick={() => scrollToSection('hero-section')}>Home</button>
            <button className="nav-link" onClick={() => scrollToSection('about-section')}>Sobre</button>
            {!isUserLoggedIn ? (
              <button className="nav-link" onClick={handleLoginClick}>Login</button>
            ) : (
              <button className="nav-link" onClick={handleLogout}>Logout</button>
            )}
            <button className="nav-link" onClick={() => scrollToSection('contact-footer')}>Contato</button>
          </nav>
        </div>
      </header>
      {isHomePage ?
        (<>
          <section id="hero-section" className="hero" style={{ height: "700px" }}>
            <div className="hero-background" style={{ backgroundImage: `url(${homeImage})` }}></div>
            <div className="container">
              <div className="hero-content">
                <div className="hero-left">
                  <h1 className="hero-title">BuscaSUS</h1>
                  <h2 className="hero-subtitle">Acesse informações relevantes de saúde</h2>
                  <p className="hero-description">
                    O BuscaSUS é um portal digital que facilita o acesso aos serviços do SUS. Consulte vacinação, exames,
                    atendimentos e encontre unidades de saúde de forma simples, rápida e integrada.
                  </p>
                  <div className="hero-buttons">
                    <button className="btn" style={{ marginTop: "-300px" }} onClick={() => setShowConsulta(true)}>
                      Consultar unidades →
                    </button>
                    <button className="btn" style={{ marginTop: "20px" }} onClick={handleJogarClick}>
                      Jogar agora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="about-section" className="about">
            <div className="container">
              <h2 className="about-title">Sobre o projeto</h2>
              <p className="about-description">
                O BuscaSUS é a sua porta de entrada para uma saúde pública mais acessível e transparente. Descubra nossos
                serviços e experimente uma nova forma de gerenciar seu cuidado com agilidade e confiança.
              </p>
              <div className="about-box">
                <p className="about-box-text">
                  Cada detalhe foi pensado para você. Aqui, a tecnologia anda de mãos dadas com o cuidado:
                  facilitamos o acesso à informação, aos serviços de saúde e ao seu histórico, porque acreditamos que estar
                  bem informado é o primeiro passo para ser bem cuidado.
                </p>
              </div>
            </div>
          </section>
          <section className="features">
            <div className="container">
              <h1 className="features-main-title">Conheças as funcionalidades</h1>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-image-container">
                    <img src={require("./images/lupa.png")} alt="Ícone de lupa - Dados de saúde" className="feature-image" />
                  </div>
                  <div className="feature-content">
                    <h2 className="feature-title">Conheça dados importantes de saúde</h2>
                    <p className="feature-description">
                      Acesse seu prontuário, resultados de exames e vacinas registradas em um só lugar.
                    </p>
                    <button className="feature-button">
                      <Link to="/dados-saude" style={{ textDecoration: "none", color: "white" }}>Clique aqui →</Link>
                    </button>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-image-container">
                    <img src={require("./images/medic.png")} alt="Ícone de localização" className="feature-image" />
                  </div>
                  <div className="feature-content">
                    <h2 className="feature-title">Veja a unidade mais próxima</h2>
                    <p className="feature-description">
                      Encontre facilmente postos, clínicas e hospitais do SUS pelo mapa interativo.
                    </p>
                    <button className="feature-button">
                      <Link to="/unidades-proximas" style={{ textDecoration: "none", color: "white" }}>Clique aqui →</Link>
                    </button>
                  </div>
                </div>
                <div className="feature-card">
                  <div className="feature-image-container">
                    <img src={require("./images/paper.png")} alt="Ícone de jogo" className="feature-image" />
                  </div>
                  <div className="feature-content">
                    <h2 className="feature-title">Aprenda enquanto joga</h2>
                    <p className="feature-description">
                      Conheça nosso jogo sobre saúde e transforme conhecimento em prática de forma divertida.
                    </p>
                    <button className="feature-button">
                      <Link to="/jogar" style={{ textDecoration: "none", color: "white" }} onClick={handleJogarClick}>Clique aqui →</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
        </>) : (

          <div className="modal-wrapper">
            <Routes>
              <Route path="/" element={<></>} />
              <Route path="/esqueci-senha" element={<h1>Recuperação de Senha</h1>} />
              <Route path="/jogar" element={<ProtectedRoute><Jogar /></ProtectedRoute>} />
              <Route path="/dados-saude" element={<h1>Dados de Saúde</h1>} />
              <Route path="/unidades-proximas" element={<h1>Unidades Próximas</h1>} />
              <Route path="/redefinir-senha" element={<></>} />
              <Route path="/oauth-success" element={<></>} />
            </Routes>
          </div>
        )}

      <section className="footer-section" >
        <footer id="contact-footer" className="footer">
          <div className="footer-logos">
            <img src={require("./images/inova.png")} alt="Logo INOVA" className="footer-logo" />
            <img src={require("./images/icon2.png")} alt="Logo Governo" className="footer-logo" />
            <img src={require("./images/secti.png")} alt="Logo SECTI" className="footer-logo" />
          </div>
          <div className="footer-contact">Contato: buscasusgp2@gmail.com</div>
        </footer>
      </section>

      {showLogin && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowLogin(false);
            if (location.pathname === "/login") {
              navigate("/");
            }
          }
        }}>
          <Login onClose={() => {
            setShowLogin(false);
            if (location.pathname === "/login") {
              navigate("/");
            }
          }} onCadastroClick={handleCadastroClick} onEsqueciSenhaClick={handleEsqueciSenhaClick} onLoginSuccess={handleLoginSuccess} />
        </div>)}
      {showCadastro && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowCadastro(false); }}>
          <Cadastro
            onClose={() => setShowCadastro(false)}
            onLoginClick={handleGoToLogin} // Mantido se ainda houver o "Tem uma conta? Entrar"
            onLoginSuccess={handleLoginSuccess} // NOVO: Para o caso de cadastro bem-sucedido
          />
        </div>
      )}
      {showEsqueciSenha && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowEsqueciSenha(false); }}>
          <EsqueciSenha onClose={() => setShowEsqueciSenha(false)} onLoginClick={handleGoToLogin} onRedefinirSenhaClick={handleRedefinirSenhaClick} />
        </div>
      )}
      {showRedefinirSenha && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowRedefinirSenha(false);
            // Ao fechar o modal, se a rota for /redefinir-senha, navega para a home
            if (location.pathname === "/redefinir-senha") {
              navigate("/");
            }
          }
        }}>
          <RedefinirSenha
            onClose={() => {
              setShowRedefinirSenha(false);
              if (location.pathname === "/redefinir-senha") {
                navigate("/");
              }
            }}
            onLoginClick={handleGoToLogin} />
        </div>
      )}
      {showConsulta && (
        <div className="modal-overlay" onClick={() => setShowConsulta(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxHeight: '100vh', overflowY: 'auto' }}>
            <HealthUnitsSearch onClose={() => setShowConsulta(false)} />
          </div>
        </div>
      )}
    </div>);
};
export default App;