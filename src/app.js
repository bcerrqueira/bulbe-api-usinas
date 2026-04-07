import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import usinasRouter from './routes/usinas.js';

// ── Resolução de caminho em ESM
// Em ESM não existe __dirname. Reconstruímos a partir de import.meta.url
// para montar o caminho absoluto até os arquivos de rota.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Configuração do swagger-jsdoc
// "definition" contém os metadados da API (equivalente ao bloco "info" do YAML).
// "apis" indica quais arquivos o swagger-jsdoc deve varrer por comentários @openapi.
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Bulbe Energia API',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de usinas de energia renovável do sistema ' +
        'Bulbe Energia. Permite listar, consultar e cadastrar usinas solares, ' +
        'eólicas, hidrelétricas e de biomassa.',
      contact: {
        name: 'Equipe Bulbe Energia',
        email: 'dev@bulbeenergia.com.br',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desenvolvimento local',
      },
    ],
  },

  // O swagger-jsdoc vai ler todos os arquivos .js dentro de src/routes/
  // em busca de comentários /** @openapi ... */
  apis: [join(__dirname, 'routes', '*.js')],
};

// swaggerJsdoc() lê os arquivos indicados, encontra os blocos @openapi
// e monta o documento OpenAPI completo como um objeto JavaScript.
const swaggerDocument = swaggerJsdoc(swaggerOptions);

const app = express();
const PORT = 3000;

// ── CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Middlewares globais
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Documentação -- Swagger UI
// Registrar ANTES das rotas de negócio.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota que serve o documento OpenAPI bruto em JSON.
// Útil para ferramentas como Postman que importam a spec por URL.
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerDocument);
});

// ── Rotas de negócio
app.use('/api/v1/usinas', usinasRouter);

// ── Health check
app.get('/', (req, res) => {
  res.json({
    mensagem: '🌱 Bulbe Energia API está no ar!',
    versao: '1.0.0',
    documentacao: `http://localhost:${PORT}/api-docs`,
  });
});

// ── Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.message);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// ── Inicialização
app.listen(PORT, () => {
  console.log(`🚀 Bulbe API rodando em http://localhost:${PORT}`);
  console.log(`📄 Documentação em http://localhost:${PORT}/api-docs`);
});