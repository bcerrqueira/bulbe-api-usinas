// src/app.js

import express from 'express';
import usinasRouter from './routes/usinas.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Rotas ────────────────────────────────────────────────────────────────────
app.use('/api/v1/usinas', usinasRouter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensagem: '🌱 Bulbe Energia API está no ar!', versao: '1.0.0' });
});

// ── Middleware de erro global ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.message);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Bulbe API rodando em http://localhost:${PORT}`);
});