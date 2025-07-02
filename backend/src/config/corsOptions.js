const whitelist = [
  'https://buscasusma-6wqy5z7jv-pytwers-projects.vercel.app',
  'https://buscasusma-b711ua4mc-pytwers-projects.vercel.app/', //front-end
  'http://127.0.0.1:5500',              // Para testes locais 
  'http://localhost:5500',              // Para testes locais 
  'http://localhost:3001',              // Para testes locais 
  'http://localhost:3000',              // Para testes locais 
  'https://desafio-05-api.onrender.com' // URL do deploy no Render
];
const corsOptions = {
  origin: function (origin, callback) {
      // Permite requisições sem 'origin' (Postman)
      if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          // Se a origem não estiver na whitelist, retorna um erro CORS.
          callback(new Error('Acesso não permitido pelo CORS'));
      }
  },
  credentials: true, // Permite o envio de cookies e cabeçalhos de autorização
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};
export default corsOptions;
