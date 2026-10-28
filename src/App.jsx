import { useMemo, useState, useEffect } from 'react';
import pokedexData from './data/pokedex-data.json';
import SearchBar from './components/SearchBar';
import PokemonCard from './components/PokemonCard';
import PokemonDetails from './components/PokemonDetails';
import TrainerList from './components/TrainerList';
import PokedexCover from './components/PokedexCover';
import './css/App.css';
import './css/PokemonList.css';

const allTypes = ['Todos', 'Favoritos', ...pokedexData.types.filter(t => t.name !== 'Typeless').map(t => t.name)];

export default function App() {
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('Todos');
  const [selected, setSelected] = useState(null);
  const [showTrainers, setShowTrainers] = useState(false);
  const [sortBy, setSortBy] = useState('id');

  const [isAnimating, setIsAnimating] = useState(false);
  const [animState, setAnimState] = useState('shaking');

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

  const handleRandomPokemon = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimState('shaking');

    const randomIndex = Math.floor(Math.random() * pokedexData.pokemon.length);
    const randomPoke = pokedexData.pokemon[randomIndex];

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

  const visiblePokemon = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/^#/, '');

    const filtered = pokedexData.pokemon.filter((item) => {
      let matchesType = false;
      if (activeType === 'Todos') {
        matchesType = true;
      } else if (activeType === 'Favoritos') {
        matchesType = favorites.includes(item.id);
      } else {
        matchesType = item.types.some(t => t.name === activeType);
      }

      const matchesSearch = !normalized || item.name.toLowerCase().includes(normalized) || String(item.id).includes(normalized);

      return matchesType && matchesSearch;
    });

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
  }, [activeType, query, favorites, sortBy]);

  return (
    <>
      {!isPoweredOn && <PokedexCover onLigar={() => setIsPoweredOn(true)} />}
      
      <div className="app-shell" style={{ display: isPoweredOn ? 'block' : 'none' }}>
        {isAnimating && (
          <div className={`random-anim-overlay ${animState === 'open' ? 'fade-out' : ''}`}>
            <div className={`pokeball-anim ${animState === 'open' ? 'open' : ''}`}>
              <div className="pokeball-half"></div>
              <div className="pokeball-half pokeball-bottom"></div>
              <div className="pokeball-button"></div>
            </div>
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
              <strong>{pokedexData.pokemon.length}</strong>
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

            {visiblePokemon.length ? (
              <div className="pokemon-grid">
                {visiblePokemon.map((item) => (
                  <PokemonCard
                    key={item.id}
                    pokemon={item}
                    onClick={() => setSelected(item)}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
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
          <PokemonDetails pokemon={selected} onClose={() => setSelected(null)} />
        )}

        {showTrainers && (
          <TrainerList
            trainers={pokedexData.trainers}
            pokemonList={pokedexData.pokemon}
            onClose={() => setShowTrainers(false)}
          />
        )}
      </div>
    </>
  );
}