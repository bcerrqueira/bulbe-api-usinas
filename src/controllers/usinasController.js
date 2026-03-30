// src/controllers/usinasController.js

import { usinas, getProximoId } from '../data/usinas.js';

// ── Listar todas as usinas ────────────────────────────────────────────────────
// Corresponde à US-API-01
export const listarUsinas = (req, res) => {
  // Retorna a lista completa de usinas.
  // Mesmo que esteja vazia, retorna 200 com array vazio — não um erro.
  // Critério de aceite: "Se não houver usinas, retornar lista vazia []"
  res.status(200).json(usinas);
};
// ── Buscar uma usina por ID ───────────────────────────────────────────────────
// Corresponde à US-API-02
export const buscarUsinaPorId = (req, res) => {
  // req.params.id vem como STRING — precisamos converter para número
  const id = parseInt(req.params.id, 10);

  // Valida se o id fornecido é realmente um número
  if (isNaN(id)) {
    return res.status(400).json({ erro: 'O parâmetro id deve ser um número inteiro.' });
  }

  // Procura a usina no array pelo id
  const usina = usinas.find((u) => u.id === id);

  // Se não encontrou, retorna 404
  if (!usina) {
    return res.status(404).json({
      erro: `Usina com id ${id} não encontrada.`
    });
  }

  // Se encontrou, retorna 200 com os dados
  res.status(200).json(usina);
};
// ── Criar uma nova usina ──────────────────────────────────────────────────────
// Corresponde à US-API-03
export const criarUsina = (req, res) => {
  // Extrai os dados do corpo da requisição
  const { nome, tipo, capacidade_kw, localizacao } = req.body;

  // ── Validação: campos obrigatórios ──────────────────────────────────────────
  // Critério de aceite: "Campos obrigatórios: nome e tipo"
  if (!nome || !tipo) {
    return res.status(400).json({
      erro: 'Os campos "nome" e "tipo" são obrigatórios.'
    });
  }

  // ── Validação: tipo deve ser um valor permitido ────────────────────────────
  const tiposPermitidos = ['solar', 'eolica', 'hidreletrica', 'biomassa'];
  if (!tiposPermitidos.includes(tipo)) {
    return res.status(400).json({
      erro: `Tipo inválido. Valores aceitos: ${tiposPermitidos.join(', ')}`
    });
  }

  // ── Criação do objeto da nova usina ───────────────────────────────────────
  const novaUsina = {
    id: getProximoId(),              // ID gerado pelo servidor (simulação)
    nome,
    tipo,
    capacidade_kw: capacidade_kw ?? null,  // Opcional — null se não fornecido
    status: 'ativa',                 // Status padrão para novas usinas
    localizacao: localizacao ?? null
  };

  // Adiciona ao "banco de dados" em memória
  usinas.push(novaUsina);

  // ── Resposta 201 Created com o recurso criado ─────────────────────────────
  // RFC 9110: 201 Created indica que a requisição resultou na criação de um recurso
  res.status(201).json(novaUsina);
};