import { useCallback, useMemo, useState, useEffect } from 'react';
import { api } from './services/api';
import PokemonForm from './components/PokemonForm';
import LoadingNotice from './components/LoadingNotice';
import './css/PokemonForm.css';
import SearchBar from './components/SearchBar';
import PokemonCard from './components/PokemonCard';
import PokemonDetails from './components/PokemonDetails';
import TrainerList from './components/TrainerList';
import PokedexCover from './components/PokedexCover';
// ⚔️ COMPARAÇÃO: novos componentes
import CompareBar from './components/CompareBar';
import PokemonCompare from './components/PokemonCompare';
import './css/App.css';
import './css/PokemonList.css';

export default function App() {
  // 🌐 Dados vindos da API Spring Boot (MongoDB)
  const [pokemons, setPokemons] = useState([]); // lista completa (aleatório, contagem, treinadores)
  const [results, setResults] = useState(null); // resultado da busca/filtro feito pela API
  const [refreshKey, setRefreshKey] = useState(0); // força nova consulta após cadastrar/editar/excluir
  const [types, setTypes] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  // ➕✏️ Formulário: null = fechado, {} = cadastrar, pokemon = editar
  const [formTarget, setFormTarget] = useState(null);

  const loadData = useCallback(() => {
    Promise.all([api.getPokemons(), api.getTypes(), api.getTrainers()])
      .then(([p, t, tr]) => {
        setPokemons(p);
        setTypes(t);
        setTrainers(tr);
        setLoadError('');
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(loadData, [loadData]);

  const retryLoad = () => {
    setLoading(true);
    loadData();
    setRefreshKey(k => k + 1);
  };

  const allTypes = useMemo(
    () => ['Todos', 'Favoritos', ...types.filter(t => t.name !== 'Typeless').map(t => t.name)],
    [types]
  );

  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('Todos');
  const [selected, setSelected] = useState(null);
  const [showTrainers, setShowTrainers] = useState(false);
  const [sortBy, setSortBy] = useState('id');

  const [isAnimating, setIsAnimating] = useState(false);
  const [animState, setAnimState] = useState('shaking');

  // ⚔️ COMPARAÇÃO: Pokémon escolhidos (máx. 2) e controle do modal
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokedex-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('pokedex-theme');
    return savedMode === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('pokedex-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('pokedex-theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('pokedex-theme', 'light');
    }
  }, [darkMode]);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  // ⚔️ COMPARAÇÃO: adiciona/remove um Pokémon. Se já houver 2, o mais antigo sai.
  const toggleCompare = (pokemon) => {
    setCompareList(prev => {
      if (prev.some(p => p.id === pokemon.id)) {
        return prev.filter(p => p.id !== pokemon.id);
      }
      return prev.length < 2 ? [...prev, pokemon] : [prev[1], pokemon];
    });
  };

  // ➕✏️🗑️ CRUD via API
  const handleSave = async (payload) => {
    const saved = formTarget?.id
      ? await api.updatePokemon(formTarget.id, payload)
      : await api.createPokemon(payload);
    setPokemons(prev =>
      prev.some(p => p.id === saved.id)
        ? prev.map(p => (p.id === saved.id ? saved : p))
        : [...prev, saved]
    );
    setRefreshKey(k => k + 1);
    setCompareList(prev => prev.map(p => (p.id === saved.id ? saved : p)));
    setSelected(prev => (prev && prev.id === saved.id ? saved : prev));
    setFormTarget(null);
  };

  const handleDelete = async (pokemon) => {
    try {
      await api.deletePokemon(pokemon.id);
      setPokemons(prev => prev.filter(p => p.id !== pokemon.id));
      setRefreshKey(k => k + 1);
      setCompareList(prev => prev.filter(p => p.id !== pokemon.id));
      setFavorites(prev => prev.filter(id => id !== pokemon.id));
      setSelected(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRandomPokemon = () => {
    if (isAnimating || pokemons.length === 0) return;
    setIsAnimating(true);
    setAnimState('shaking');

    const randomIndex = Math.floor(Math.random() * pokemons.length);
    const randomPoke = pokemons[randomIndex];

    setTimeout(() => {
      setAnimState('open');
      setTimeout(() => {
        setSelected(randomPoke);
        setTimeout(() => {
          setIsAnimating(false);
        }, 350);
      }, 250);
    }, 1200);
  };

  // 🔎🧬 Pesquisa por nome/ID e filtro por tipo são feitos pela API
  // (GET /api/pokemons?name=...&type=...), com um pequeno atraso enquanto o usuário digita.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      const params = {
        name: query.trim(),
        type: activeType === 'Todos' || activeType === 'Favoritos' ? '' : activeType,
      };
      api.getPokemons(params)
        .then((data) => {
          if (!cancelled) {
            setResults(data);
            setLoadError('');
          }
        })
        .catch((err) => !cancelled && setLoadError(err.message));
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, activeType, refreshKey]);

  const visiblePokemon = useMemo(() => {
    // "Favoritos" é uma preferência local (localStorage), então filtra sobre o resultado da API
    const list = results ?? [];
    const filtered = activeType === 'Favoritos'
      ? list.filter((item) => favorites.includes(item.id))
      : [...list];

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'hp': return b.stats.hp - a.stats.hp;
        case 'attack': return b.stats.attack - a.stats.attack;
        case 'defense': return b.stats.defense - a.stats.defense;
        case 'specialAttack': return b.stats.specialAttack - a.stats.specialAttack;
        case 'specialDefense': return b.stats.specialDefense - a.stats.specialDefense;
        case 'speed': return b.stats.speed - a.stats.speed;
        case 'id':
        default: return a.id - b.id;
      }
    });
  }, [results, activeType, favorites, sortBy]);

  return (
    <>
      {!isPoweredOn && <PokedexCover onLigar={() => setIsPoweredOn(true)} />}
      
      <div className="app-shell" style={{ display: isPoweredOn ? 'block' : 'none' }}>
        {isAnimating && (
          <div className={`random-anim-overlay ${animState === 'open' ? 'fade-out' : ''}`}>
            <div className={`radar ${animState === 'open' ? 'locked' : ''}`} aria-hidden="true">
              <span className="radar-sweep" />
              <span className="radar-blip" />
            </div>
            <p className={`radar-text ${animState === 'open' ? 'locked' : ''}`} role="status">
              {animState === 'open' ? 'Pokémon localizado!' : 'Escaneando...'}
            </p>
          </div>
        )}

        <header className="site-header">
          <nav className="nav-wrap" aria-label="Navegação principal">
            <a className="brand" href="#">
              <span className="brand-ball"><i /></span> Pokédex
            </a>
            <SearchBar query={query} setQuery={setQuery} />

            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title="Alternar Tema"
              style={{ color: 'var(--text-main)' }}
            >
              {!darkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <button className="profile-button" onClick={() => setShowTrainers(true)} title="Ver Treinadores">
              TR
            </button>
          </nav>
        </header>

        <main>
          <section className="intro">
            <div>
              <p className="eyebrow">Pokédex Nacional</p>
              <h1>Descubra seus <span>favoritos.</span></h1>
              <p className="intro-copy">Explore Pokémon, seus tipos, habilidades e atributos.</p>
            </div>
            <div className="collection-count">
              <strong>{pokemons.length}</strong>
              <span>Pokémon<br />na base</span>
            </div>
          </section>

          <section className="filter-section">
            <div className="filter-row">
              {allTypes.map((type) => (
                <button
                  key={type}
                  className={`filter-chip ${activeType === type ? 'active' : ''}`}
                  onClick={() => setActiveType(type)}
                >
                  {type !== 'Todos' && type !== 'Favoritos' && <i className={`chip-dot type-${type.toLowerCase()}`} />}
                  {type === 'Favoritos' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F4C150" stroke="#F4C150" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  )}
                  {type}
                </button>
              ))}
            </div>
          </section>

          <section className="content">
            <div className="results-heading">
              <h2>{activeType === 'Todos' ? 'Todos os Pokémon' : activeType === 'Favoritos' ? 'Seus Favoritos' : `Pokémon tipo ${activeType}`}</h2>

              <div className="results-actions">
                <button className="new-pokemon-btn" onClick={() => setFormTarget({})} title="Cadastrar Pokémon">
                  ➕ Novo
                </button>
                <button className="random-btn" onClick={handleRandomPokemon} title="Sortear Pokémon">
                  🎲 Aleatório
                </button>

                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Ordenar por"
                >
                  <option value="id">Menor ID</option>
                  <option value="name">Nome (A-Z)</option>
                  <option value="hp">Maior HP</option>
                  <option value="attack">Maior Ataque</option>
                  <option value="defense">Maior Defesa</option>
                  <option value="specialAttack">Maior Sp. Atk</option>
                  <option value="specialDefense">Maior Sp. Def</option>
                  <option value="speed">Maior Velocidade</option>
                </select>
                <span>{visiblePokemon.length} resultados</span>
              </div>
            </div>

            {loading || (results === null && !loadError) ? (
              <LoadingNotice />
            ) : loadError ? (
              <div className="api-status">
                <h3>Falha ao carregar os dados</h3>
                <p>{loadError}</p>
                <button onClick={retryLoad}>Tentar novamente</button>
              </div>
            ) : visiblePokemon.length ? (
              <div className="pokemon-grid">
                {visiblePokemon.map((item) => (
                  <PokemonCard
                    key={item.id}
                    pokemon={item}
                    onClick={() => setSelected(item)}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                    // ⚔️ COMPARAÇÃO: props do botão de comparar
                    isComparing={compareList.some(p => p.id === item.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-ball"><i /></span>
                <h3>Nenhum Pokémon encontrado</h3>
                <p>Tente outro nome, ID ou filtro de tipo.</p>
                <button onClick={() => { setQuery(''); setActiveType('Todos'); }}>Limpar filtros</button>
              </div>
            )}
          </section>
        </main>

        {selected && (
          <PokemonDetails
            pokemon={selected}
            onClose={() => setSelected(null)}
            onEdit={(p) => setFormTarget(p)}
            onDelete={handleDelete}
          />
        )}

        {formTarget && (
          <PokemonForm
            pokemon={formTarget.id ? formTarget : null}
            types={types}
            onSave={handleSave}
            onClose={() => setFormTarget(null)}
          />
        )}

        {/* ⚔️ COMPARAÇÃO: barra do rodapé e modal "VS" */}
        <CompareBar
          selected={compareList}
          onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
          onClear={() => setCompareList([])}
          onCompare={() => setShowCompare(true)}
        />

        {showCompare && compareList.length === 2 && (
          <PokemonCompare
            left={compareList[0]}
            right={compareList[1]}
            onClose={() => setShowCompare(false)}
          />
        )}

        {showTrainers && (
          <TrainerList
            trainers={trainers}
            pokemonList={pokemons}
            onClose={() => setShowTrainers(false)}
          />
        )}
      </div>
    </>
  );
}
