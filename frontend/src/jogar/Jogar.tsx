import React from "react";
import "../App.css"; // Importa o arquivo CSS global

const Jogar: React.FC = () => {
  console.log("Renderizando página Jogar");
  return (
    <div style={{
      padding: "0", // Ajuste o padding para 0 para o iframe ocupar o espaço
      margin: "0",  // Remova margens
      textAlign: "center",
      width: "100vw", // 100% da largura da viewport
      height: "100vh", // 100% da altura da viewport
      boxSizing: "border-box", // Garante que padding não adicione largura/altura extra
      backgroundColor: "#D3FCEA",
      display: "flex", // Para centralizar o iframe se for menor
      flexDirection: "column", // Para centralizar verticalmente
      justifyContent: "center", // Centraliza verticalmente
      alignItems: "center", // Centraliza horizontalmente
    }}>
      {/* <-- MUDANÇA AQUI: Adiciona o iframe para o jogo */}
      <iframe
        src="https://saude-em-acao-pre-alpha.vercel.app/"
        title="Saúde em Ação - O Jogo" // Título para acessibilidade
        style={{
          width: "100%",        // Ocupa 100% da largura do contêiner pai
          height: "100%",       // Ocupa 100% da altura do contêiner pai
          border: "none",       // Remove a borda padrão do iframe
          display: "block",     // Remove espaço extra abaixo do iframe
          backgroundColor: "#D3FCEA" // Cor de fundo do iframe, caso haja carregamento
        }}
        allowFullScreen // Permite modo tela cheia
        // sandbox="allow-scripts allow-same-origin" // Opcional, para mais controle de segurança
      ></iframe>
      {/* <-- FIM DA MUDANÇA AQUI */}
    </div>
  );
};

export default Jogar;