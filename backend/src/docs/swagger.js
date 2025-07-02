import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Rotas e Locais',
    version: '1.0.0',
    description: 'Documentação da API com autenticação e integração Google Places',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      UserRegister: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'joaosilva',
          },
          email: {
            type: 'string',
            example: 'joao@example.com',
          },
          password: {
            type: 'string',
            example: 'senhaForte123',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'jwt-token-aqui',
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'user123' },
              username: { type: 'string', example: 'joaosilva' },
              email: { type: 'string', example: 'joao@example.com' },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Autenticação',
      description: 'Endpoints relacionados à autenticação de usuários (registro, login, OAuth, senha)',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Caminho das rotas documentadas com JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
