# 🎮 Pokédex — React + Spring Boot + MongoDB

Uma Pokédex interativa para pesquisar, filtrar, comparar e cadastrar Pokémon. O frontend é feito com **React + Vite**; os dados vêm de uma **API REST em Spring Boot**, que guarda tudo no **MongoDB**.

Projeto desenvolvido nas **Atividades 03 e 04** da disciplina, com a metodologia de **Pair Programming (Programação em Par)**.

```text
React + Vite (porta 5173)  →  Spring Boot REST API (porta 8080)  →  MongoDB
```

## 👥 Dupla

- **Diego Vitor Portella**
- **Manoel Neto**

<p align="center">
  <img src="docs/screenshots/02-lista-claro.png" alt="Lista de Pokémon no tema claro" width="820">
</p>

---

## ✨ Funcionalidades

**Requisitos das atividades**

- 🔍 **Pesquisa pela API:** por nome ou ID (`pika`, `25`, `#025`), atualizada enquanto você digita.
- 🧬 **Filtro por tipo:** Fire, Water, Grass etc., combinável com a pesquisa.
- 📋 **Listagem em cards** com imagem grande, número, tipos e atributos.
- 📊 **Detalhes do Pokémon:** HP, Attack, Defense, Sp. Atk, Sp. Def e Speed em barras, com o total.
- ➕✏️🗑️ **Cadastro, edição e exclusão** de Pokémon, persistidos no MongoDB pela API.
- 🧑‍🚀 **Treinadores:** nome, insígnias e os Pokémon de cada um (dados também no MongoDB).
- ⚠️ **Estados de carregamento, erro e "nenhum Pokémon encontrado".**

**Extras**

- ⭐ **Favoritos** (salvos no navegador) e um filtro só com eles.
- ⚔️ **Comparação** entre dois Pokémon, com barras lado a lado e veredito.
- 📊 **Ordenação** por ID, nome e cada atributo.
- 🎲 **Pokémon aleatório** com animação de radar.
- 🌙 **Tema claro e escuro.**
- 📱 **Layout responsivo** (desktop, tablet e celular).

---

## 🎨 Identidade visual

A interface foi pensada para parecer uma **Pokédex de verdade**: a página é a carcaça vermelha do aparelho, e o conteúdo aparece numa **tela com moldura grafite**.

| Elemento | Como aparece |
| --- | --- |
| **Capa de abertura** | Uma Pokédex fechada, feita só em CSS. Toque para abrir a tampa e ligar o aparelho. |
| **Cabeçalho** | Lente azul e três LEDs, como no topo do aparelho. A pesquisa é o "slot do scanner". |
| **Tela** | Moldura grafite com grade sutil; o contador de Pokémon é um visor LCD. |
| **Cards** | Fichas com radar na cor do tipo atrás do Pokémon, número em placa LCD e placa de nome. |
| **Atributos** | Barras segmentadas, como LEDs. |
| **Botões** | Teclas físicas que "afundam" ao clicar; o filtro ativo acende. |
| **Sorteio** | Um radar escaneia e **trava no Pokémon** sorteado ("Pokémon localizado!"). |

**Tipografia:** Chakra Petch (títulos e números) e Barlow (texto). **Cores:** vermelho da carcaça `#E4393F`, grafite `#20232B`, azul da lente e ciano do visor `#4FE0FF`, amarelo e verde dos LEDs. Cada tipo de Pokémon tem a sua própria cor, usada nos cards, nos detalhes e na comparação.

<table>
  <tr>
    <td><img src="docs/screenshots/01-capa.png" alt="Capa de abertura"></td>
    <td><img src="docs/screenshots/03-detalhes.png" alt="Detalhes do Pokémon"></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/04-lista-escuro-filtro.png" alt="Tema escuro com filtro Fire"></td>
    <td><img src="docs/screenshots/05-comparacao.png" alt="Comparação entre dois Pokémon"></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/06-treinadores.png" alt="Treinadores"></td>
    <td><img src="docs/screenshots/07-sorteio-radar.png" alt="Animação do sorteio (radar)"></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/08-mobile.png" alt="Versão para celular" width="260">
</p>

---

## 🛠️ Tecnologias

**Frontend**

- **[React](https://react.dev/)** com componentes funcionais, props e hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
- **[Vite](https://vite.dev/)** como ferramenta de build e servidor de desenvolvimento.
- **CSS3** puro: variáveis para os temas, Grid, Flexbox, `color-mix` para as cores por tipo e animações.

**Backend**

- **Spring Boot 3.5** com Spring Web, Spring Data MongoDB e Bean Validation (Java 21+).
- **MongoDB** (Atlas ou local).

**Imagens:** os sprites dos Pokémon vêm do repositório público da [PokéAPI](https://github.com/PokeAPI/sprites) (`sprites/pokemon/other/home/{id}.png`) e os dos treinadores do [Pokémon Showdown](https://play.pokemonshowdown.com/sprites/trainers/). Os dados (atributos, tipos, treinadores) vêm do `Script_Pokedex.sql`, via API própria.

---

## 📁 Estrutura do projeto

```text
pokedex-react/
├── backend/                      # API Spring Boot
│   ├── pom.xml
│   ├── .env.example              # modelo das variáveis (o .env real não é versionado)
│   └── src/
│       ├── main/java/com/pokedex/api/
│       │   ├── controller/       # PokemonController, CatalogController, ApiExceptionHandler
│       │   ├── service/          # PokemonService (regras do CRUD, busca e filtro)
│       │   ├── repository/       # Pokemon/Type/Trainer repositories (MongoRepository)
│       │   ├── model/            # Pokemon, Stats, PokemonType, Trainer
│       │   └── config/           # CorsConfig, DataSeeder, SqlScriptParser
│       ├── main/resources/       # application.properties e cópia do Script_Pokedex.sql
│       └── test/                 # testes do conversor SQL → MongoDB
├── src/                          # Frontend React
│   ├── components/
│   │   ├── PokedexCover.jsx      # Capa de abertura
│   │   ├── SearchBar.jsx         # Pesquisa
│   │   ├── PokemonCard.jsx       # Card do Pokémon
│   │   ├── PokemonDetails.jsx    # Painel de detalhes (editar / excluir)
│   │   ├── PokemonForm.jsx       # Formulário de cadastro e edição
│   │   ├── CompareBar.jsx        # Barra de seleção para comparar
│   │   ├── PokemonCompare.jsx    # Comparação entre dois Pokémon
│   │   └── TrainerList.jsx       # Treinadores
│   ├── css/                      # Um arquivo de estilo por componente + App.css (tema)
│   ├── services/api.js           # Cliente da API REST
│   ├── App.jsx                   # Estado principal, busca, filtros e CRUD
│   └── main.jsx
├── docs/screenshots/             # Imagens usadas neste README
├── Script_Pokedex.sql            # Fonte dos dados
├── package.json
└── vite.config.js
```

> O arquivo `src/data/pokedex-data.json` é da Atividade 03 e **não é mais usado**: a aplicação lê tudo pela API.

---

## 🗄️ Modelo no MongoDB

O `Script_Pokedex.sql` (relacional) foi adaptado para documentos. As tabelas de relação N:N viram listas embutidas:

| Coleção    | Origem no SQL                            | Exemplo                                                                                     |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| `pokemons` | `Pokemon` + `Rel_Pokemon_Type` + `Types` | `{ id: 25, name: "Pikachu", stats: { hp: 35, ... }, types: [{ id: 5, name: "Electric" }] }` |
| `types`    | `Types`                                  | `{ id: 5, name: "Electric" }`                                                               |
| `trainers` | `Trainers` + `Rel_Trainer_Pokemon`       | `{ id: 1, name: "Ash", badges: 9, pokemonIds: [25, 3, 6, 9, 131, 143] }`                    |

Na **primeira execução**, se a coleção `pokemons` estiver vazia, o backend lê o `Script_Pokedex.sql` e popula as três coleções automaticamente (`DataSeeder`). Nas execuções seguintes nada é sobrescrito.

---

## 🚀 Como executar

### 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (inclui o npm)
- **JDK 21 ou superior** e [Maven](https://maven.apache.org/)
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (ou um MongoDB local)
- [Git](https://git-scm.com/)

### 1. Clonar o repositório

```bash
git clone https://github.com/diegovitorportella/pokedex-react.git
cd pokedex-react
```

### 2. Configurar o MongoDB

As credenciais **não ficam no GitHub**. O backend lê a variável `MONGODB_URI`.

**Opção A — MongoDB Atlas (recomendado):**

1. Crie um cluster gratuito (M0) no Atlas.
2. Em *Database Access*, crie um usuário e senha. Em *Network Access*, libere o seu IP.
3. Em *Connect → Drivers*, copie a connection string.
4. Na pasta `backend/`, copie `.env.example` para `.env` e cole a string com o nome do banco `pokedex`:

   ```env
   MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/pokedex?retryWrites=true&w=majority
   ```

   O arquivo `.env` está no `.gitignore`.

**Opção B — MongoDB local:** instale o MongoDB Community (ou use `docker run -p 27017:27017 mongo`). Sem `.env`, o padrão é `mongodb://localhost:27017/pokedex`.

### 3. Executar o backend

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. No log, procure por `Seed concluído: 151 pokemons, 18 types, 12 trainers.` Para rodar os testes do conversor SQL → MongoDB: `mvn test`.

### 4. Executar o frontend

Em outro terminal, na raiz do projeto:

```bash
npm install
npm run dev
```

Acesse **http://localhost:5173**. Se a porta estiver ocupada, use o endereço que o terminal informar. Para apontar o frontend para outra URL de API, crie um `.env` na raiz com `VITE_API_URL=http://host:8080/api`.

---

## 🌐 Endpoints da API

| Método   | Endpoint             | Descrição                                                             |
| -------- | -------------------- | --------------------------------------------------------------------- |
| `GET`    | `/api/pokemons`      | Lista os Pokémon (filtros opcionais `?name=` por nome/ID e `?type=`)  |
| `GET`    | `/api/pokemons/{id}` | Busca um Pokémon pelo ID                                              |
| `POST`   | `/api/pokemons`      | Cadastra (o `id` é gerado se omitido; `409` se já existir)            |
| `PUT`    | `/api/pokemons/{id}` | Atualiza um Pokémon                                                   |
| `DELETE` | `/api/pokemons/{id}` | Remove um Pokémon                                                     |
| `GET`    | `/api/types`         | Lista os tipos                                                        |
| `GET`    | `/api/trainers`      | Lista os treinadores (com `pokemonIds`)                               |
| `GET`    | `/api/trainers/{id}` | Busca um treinador                                                    |

Exemplo de corpo para `POST`/`PUT`:

```json
{
  "name": "Pikachu",
  "stats": { "hp": 35, "attack": 55, "defense": 30, "specialAttack": 50, "specialDefense": 40, "speed": 90 },
  "types": [{ "id": 5, "name": "Electric" }]
}
```

### 🔎🧬 Busca e filtro feitos pela API

A barra de pesquisa e o filtro por tipo da interface chamam a API:

- Digitar no campo de busca → `GET /api/pokemons?name=bulba` (após ~300 ms sem digitar). O parâmetro `name` aceita **nome ou ID** (`25`, `#025`, `pika`).
- Clicar em um tipo → `GET /api/pokemons?type=Fire`. Os dois filtros podem ser combinados: `?name=char&type=Fire`.
- O filtro **Favoritos** é uma preferência local (salva no `localStorage`), aplicada sobre o resultado da API.

### ➕✏️🗑️ Cadastro, edição e exclusão na interface

- **➕ Novo** (acima da lista): abre o formulário de cadastro.
- **Detalhes do Pokémon:** botões **✏️ Editar** (mesmo formulário preenchido) e **🗑️ Excluir** (com confirmação).

> As imagens vêm do **ID** do Pokémon. Um Pokémon novo recebe o próximo ID (152, 153...), então a imagem exibida será a do Pokémon real com esse número na PokéAPI.

---

## 🎓 Contexto acadêmico

Projeto desenvolvido nas **Atividades 03 e 04**, com foco em React (componentes, props, estado e eventos), em uma API REST com Spring Boot, em modelagem de dados no MongoDB e na integração entre frontend e backend, tudo com **Pair Programming**.
