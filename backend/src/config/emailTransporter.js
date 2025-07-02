import nodemailer from 'nodemailer';
import 'dotenv/config'; // Garante que as variáveis de ambiente sejam carregadas

// Configuração do Nodemailer com SendGrid

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // Use TLS (false para porta 587, true para porta 465 com SSL)
  auth: {
    user: 'apikey', // O SendGrid usa 'apikey' para o  nome de usuário
    pass: process.env.SENDGRID_API_KEY, // Sua API Key do SendGrid
  },
});

// Verifica a conexão do transportador  para debug
transporter.verify(function (error, success) {
  if (error) {
    console.error("Erro ao verificar a conexão do Nodemailer:", error);
    if (error.response && error.response.body && error.response.body.errors) {
      console.error("Erros do SendGrid na verificação:", error.response.body.errors);
    }
  } else {
    console.log("Servidor de e-mail pronto para enviar mensagens.");
  }
});

export default transporter;
