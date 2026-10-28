import { useMemo, useState, useEffect } from 'react';
import pokedexData from './data/pokedex-data.json';
import SearchBar from './components/SearchBar';
import PokemonCard from './components/PokemonCard';
import PokemonDetails from './components/PokemonDetails';
import TrainerList from './components/TrainerList';
import './css/App.css';
import './css/PokemonList.css';

const allTypes = ['Todos', 'Favoritos', ...pokedexData.types.filter(t => t.name !== 'Typeless').map(t => t.name)];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('Todos');
  const [selected, setSelected] = useState(null);
  const [showTrainers, setShowTrainers] = useState(false);
  
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

  const visiblePokemon = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/^#/, '');
    
    return pokedexData.pokemon.filter((item) => {
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
  }, [activeType, query, favorites]);

  return (
    <div className="app-shell">
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
          >
            {darkMode ? '☀️' : '🌙'}
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
                {type === 'Favoritos' && <span style={{marginRight: '4px'}}>⭐</span>}
                {type}
              </button>
            ))}
          </div>
        </section>

        <section className="content">
          <div className="results-heading">
            <h2>{activeType === 'Todos' ? 'Todos os Pokémon' : activeType === 'Favoritos' ? 'Seus Favoritos' : `Pokémon tipo ${activeType}`}</h2>
            <span>{visiblePokemon.length} resultados</span>
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
  );
}