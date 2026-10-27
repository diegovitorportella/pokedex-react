import { useMemo, useState } from 'react';
import pokedexData from './data/pokedex-data.json';
import SearchBar from './components/SearchBar';
import PokemonCard from './components/PokemonCard';
import PokemonDetails from './components/PokemonDetails';
import './css/App.css';
import './css/PokemonList.css';

const allTypes = ['Todos', ...pokedexData.types.filter(t => t.name !== 'Typeless').map(t => t.name)];

export default function App() {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState('Todos');
  const [selected, setSelected] = useState(null);

  const visiblePokemon = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/^#/, '');
    return pokedexData.pokemon.filter((item) => {
      const matchesType = activeType === 'Todos' || item.types.some(t => t.name === activeType);
      const matchesSearch = !normalized || item.name.toLowerCase().includes(normalized) || String(item.id).includes(normalized);
      return matchesType && matchesSearch;
    });
  }, [activeType, query]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <nav className="nav-wrap" aria-label="Navegação principal">
          <a className="brand" href="#">
            <span className="brand-ball"><i /></span> Pokédex
          </a>
          <SearchBar query={query} setQuery={setQuery} />
          <button className="profile-button">TR</button>
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
                {type !== 'Todos' && <i className={`chip-dot type-${type.toLowerCase()}`} />}
                {type}
              </button>
            ))}
          </div>
        </section>

        <section className="content">
          <div className="results-heading">
            <h2>{activeType === 'Todos' ? 'Todos os Pokémon' : `Pokémon tipo ${activeType}`}</h2>
            <span>{visiblePokemon.length} resultados</span>
          </div>

          {visiblePokemon.length ? (
            <div className="pokemon-grid">
              {visiblePokemon.map((item) => (
                <PokemonCard key={item.id} pokemon={item} onClick={() => setSelected(item)} />
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
      {/* Renderiza o modal apenas se houver um Pokémon selecionado */}
      {selected && (
        <PokemonDetails pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}