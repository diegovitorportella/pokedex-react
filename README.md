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

## 🎓 Contexto Acadêmico

Projeto desenvolvido como parte da **Atividade 03**, com foco na criação de uma aplicação interativa utilizando React, organização por componentes, gerenciamento de estados e desenvolvimento colaborativo por meio da metodologia **Pair Programming**.

