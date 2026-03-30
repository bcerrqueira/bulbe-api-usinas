// src/data/usinas.js
// Simula um banco de dados em memória.
// ATENÇÃO: os dados são RESETADOS toda vez que o servidor reinicia.
// Nas próximas aulas, substituiremos isso por um banco de dados real.

export let usinas = [
  {
    id: 1,
    nome: "Usina Solar Minas I",
    tipo: "solar",
    capacidade_kw: 5000,
    status: "ativa",
    localizacao: "Sete Lagoas, MG"
  },
  {
    id: 2,
    nome: "Usina Eólica Nordeste II",
    tipo: "eolica",
    capacidade_kw: 12000,
    status: "ativa",
    localizacao: "Caetité, BA"
  },
  {
    id: 3,
    nome: "Usina Solar Goiás I",
    tipo: "solar",
    capacidade_kw: 3200,
    status: "manutencao",
    localizacao: "Catalão, GO"
  }
];

// Controla o próximo ID a ser gerado
let proximoId = 4;

export const getProximoId = () => proximoId++;