# 🎮 Pokédex — React + Vite

Uma aplicação web interativa desenvolvida com **React** e **Vite** para visualizar, pesquisar e explorar Pokémon.

Este projeto foi desenvolvido como **Atividade 03** da disciplina, utilizando a metodologia de **Pair Programming (Programação em Par)**.

## 👥 Dupla

- **Diego Vitor Portella**
- **Manoel Neto**

---

## 🎯 Objetivo e Funcionalidades

A aplicação utiliza um arquivo JSON local para exibir os Pokémon e oferece os seguintes recursos:

- 🔍 **Pesquisa dinâmica:** busque Pokémon pelo nome ou ID, como `Pikachu` ou `025`.
- 📋 **Listagem de Pokémon:** visualize os Pokémon disponíveis em cards.
- 🔥 **Filtro por tipo:** filtre a lista selecionando tipos como Fire, Water, Grass, entre outros.
- 📊 **Detalhes do Pokémon:** abra um modal com imagem ampliada, tipos e atributos base.
- ❤️ **Atributos base:** visualize os valores de HP, Attack, Defense, Sp. Atk, Sp. Def e Speed por meio de barras de progresso.

---

## 🛠️ Tecnologias Utilizadas

- **[React](https://react.dev/):** construção da interface por componentes e gerenciamento de estado com hooks, como `useState`, `useEffect` e `useMemo`.
- **[Vite](https://vite.dev/):** ferramenta de build e servidor de desenvolvimento rápido.
- **CSS3:** estilização responsiva com Grid e Flexbox, variáveis CSS, gradientes dinâmicos por tipo de Pokémon e animações.
- **JavaScript (ES6+):** implementação da lógica de pesquisa, filtragem, mapeamento de arrays e manipulação de dados.
- **JSON:** armazenamento local dos dados utilizados pela aplicação.

---

## 📁 Estrutura do Projeto

Os dados utilizados pela aplicação estão armazenados localmente em `src/data/pokedex-data.json`. Dessa forma, não é necessário configurar uma base de dados externa.

```text
pokedex-react/
├── public/
├── src/
│   ├── assets/                 # Imagens e ícones estáticos
│   ├── components/             # Componentes React
│   │   ├── PokemonCard.jsx     # Card individual do Pokémon
│   │   ├── PokemonDetails.jsx  # Modal com detalhes e atributos
│   │   └── SearchBar.jsx       # Barra de pesquisa
│   ├── css/                    # Arquivos de estilização
│   │   ├── App.css             # Estilos globais e layout principal
│   │   ├── PokemonCard.css
│   │   ├── PokemonList.css
│   │   └── SearchBar.css
│   ├── data/
│   │   └── pokedex-data.json   # Dados locais dos Pokémon
│   ├── App.jsx                 # Componente principal e gerenciamento de estados
│   └── main.jsx                # Ponto de entrada do React
├── package.json
└── vite.config.js
```

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para executar a aplicação em sua máquina.

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- npm, instalado junto com o Node.js
- [Git](https://git-scm.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/diegovitorportella/pokedex-react.git
```

### 2. Acesse a pasta do projeto

```bash
cd pokedex-react
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 5. Acesse a aplicação

Após iniciar o servidor, o terminal exibirá o endereço local da aplicação. Por padrão, o Vite utiliza:

```text
http://localhost:5173
```

Abra esse endereço no navegador para explorar a Pokédex.

> **Observação:** caso a porta padrão esteja ocupada, utilize o endereço informado pelo terminal.

---

## ☕ Atividade 04 — Backend Spring Boot + MongoDB

A partir da Atividade 04, o frontend **não lê mais o `pokedex-data.json`**: os dados vêm de uma API REST em Spring Boot, que persiste tudo no MongoDB.

```text
React + Vite (porta 5173)  →  Spring Boot REST API (porta 8080)  →  MongoDB
```

### 📁 Organização

```text
pokedex-react/
├── backend/                  # Spring Boot (Web, Data MongoDB, Validation)
│   ├── pom.xml
│   └── src/main/java/com/pokedex/api/
│       ├── controller/       # PokemonController, CatalogController, ApiExceptionHandler
│       ├── service/          # PokemonService (regras do CRUD)
│       ├── repository/       # Pokemon/Type/Trainer repositories (MongoRepository)
│       ├── model/            # Pokemon, Stats, PokemonType, Trainer
│       └── config/           # CorsConfig, DataSeeder, SqlScriptParser
├── src/                      # Frontend React (src/services/api.js consome a API)
├── Script_Pokedex.sql        # Fonte dos dados
└── README.md
```

### 🗄️ Modelo no MongoDB

O `Script_Pokedex.sql` (relacional) foi adaptado para documentos. As tabelas de relação N:N viram listas embutidas:

| Coleção    | Origem no SQL                              | Exemplo                                                                                   |
| ---------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `pokemons` | `Pokemon` + `Rel_Pokemon_Type` + `Types`   | `{ id: 25, name: "Pikachu", stats: { hp: 35, ... }, types: [{ id: 5, name: "Electric" }] }` |
| `types`    | `Types`                                    | `{ id: 5, name: "Electric" }`                                                             |
| `trainers` | `Trainers` + `Rel_Trainer_Pokemon`         | `{ id: 1, name: "Ash", badges: 9, pokemonIds: [25, 3, 6, 9, 131, 143] }`                  |

Na **primeira execução**, se a coleção `pokemons` estiver vazia, o backend lê o `Script_Pokedex.sql` e popula as três coleções automaticamente (`DataSeeder`). Nas execuções seguintes nada é sobrescrito.

### 🔐 Configurar o MongoDB (Atlas ou local)

As credenciais **não ficam no GitHub**. O backend lê a variável `MONGODB_URI`.

**Opção A — MongoDB Atlas (recomendado):**
1. Crie um cluster gratuito em [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Em *Database Access*, crie um usuário e senha. Em *Network Access*, libere seu IP.
3. Em *Connect → Drivers*, copie a connection string.
4. Na pasta `backend/`, copie `.env.example` para `.env` e cole a string (com o nome do banco `pokedex`):
   ```env
   MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/pokedex?retryWrites=true&w=majority
   ```
   O arquivo `.env` está no `.gitignore`.

**Opção B — MongoDB local:** instale o MongoDB Community (ou use `docker run -p 27017:27017 mongo`). Sem `.env`, o padrão é `mongodb://localhost:27017/pokedex`.

### ▶️ Executar o backend

Requisitos: **JDK 21+** e **Maven**.

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. Testes do conversor SQL → MongoDB: `mvn test`.

### ▶️ Executar o frontend

Em outro terminal, na raiz do projeto:

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Para apontar para outra URL de API, crie um `.env` na raiz com `VITE_API_URL=http://host:8080/api`.

### 🌐 Endpoints da API

| Método   | Endpoint                | Descrição                                              |
| -------- | ----------------------- | ------------------------------------------------------ |
| `GET`    | `/api/pokemons`         | Lista os Pokémon (filtros opcionais `?name=` por nome/ID e `?type=`) |
| `GET`    | `/api/pokemons/{id}`    | Busca um Pokémon pelo ID                               |
| `POST`   | `/api/pokemons`         | Cadastra (o `id` é gerado se omitido; `409` se já existir) |
| `PUT`    | `/api/pokemons/{id}`    | Atualiza um Pokémon                                    |
| `DELETE` | `/api/pokemons/{id}`    | Remove um Pokémon                                      |
| `GET`    | `/api/types`            | Lista os tipos                                         |
| `GET`    | `/api/trainers`         | Lista os treinadores (com `pokemonIds`)                |
| `GET`    | `/api/trainers/{id}`    | Busca um treinador                                     |

Exemplo de corpo para `POST`/`PUT`:

```json
{
  "name": "Pikachu",
  "stats": { "hp": 35, "attack": 55, "defense": 30, "specialAttack": 50, "specialDefense": 40, "speed": 90 },
  "types": [{ "id": 5, "name": "Electric" }]
}
```

### 🔎🧬 Busca e filtro feitos pela API

A barra de pesquisa e o filtro por tipo da interface chamam a API (não filtram mais no navegador):

- Digitar no campo de busca → `GET /api/pokemons?name=bulba` (após ~300 ms sem digitar). O parâmetro `name` aceita **nome ou ID** (`25`, `#025`, `pika`).
- Clicar em um tipo → `GET /api/pokemons?type=Fire`. Os dois filtros podem ser combinados: `?name=char&type=Fire`.
- O filtro **Favoritos** é uma preferência local (salva no `localStorage`), aplicada sobre o resultado da API.

### ➕✏️🗑️ Cadastro, edição e exclusão na interface

- **➕ Novo** (acima da lista): abre o formulário de cadastro.
- **Detalhes do Pokémon**: botões **✏️ Editar** (mesmo formulário preenchido) e **🗑️ Excluir** (com confirmação).

Todas as operações passam pela API e persistem no MongoDB.

---

## 🎓 Contexto Acadêmico

Projeto desenvolvido como parte da **Atividade 03**, com foco na criação de uma aplicação interativa utilizando React, organização por componentes, gerenciamento de estados e desenvolvimento colaborativo por meio da metodologia **Pair Programming**.

