// src/routes/usinas.js
/**
 * @openapi
 * components:
 *   schemas:
 *     Usina:
 *       type: object
 *       description: >
 *         Representação completa de uma usina de energia renovável.
 *       required:
 *         - id
 *         - nome
 *         - tipo
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único gerado pelo servidor.
 *           example: 1
 *         nome:
 *           type: string
 *           description: Nome da usina.
 *           minLength: 3
 *           maxLength: 100
 *           example: Usina Solar Minas I
 *         tipo:
 *           type: string
 *           description: Fonte de energia da usina.
 *           enum: [solar, eolica, hidreletrica, biomassa]
 *           example: solar
 *         capacidade_kw:
 *           type: number
 *           nullable: true
 *           description: Capacidade instalada em quilowatts.
 *           example: 5000
 *         status:
 *           type: string
 *           enum: [ativa, manutencao, inativa]
 *           example: ativa
 *         localizacao:
 *           type: string
 *           nullable: true
 *           description: Cidade e estado onde a usina está instalada.
 *           example: Sete Lagoas, MG
 *
 *     UsinaInput:
 *       type: object
 *       description: Dados necessários para cadastrar uma nova usina.
 *       required:
 *         - nome
 *         - tipo
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           example: Usina Solar Minas I
 *         tipo:
 *           type: string
 *           enum: [solar, eolica, hidreletrica, biomassa]
 *           example: solar
 *         capacidade_kw:
 *           type: number
 *           example: 5000
 *         localizacao:
 *           type: string
 *           example: Sete Lagoas, MG
 *
 *     Erro:
 *       type: object
 *       required:
 *         - erro
 *       properties:
 *         erro:
 *           type: string
 *           example: Os campos "nome" e "tipo" são obrigatórios.
 */

import { Router } from 'express';
import {
  listarUsinas,
  buscarUsinaPorId,
  criarUsina
} from '../controllers/usinasController.js';

const router = Router();

/**
 * @openapi
 * /usinas:
 *   get:
 *     summary: Listar todas as usinas
 *     description: >
 *       Retorna a lista completa de usinas cadastradas no sistema.
 *     operationId: listarUsinas
 *     tags:
 *       - Usinas
 *     responses:
 *       "200":
 *         description: Lista de usinas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Usina"
 */
router.get('/', listarUsinas);

/**
 * @openapi
 * /usinas/{id}:
 *   get:
 *     summary: Buscar usina por ID
 *     operationId: buscarUsinaPorId
 *     tags:
 *       - Usinas
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: Usina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Usina"
 *       "404":
 *         description: Usina não encontrada
 */
router.get('/:id', buscarUsinaPorId);

/**
 * @openapi
 * /usinas:
 *   post:
 *     summary: Cadastrar nova usina
 *     operationId: criarUsina
 *     tags:
 *       - Usinas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UsinaInput"
 *           examples:
 *             solar:
 *               summary: Usina solar completa
 *               value:
 *                 nome: Usina Solar Goiás I
 *                 tipo: solar
 *                 capacidade_kw: 3200
 *                 localizacao: Catalão, GO
 *             minimo:
 *               summary: Apenas campos obrigatórios
 *               value:
 *                 nome: Usina Piloto
 *                 tipo: biomassa
 *     responses:
 *       "201":
 *         description: Usina criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Usina"
 *       "400":
 *         description: Dados inválidos
 */
router.post('/', criarUsina);

export default router;