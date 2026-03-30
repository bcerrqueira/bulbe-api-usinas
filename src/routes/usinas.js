// src/routes/usinas.js

import { Router } from 'express';
import { listarUsinas, buscarUsinaPorId, criarUsina } from '../controllers/usinasController.js';

const router = Router();

// GET /api/v1/usinas → lista todas
router.get('/', listarUsinas);

// GET /api/v1/usinas/:id → busca uma
router.get('/:id', buscarUsinaPorId);

// POST /api/v1/usinas → cria nova
router.post('/', criarUsina);

export default router;