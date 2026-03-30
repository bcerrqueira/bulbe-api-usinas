# 📋 Guia Prático — Aula 08: De User Stories a Endpoints REST com Node.js e Express

## 🎯 Objetivo

Transformar histórias de usuário de API em endpoints funcionais utilizando **Node.js** e **Express**, seguindo a arquitetura **MVC** e as boas práticas REST já estudadas. Ao final desta aula, você terá implementado três endpoints completos para o sistema **Bulbe Energia**.

> ⚠️ **PRÉ-REQUISITO — Verificar antes de começar:**  
> Abra o **Terminal do VS Code** (`Ctrl + '`) e execute:
> ```
> node -v
> npm -v
> ```
> Ambos devem retornar uma versão (Node v18 ou superior). Se aparecer erro, chame o professor **antes** de continuar.

---

## 🗺️ Visão Geral da Aula

| Parte | Conteúdo | Tempo |
|---|---|---|
| **Parte 0** | Leitura e interpretação das User Stories | 10 min |
| **Parte 1** | Configuração do projeto | 15 min |
| **Parte 2** | Implementando GET /usinas (listar todas) | 20 min |
| **Parte 3** | Implementando GET /usinas/:id (buscar uma) | 20 min |
| **Parte 4** | Implementando POST /usinas (criar) | 20 min |
| **Encerramento** | Commit e reflexão | 10 min |

> ⏱ **Tempo total estimado: 95 minutos**

---

## 📖 Parte 0 — Leitura das User Stories (10 min)

Antes de escrever qualquer linha de código, é obrigatório **compreender o que você vai construir**. Isso é o que separa um desenvolvedor profissional de quem apenas digita código.

Leia com atenção as três histórias de usuário que guiarão esta aula:

---

### 📌 US-API-01 — Listagem de Usinas

> **Como** painel de administração do frontend Bulbe Energia,  
> **quero** consultar a lista completa de usinas cadastradas,  
> **para** exibir o catálogo de usinas ao gestor de energia.

**Critérios de Aceite:**
- A resposta deve retornar **todas** as usinas em formato JSON
- Cada usina deve conter: `id`, `nome`, `tipo`, `capacidade_kw`, `status`, `localizacao`
- O status HTTP da resposta deve ser **200 OK**
- Se não houver usinas cadastradas, retornar **lista vazia** (`[]`), **não um erro**

---

### 📌 US-API-02 — Detalhes de uma Usina

> **Como** tela de detalhes do frontend Bulbe Energia,  
> **quero** consultar os dados completos de uma usina específica pelo seu identificador,  
> **para** exibir o perfil completo da usina ao usuário.

**Critérios de Aceite:**
- A resposta deve retornar **uma única usina** em formato JSON
- O endpoint deve aceitar o `id` da usina como parâmetro de rota
- Se a usina **existir**: retornar `200 OK` com os dados
- Se a usina **não existir**: retornar `404 Not Found` com mensagem de erro clara

---

### 📌 US-API-03 — Cadastro de Nova Usina

> **Como** formulário de cadastro do frontend Bulbe Energia,  
> **quero** enviar os dados de uma nova usina para o servidor,  
> **para** que ela seja registrada no sistema e fique disponível para monitoramento.

**Critérios de Aceite:**
- O endpoint deve aceitar um corpo JSON com: `nome`, `tipo`, `capacidade_kw`, `localizacao`
- Campos obrigatórios: `nome` e `tipo`
- Se os dados forem válidos: retornar `201 Created` com o objeto da usina criada (incluindo o `id` gerado)
- Se campos obrigatórios estiverem ausentes: retornar `400 Bad Request` com mensagem descritiva

---

### 🧠 Antes de continuar: responda mentalmente

Antes de passar para o código, tente responder:

1. Qual será o verbo HTTP de cada endpoint? (GET, POST, PUT...)
2. Qual será a URL de cada endpoint?
3. Que dados cada endpoint recebe? Que dados ele retorna?

> 💡 **Dica profissional:** Essa análise é o que você faria em uma reunião de planejamento de sprint. O código vem *depois* do entendimento.

---

## ⚙️ Parte 1 — Configuração do Projeto (15 min)

> 💻 **Sobre o terminal nesta aula:** usaremos o **Terminal Integrado do VS Code**, que no Windows roda o **PowerShell** por padrão. Todos os comandos desta seção são compatíveis com PowerShell. Para abri-lo: menu **Terminal → New Terminal** ou atalho **`Ctrl + '`** (acento grave).

---

### Passo 1: Escolher onde criar o projeto

Antes de criar qualquer pasta, decida **onde** no seu computador o projeto ficará. Recomendamos criar dentro da pasta `Documentos`.

No terminal do VS Code, navegue até lá:

```powershell
cd $HOME\Documents
```

> 🔍 **O que é `$HOME`?** No PowerShell, `$HOME` é uma variável que representa a pasta do seu usuário (ex: `C:\Users\joao`). Usar `$HOME` evita digitar o caminho completo, que varia de máquina para máquina.

---

### Passo 2: Criar a pasta do projeto e entrar nela

Execute os dois comandos **separadamente** — um de cada vez:

```powershell
mkdir bulbe-api-usinas
```

```powershell
cd bulbe-api-usinas
```

> ⚠️ **Por que não usar `mkdir X && cd X` em uma linha só?**  
> O operador `&&` **não funciona** no PowerShell da mesma forma que no Linux/macOS. Execute os comandos em linhas separadas para evitar erros.

**Confirme que está na pasta certa:**
```powershell
pwd
```
A saída deve terminar com `\bulbe-api-usinas`.

---

### Passo 3: Abrir a pasta no VS Code

```powershell
code .
```

> 🔍 **O que é `code .`?** Abre o VS Code na pasta atual (`.` significa "aqui"). Uma nova janela do VS Code abrirá com o Explorer mostrando a pasta `bulbe-api-usinas` vazia. A partir daqui, use o terminal **dentro do VS Code** (`Ctrl + '`) para todos os próximos comandos.

---

### Passo 4: Inicializar o projeto Node.js

No terminal do VS Code:

```powershell
npm init -y
```

**Saída esperada:**
```
Wrote to C:\Users\seu-usuario\Documents\bulbe-api-usinas\package.json
```

Um arquivo `package.json` aparecerá no Explorer do VS Code.

> 🔍 **O que é o `package.json`?** É o "documento de identidade" do projeto. Registra o nome, versão e todas as bibliotecas externas que ele precisa para funcionar.

---

### Passo 5: Instalar as dependências

Execute os dois comandos **separadamente**:

```powershell
npm install express
```

```powershell
npm install -D nodemon
```

Aguarde cada um terminar (aparecerá `added X packages` ao final).

> 🔍 **Por que dois comandos separados?**
> - `express` é dependência de **produção** — o servidor precisa dela para rodar.
> - `nodemon` é dependência de **desenvolvimento** (`-D`). Ela reinicia o servidor automaticamente quando você salva um arquivo. Em produção, isso não é necessário.

**Verifique se funcionou** — no Explorer do VS Code você deve ver a pasta `node_modules` e o arquivo `package-lock.json` criados automaticamente.

> ⚠️ **A pasta `node_modules` tem milhares de arquivos — isso é normal.** Nunca a apague manualmente e nunca a envie ao GitHub (o `.gitignore` cuida disso).

---

### Passo 6: Criar a estrutura de pastas

No terminal do VS Code, execute **um comando por vez**:

```powershell
mkdir src
```
```powershell
mkdir src\routes
```
```powershell
mkdir src\controllers
```
```powershell
mkdir src\data
```

> ⚠️ **Atenção ao separador de pastas:** No PowerShell use `\` (barra invertida). Dentro dos arquivos `.js`, usaremos `/` (barra normal) no código — o Node.js aceita os dois no Windows.

**Confirme a estrutura no Explorer do VS Code.** Você deve ver:
```
bulbe-api-usinas/
└── src/
    ├── controllers/
    ├── data/
    └── routes/
```

> 🔍 **Por que essa estrutura?** Isso é a arquitetura **MVC (Model-View-Controller)** adaptada para APIs:
> - `routes/` → define *quais* URLs existem e qual controller chamam
> - `controllers/` → contém a *lógica de negócio* de cada operação
> - `data/` → simula o banco de dados (nesta aula usaremos um array em memória)

---

### Passo 7: Configurar o package.json para ESM

No Explorer do VS Code, clique no arquivo `package.json` para abri-lo. Substitua **todo** o conteúdo pelo bloco abaixo:

```json
{
  "name": "bulbe-api-usinas",
  "version": "1.0.0",
  "description": "API de usinas para o sistema Bulbe Energia",
  "type": "module",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^5.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

Salve com **`Ctrl + S`**.

> 🔑 **A linha mais importante deste arquivo é `"type": "module"`.**  
> Ela instrui o Node.js a tratar todos os arquivos `.js` do projeto como **ES Modules (ESM)** — o sistema de módulos padrão do JavaScript moderno, o mesmo usado no navegador. Sem ela, o Node assumiria o formato antigo (CommonJS) e os `import`/`export` não funcionariam.

> ⚠️ **As versões exatas do express e nodemon podem ser diferentes** — o número após `^` pode variar. Isso é normal.

---

### Passo 8: Criar o arquivo de dados simulados

No Explorer do VS Code, clique com o **botão direito** na pasta **`data`** → **New File** → digite `usinas.js` → pressione `Enter`.

Cole o conteúdo abaixo no arquivo e salve com `Ctrl + S`:

```javascript
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
```

> 🔍 **`export` no lugar de `module.exports`**  
> Em ESM, cada valor que precisar ser usado em outro arquivo deve ser explicitamente marcado com `export`. Aqui exportamos `usinas` (o array) e `getProximoId` (a função) diretamente na declaração — isso é chamado de **named export**.

> 🔍 **Por que `proximoId` é uma função?** Para garantir que cada nova usina receba um ID único e crescente. `proximoId++` retorna o valor atual e *depois* incrementa — comportamento do operador de pós-incremento em JavaScript.

---

### Passo 9: Criar o arquivo principal app.js

No Explorer, clique com o **botão direito** na pasta **`src`** → **New File** → `app.js` → `Enter`.

Cole o conteúdo e salve com `Ctrl + S`:

```javascript
// src/app.js
// Ponto de entrada da aplicação Bulbe Energia API

import express from 'express';

const app = express();
const PORT = 3000;

// ── Middlewares globais ──────────────────────────────────────────────────────
// Permite que o Express interprete corpos de requisição no formato JSON
app.use(express.json());

// Middleware de log: registra todas as requisições recebidas no console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next(); // Passa para o próximo middleware ou rota
});

// ── Rotas ────────────────────────────────────────────────────────────────────
// (Adicionaremos as rotas nas próximas partes)

// ── Rota de health check (teste de vida do servidor) ─────────────────────────
app.get('/', (req, res) => {
  res.json({ mensagem: '🌱 Bulbe Energia API está no ar!', versao: '1.0.0' });
});

// ── Middleware de erro global ─────────────────────────────────────────────────
// Captura erros não tratados e retorna uma resposta padronizada
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.message);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// ── Inicialização do servidor ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Bulbe API rodando em http://localhost:${PORT}`);
});
```

> 🔍 **`import express from 'express'` no lugar de `const express = require('express')`**  
> Esta é a sintaxe de **default import** do ESM. O Express exporta um valor padrão (a função `express`), e nós o importamos com o nome que quisermos — por convenção, usamos `express`.

---

### Passo 10: Testar se o servidor funciona

No terminal do VS Code:

```powershell
npm run dev
```

**Saída esperada:**
```
[nodemon] starting `node src/app.js`
🚀 Bulbe API rodando em http://localhost:3000
```

> ⚠️ **Se aparecer erro sobre "execution policy"** (política de execução), execute o comando abaixo e tente novamente:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```
> Confirme com `S` (Sim) quando solicitado. Depois rode `npm run dev` novamente.

**Agora teste no navegador:** abra o **Chrome** ou **Edge** e acesse:
```
http://localhost:3000
```

Você deve ver no navegador:
```json
{"mensagem":"🌱 Bulbe Energia API está no ar!","versao":"1.0.0"}
```

> 💡 **Para parar o servidor:** pressione **`Ctrl + C`** no terminal. Com o `nodemon` ativo, você raramente precisará fazer isso — ele reinicia sozinho ao salvar arquivos.

> ✅ **Servidor funcionando? Ótimo. Agora vamos construir os endpoints reais.**

---

## 🔵 Parte 2 — GET /usinas — Listar todas as usinas (20 min)

Implementaremos o endpoint que atende à **US-API-01**.

**Contrato do endpoint:**

| Item | Valor |
|---|---|
| Método | `GET` |
| URL | `/api/v1/usinas` |
| Corpo da requisição | Nenhum |
| Resposta de sucesso | `200 OK` + array JSON com todas as usinas |

---

### Passo 1: Criar o Controller

No Explorer do VS Code, clique com o **botão direito** em **`controllers`** → **New File** → `usinasController.js` → `Enter`.

Cole o conteúdo e salve com `Ctrl + S`:

```javascript
// src/controllers/usinasController.js

import { usinas } from '../data/usinas.js';

// ── Listar todas as usinas ────────────────────────────────────────────────────
// Corresponde à US-API-01
export const listarUsinas = (req, res) => {
  // Retorna a lista completa de usinas.
  // Mesmo que esteja vazia, retorna 200 com array vazio — não um erro.
  // Critério de aceite: "Se não houver usinas, retornar lista vazia []"
  res.status(200).json(usinas);
};
```

> 🔍 **`import { usinas } from '../data/usinas.js'`**  
> Este é o **named import** — importamos exatamente o que foi exportado com aquele nome. Perceba o **`.js` obrigatório** no caminho: em ESM, diferentemente do CommonJS, a extensão não pode ser omitida em imports de arquivos locais.

> 🔍 **`export const` diretamente na função**  
> Em ESM podemos exportar no momento da declaração, sem precisar de um bloco separado no final do arquivo.

> 🔍 **Por que `res.status(200).json(usinas)`?**
> - `.status(200)` define o código HTTP da resposta
> - `.json(usinas)` converte o array JavaScript para JSON e define o cabeçalho `Content-Type: application/json` automaticamente

---

### Passo 2: Criar o arquivo de rotas

No Explorer, clique com o **botão direito** em **`routes`** → **New File** → `usinas.js` → `Enter`.

```javascript
// src/routes/usinas.js

import { Router } from 'express';
import { listarUsinas } from '../controllers/usinasController.js';

const router = Router();

// ── Definição de rotas ────────────────────────────────────────────────────────
// GET /api/v1/usinas → lista todas as usinas
router.get('/', listarUsinas);

export default router;
```

Salve com `Ctrl + S`.

> 🔍 **`import { Router } from 'express'`**  
> Em vez de importar o Express inteiro, importamos apenas o `Router` — somente o que precisamos. Isso é chamado de **named import de um pacote externo**.

> 🔍 **`export default router`**  
> Usamos **default export** para o router porque cada arquivo de rota exporta apenas um router. Um arquivo pode ter no máximo um `export default`, mas quantos `export` nomeados quiser.

---

### Passo 3: Registrar a rota no app.js

Abra `src/app.js` no VS Code. Localize o comentário:

```javascript
// ── Rotas ────────────────────────────────────────────────────────────────────
// (Adicionaremos as rotas nas próximas partes)
```

Substitua **essas duas linhas** por:

```javascript
// ── Rotas ────────────────────────────────────────────────────────────────────
import usinasRouter from './routes/usinas.js';
app.use('/api/v1/usinas', usinasRouter);
```

> ⚠️ **Os `import` em ESM devem ficar no topo do arquivo**, antes de qualquer outro código. Mova a linha `import usinasRouter...` para o topo de `app.js`, logo após `import express from 'express'`. O arquivo completo ficará assim:

```javascript
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
```

Salve com `Ctrl + S`. Observe o terminal — o nodemon reiniciará automaticamente.

> 🔍 **`import usinasRouter from './routes/usinas.js'`**  
> Como o router foi exportado com `export default`, importamos sem chaves. Podemos escolher qualquer nome — usamos `usinasRouter` por clareza.

> 🔍 **Por que `/api/v1/usinas`?** O prefixo `api` sinaliza que é uma API (não uma página HTML). O `v1` é o versionamento — permite criar uma `v2` no futuro sem quebrar clientes que ainda usam `v1`.

---

### Passo 4: Testar o endpoint

> 💡 **Ferramenta utilizada nesta disciplina:** **Bruno** — cliente REST de código aberto, instalado no laboratório. Abra o Bruno pelo menu Iniciar ou pelo atalho na área de trabalho.

No Bruno, crie uma nova requisição (**New Request**) e configure:

- **Método:** `GET`
- **URL:** `http://localhost:3000/api/v1/usinas`
- Clique em **Send**

**Resposta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Usina Solar Minas I",
    "tipo": "solar",
    "capacidade_kw": 5000,
    "status": "ativa",
    "localizacao": "Sete Lagoas, MG"
  },
  {
    "id": 2,
    "nome": "Usina Eólica Nordeste II",
    "tipo": "eolica",
    "capacidade_kw": 12000,
    "status": "ativa",
    "localizacao": "Caetité, BA"
  },
  {
    "id": 3,
    "nome": "Usina Solar Goiás I",
    "tipo": "solar",
    "capacidade_kw": 3200,
    "status": "manutencao",
    "localizacao": "Catalão, GO"
  }
]
```

> ✅ **Critério US-API-01 atendido:**
> - [x] Retorna todas as usinas em JSON
> - [x] Código 200 OK
> - [x] Cada usina contém os campos especificados

---

## 🟡 Parte 3 — GET /usinas/:id — Buscar uma usina (20 min)

Implementaremos o endpoint que atende à **US-API-02**.

**Contrato do endpoint:**

| Item | Valor |
|---|---|
| Método | `GET` |
| URL | `/api/v1/usinas/:id` |
| Parâmetro de rota | `id` (número inteiro) |
| Resposta — usina encontrada | `200 OK` + objeto JSON da usina |
| Resposta — usina não encontrada | `404 Not Found` + mensagem de erro |

---

### Passo 1: Adicionar a função ao Controller

Abra `src/controllers/usinasController.js` e adicione a nova função **após** `listarUsinas`:

```javascript
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
```

Salve com `Ctrl + S`.

> 🔍 **Não há `module.exports` para atualizar!**  
> Em ESM, cada função já é exportada individualmente com `export const`. Não existe um bloco central de exportações no final do arquivo — cada adição é independente.

> 🔍 **Por que `parseInt(req.params.id, 10)`?**  
> Parâmetros de rota chegam sempre como **string**. Em JavaScript, `"1" === 1` é `false` (comparação estrita de tipos). Se não convertêssemos, o `.find()` nunca encontraria nada! O `10` é a **base numérica** (decimal).

---

### Passo 2: Atualizar o arquivo de rotas

Abra `src/routes/usinas.js` e substitua todo o conteúdo:

```javascript
// src/routes/usinas.js

import { Router } from 'express';
import { listarUsinas, buscarUsinaPorId } from '../controllers/usinasController.js';

const router = Router();

// GET /api/v1/usinas → lista todas as usinas
router.get('/', listarUsinas);

// GET /api/v1/usinas/:id → busca uma usina pelo id
router.get('/:id', buscarUsinaPorId);

export default router;
```

Salve com `Ctrl + S`.

> ⚠️ **A ordem das rotas importa!** A rota `'/'` deve vir **antes** de `'/:id'`. O Express interpreta rotas na ordem em que são registradas.

---

### Passo 3: Testar — cenário de sucesso

```
GET http://localhost:3000/api/v1/usinas/1
```

**Resposta esperada (200 OK):**
```json
{
  "id": 1,
  "nome": "Usina Solar Minas I",
  "tipo": "solar",
  "capacidade_kw": 5000,
  "status": "ativa",
  "localizacao": "Sete Lagoas, MG"
}
```

---

### Passo 4: Testar — cenário de erro 404

```
GET http://localhost:3000/api/v1/usinas/999
```

**Resposta esperada (404 Not Found):**
```json
{
  "erro": "Usina com id 999 não encontrada."
}
```

---

### Passo 5: Testar — id inválido

```
GET http://localhost:3000/api/v1/usinas/abc
```

**Resposta esperada (400 Bad Request):**
```json
{
  "erro": "O parâmetro id deve ser um número inteiro."
}
```

> ✅ **Critério US-API-02 atendido:**
> - [x] Retorna dados de uma usina específica
> - [x] Aceita `id` como parâmetro de rota
> - [x] 200 quando encontrada
> - [x] 404 quando não encontrada com mensagem clara

---

## 🟢 Parte 4 — POST /usinas — Criar uma usina (20 min)

Implementaremos o endpoint que atende à **US-API-03**.

**Contrato do endpoint:**

| Item | Valor |
|---|---|
| Método | `POST` |
| URL | `/api/v1/usinas` |
| Corpo da requisição | JSON com `nome`, `tipo`, `capacidade_kw`, `localizacao` |
| Resposta — sucesso | `201 Created` + objeto da usina criada (com id) |
| Resposta — campos faltando | `400 Bad Request` + mensagem de erro |

---

### Passo 1: Atualizar o import no Controller

Abra `src/controllers/usinasController.js`. Localize a **primeira linha**:

```javascript
import { usinas } from '../data/usinas.js';
```

Substitua por:

```javascript
import { usinas, getProximoId } from '../data/usinas.js';
```

---

### Passo 2: Adicionar a função criarUsina

Ainda no `usinasController.js`, adicione a nova função após `buscarUsinaPorId`:

```javascript
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
```

Salve com `Ctrl + S`.

> 🔍 **Por que `201 Created` e não `200 OK`?**  
> RFC 9110 (Fielding et al., 2022) define que `201 Created` indica que a requisição foi atendida e resultou na **criação de um novo recurso**. Usar `200` seria tecnicamente impreciso para uma operação de criação.

> 🔍 **O que é `??` (nullish coalescing)?**  
> Retorna o valor da esquerda se ele **não for** `null` nem `undefined`. Diferente de `||`, que também descartaria `0` e string vazia `""`. Use `??` quando zero ou string vazia são valores válidos.

---

### Passo 3: Adicionar a rota POST em usinas.js

Abra `src/routes/usinas.js` e substitua todo o conteúdo:

```javascript
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
```

Salve com `Ctrl + S`.

---

### Passo 4: Testar — cenário de sucesso

No Bruno, configure:

- **Método:** `POST`
- **URL:** `http://localhost:3000/api/v1/usinas`
- Aba **Body** → selecione **JSON**
- Cole o corpo:

```json
{
  "nome": "Usina Eólica Sul I",
  "tipo": "eolica",
  "capacidade_kw": 8500,
  "localizacao": "Osório, RS"
}
```

Clique em **Send**.

**Resposta esperada (201 Created):**
```json
{
  "id": 4,
  "nome": "Usina Eólica Sul I",
  "tipo": "eolica",
  "capacidade_kw": 8500,
  "status": "ativa",
  "localizacao": "Osório, RS"
}
```

**Confirme que a usina foi adicionada — faça um GET:**
```
GET http://localhost:3000/api/v1/usinas
```
A lista deve agora ter **4 usinas**.

---

### Passo 5: Testar — campos obrigatórios faltando

Body:
```json
{
  "capacidade_kw": 1000
}
```

**Resposta esperada (400 Bad Request):**
```json
{
  "erro": "Os campos \"nome\" e \"tipo\" são obrigatórios."
}
```

---

### Passo 6: Testar — tipo inválido

Body:
```json
{
  "nome": "Usina Teste",
  "tipo": "nuclear"
}
```

**Resposta esperada (400 Bad Request):**
```json
{
  "erro": "Tipo inválido. Valores aceitos: solar, eolica, hidreletrica, biomassa"
}
```

> ✅ **Critério US-API-03 atendido:**
> - [x] Aceita JSON no corpo com `nome`, `tipo`, `capacidade_kw`, `localizacao`
> - [x] Valida campos obrigatórios
> - [x] 201 Created com o objeto criado (incluindo `id`)
> - [x] 400 Bad Request com mensagem descritiva

---

## 💾 Encerramento — Commit do Trabalho (10 min)

Salve todos os arquivos de uma vez: **`Ctrl + K`** depois **`S`** no VS Code.

No terminal do VS Code, execute **um comando por vez**:

```powershell
git init
```

```powershell
git add .
```

```powershell
git commit -m "feat(usinas): implementa endpoints GET e POST com ESM [US-API-01, US-API-02, US-API-03]"
```

> 💡 **Conventional Commits:** o formato `tipo(escopo): descrição` é obrigatório no projeto. O `feat` indica uma nova funcionalidade.

---

## 🔍 Revisão: CommonJS × ESM — comparativo rápido

| Operação | CommonJS (antigo) | ESM (atual) |
|---|---|---|
| Importar pacote | `const x = require('pacote')` | `import x from 'pacote'` |
| Importar named | `const { a } = require('./arq')` | `import { a } from './arq.js'` |
| Exportar named | `module.exports = { a }` | `export const a = ...` |
| Exportar padrão | `module.exports = valor` | `export default valor` |
| Extensão no import | Opcional | **Obrigatória** (`.js`) |
| Habilitar no Node | Padrão (sem config) | `"type": "module"` no `package.json` |

---

## 🔍 Revisão: O que construímos hoje

| US | Endpoint | Método | Status Sucesso | Status Erro |
|---|---|---|---|---|
| US-API-01 | `/api/v1/usinas` | GET | 200 OK | — |
| US-API-02 | `/api/v1/usinas/:id` | GET | 200 OK | 404 / 400 |
| US-API-03 | `/api/v1/usinas` | POST | 201 Created | 400 |

**Estrutura final do projeto:**
```
bulbe-api-usinas\
├── src\
│   ├── app.js
│   ├── controllers\
│   │   └── usinasController.js
│   ├── data\
│   │   └── usinas.js
│   └── routes\
│       └── usinas.js
├── node_modules\
├── package.json
└── package-lock.json
```

---

## ❓ Perguntas para reflexão

1. O que acontece com as usinas criadas via POST quando o servidor é reiniciado? Por que isso ocorre? O que precisaríamos para persistir esses dados?
2. Se dois usuários enviarem um POST ao mesmo tempo, pode haver conflito de IDs? Como bancos de dados reais resolvem isso?
3. Por que separamos rotas e controllers em arquivos diferentes, em vez de escrever tudo no `app.js`?

---

## 🚨 Problemas Comuns no Windows e Soluções

### `nodemon : O arquivo não pode ser carregado` (erro de política de execução)
**Causa:** O PowerShell bloqueou a execução do script do nodemon por política de segurança.  
**Solução:** Execute o comando abaixo e confirme com `S`:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Depois tente `npm run dev` novamente.

---

### `SyntaxError: Cannot use import statement in a module` ou `require is not defined`
**Causa:** O `"type": "module"` está faltando ou foi digitado errado no `package.json`.  
**Solução:** Abra `package.json` e confirme que a linha `"type": "module"` existe exatamente assim, entre `"version"` e `"main"`.

---

### `Error: Cannot find module` com caminho local (ex: `../data/usinas`)
**Causa:** A extensão `.js` foi omitida no `import`. Em ESM, ela é **obrigatória** para arquivos locais.  
**Solução:** Corrija o import adicionando `.js` no final:
```javascript
// ❌ Errado
import { usinas } from '../data/usinas';

// ✅ Correto
import { usinas } from '../data/usinas.js';
```

---

### `SyntaxError: Unexpected token`
**Causa:** Erro de sintaxe no JavaScript — vírgula faltando, chave não fechada, aspas erradas.  
**Solução:** O terminal indica a **linha** do erro. No VS Code, erros de sintaxe aparecem sublinhados em vermelho — procure a marcação no arquivo indicado.

---

### `POST` retorna `{}` (body vazio)
**Causa:** O middleware `express.json()` não foi adicionado ao `app.js`, ou foi adicionado **depois** das rotas.  
**Solução:** Confirme que `app.use(express.json())` está em `app.js` **antes** da linha que registra as rotas.

---

### Bruno: `Cannot POST /api/v1/usinas`
**Causa:** A rota POST não foi registrada, ou o Body não está configurado como JSON.  
**Solução:**
1. Verifique se `router.post('/', criarUsina)` existe em `routes\usinas.js`
2. No Bruno: aba **Body** → selecione **JSON** (não `Text` nem `Form`)

---

### `Error: listen EADDRINUSE: address already in use :::3000`
**Causa:** Outro processo já está usando a porta 3000 (provavelmente uma instância anterior do servidor que não foi fechada com `Ctrl + C`).  
**Solução:** No terminal, pressione `Ctrl + C`. Se o problema persistir, feche todos os terminais do VS Code, reabra e rode `npm run dev` novamente.

---

## 🌐 Parte 5 — CORS: Permitindo que o Frontend Acesse a API (15 min)

### O que é CORS e por que ele existe?

Abra o arquivo `bulbe-frontend.html` no navegador com o servidor rodando. Abra o console do navegador (`F12` → aba **Console**). Você provavelmente verá um erro parecido com este:

```
Access to fetch at 'http://localhost:3000/api/v1/usinas' from origin 'null'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
is present on the requested resource.
```

> 🔍 **O que é esse erro?**  
> **CORS** significa *Cross-Origin Resource Sharing* (Compartilhamento de Recursos entre Origens). Os navegadores implementam uma política de segurança chamada **Same-Origin Policy**: por padrão, uma página só pode fazer requisições para o **mesmo domínio, porta e protocolo** de onde ela foi carregada (Fetch Living Standard, WHATWG, 2024).  
>
> No nosso caso, o frontend está em `null` (arquivo local) ou em outra porta, e a API está em `localhost:3000` — origens diferentes. O navegador bloqueia a requisição **antes mesmo de ela chegar ao servidor**.  
>
> Importante: o **Bruno não tem esse problema** porque é um cliente nativo, não um navegador. Por isso os testes funcionaram — mas o frontend real, aberto no Chrome, será bloqueado.

---

### Passo 1: Instalar o pacote cors

Pare o servidor com `Ctrl + C`. No terminal do VS Code:

```powershell
npm install cors
```

Aguarde terminar (`added X packages`). Depois reinicie o servidor:

```powershell
npm run dev
```

> 🔍 **O que é o pacote `cors`?** É um middleware para Express que adiciona automaticamente os cabeçalhos HTTP necessários para liberar o acesso entre origens. Sem ele, precisaríamos adicionar esses cabeçalhos manualmente em cada resposta.

---

### Passo 2: Adicionar o middleware CORS no app.js

Abra `src/app.js`. Adicione o import do `cors` logo após o import do Express:

```javascript
import express from 'express';
import cors from 'cors';
import usinasRouter from './routes/usinas.js';
```

Em seguida, registre o middleware **antes** de todos os outros middlewares e rotas. O `app.js` completo ficará assim:

```javascript
// src/app.js

import express from 'express';
import cors from 'cors';
import usinasRouter from './routes/usinas.js';

const app = express();
const PORT = 3000;

// ── CORS ──────────────────────────────────────────────────────────────────────
// Deve ser o PRIMEIRO middleware — antes de qualquer rota
app.use(cors({
  origin: '*',          // Permite qualquer origem (adequado para desenvolvimento)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Middlewares globais ──────────────────────────────────────────────────────
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
```

Salve com `Ctrl + S`.

> ⚠️ **A posição do CORS importa.** O middleware `cors()` deve ser registrado **antes** das rotas — incluindo antes do `express.json()`. O Express executa middlewares na ordem em que são registrados; se o CORS vier depois das rotas, requisições de outras origens serão bloqueadas antes de chegar a ele.

---

### Passo 3: Verificar os cabeçalhos de resposta

No Bruno, faça novamente:

```
GET http://localhost:3000/api/v1/usinas
```

Clique na aba **Headers** da resposta. Você deve ver o novo cabeçalho:

```
Access-Control-Allow-Origin: *
```

> 🔍 **O que significa `Access-Control-Allow-Origin: *`?**  
> O `*` (wildcard) informa ao navegador que **qualquer origem** pode acessar este recurso. É adequado para desenvolvimento, mas em produção você deve especificar apenas as origens confiáveis — por exemplo, o domínio do seu frontend.

---

### Passo 4: Testar com o frontend

Abra o arquivo `bulbe-frontend.html` no Chrome ou Edge. Com o servidor rodando, a tabela deve carregar as usinas normalmente, sem erros no console.

Abra o `F12` → **Console** e confirme que **não há mais erros de CORS**.

> ✅ **Frontend e backend se comunicando com sucesso.**

---

### Como funciona o CORS por baixo dos panos

Antes de liberar uma requisição entre origens, o navegador realiza uma verificação em dois tempos:

**Para requisições simples** (GET, POST com `Content-Type: application/json`), o navegador envia a requisição diretamente e verifica o cabeçalho `Access-Control-Allow-Origin` na resposta. Se estiver ausente ou não incluir a origem do frontend, o navegador bloqueia o acesso ao resultado — mesmo que o servidor tenha respondido 200.

**Para requisições complexas** (PUT, DELETE, ou cabeçalhos customizados), o navegador envia primeiro uma requisição `OPTIONS` — chamada de **preflight** — perguntando ao servidor se a operação é permitida. Só depois de receber aprovação é que a requisição real é enviada. O pacote `cors` responde ao preflight automaticamente.

```
Navegador                          Servidor
   │                                  │
   │── OPTIONS /api/v1/usinas ────────►│  (preflight)
   │◄─ 204 + Access-Control-* ────────│
   │                                  │
   │── POST /api/v1/usinas ──────────►│  (requisição real)
   │◄─ 201 Created ──────────────────│
```

---

### CORS em produção — boas práticas

A configuração `origin: '*'` é conveniente para desenvolvimento, mas **não deve ser usada em produção**. Quando o sistema Bulbe Energia for implantado, restrinja as origens permitidas:

```javascript
// Exemplo para produção — substitua pelo domínio real do frontend
app.use(cors({
  origin: 'https://bulbeenergia.com.br',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

> 💡 **Por que restringir?** Com `origin: '*'`, qualquer site na internet pode fazer requisições à sua API. Em produção, isso pode expor dados sensíveis ou facilitar ataques. A restrição por origem garante que apenas o frontend autorizado consiga se comunicar com o backend.

---

### Erro novo na seção de troubleshooting

#### `has been blocked by CORS policy` no console do navegador
**Causa:** O middleware `cors` não foi instalado, não foi importado em `app.js`, ou foi registrado **depois** das rotas.  
**Solução:**
1. Verifique se `cors` está em `dependencies` no `package.json` (rode `npm install cors` se necessário)
2. Confirme que `import cors from 'cors'` existe no topo de `app.js`
3. Confirme que `app.use(cors({...}))` está **antes** de `app.use(express.json())` e de todas as rotas

---

## 📚 Referências

1. FIELDING, R. et al. *RFC 9110: HTTP Semantics*. IETF, 2022. Disponível em: https://www.rfc-editor.org/rfc/rfc9110
2. RICHARDSON, L.; AMUNDSEN, M. *RESTful Web APIs*. Sebastopol: O'Reilly Media, 2013.
3. EXPRESSJS. *Express 4.x — API Reference*. Disponível em: https://expressjs.com/en/4x/api.html
4. MDN WEB DOCS. *Cross-Origin Resource Sharing (CORS)*. Disponível em: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
5. MDN WEB DOCS. *JavaScript modules*. Disponível em: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
6. NODE.JS. *ECMAScript modules*. Disponível em: https://nodejs.org/api/esm.html
7. WHATWG. *Fetch Living Standard — CORS protocol*. Disponível em: https://fetch.spec.whatwg.org/#http-cors-protocol
8. SOMMERVILLE, I. *Engenharia de Software*. 10. ed. São Paulo: Pearson, 2019. Cap. 4 (Engenharia de Requisitos).

---

*Bulbe Energia API — Projeto de Desenvolvimento Backend | IBMEC*
