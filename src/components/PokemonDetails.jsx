import React, { useEffect } from 'react';

const padId = (id) => `#${String(id).padStart(3, '0')}`;
const imageUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

const statColors = {
  'HP': '#DF2140',
  'Attack': '#FF9C54',
  'Defense': '#E3C61A',
  'Sp. Atk': '#559EDF',
  'Sp. Def': '#66CC81',
  'Speed': '#F366B9'
};

export default function PokemonDetails({ pokemon, onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    document.body.classList.add('panel-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('panel-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  if (!pokemon) return null;

  const mainType = pokemon.types && pokemon.types.length > 0 
    ? pokemon.types[0].name.toLowerCase() 
    : 'normal';
  
  const statsList = [
    { label: 'HP', value: pokemon.stats.hp },
    { label: 'Attack', value: pokemon.stats.attack },
    { label: 'Defense', value: pokemon.stats.defense },
    { label: 'Sp. Atk', value: pokemon.stats.specialAttack },
    { label: 'Sp. Def', value: pokemon.stats.specialDefense },
    { label: 'Speed', value: pokemon.stats.speed },
  ];
  
  const totalStats = statsList.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="modal-layer" role="dialog" aria-modal="true">
      <button className="modal-backdrop" onClick={onClose} aria-label="Fechar detalhes" />
      <aside className={`detail-panel card-${mainType}`}>
        <button className="close-button" onClick={onClose} aria-label="Fechar detalhes">
          <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
        <div className="detail-visual">
          <span className="detail-number">{padId(pokemon.id)}</span>
          <span className="detail-orb" />
          <img src={imageUrl(pokemon.id)} alt={pokemon.name} />
        </div>
        <div className="detail-content">
          <h2>{pokemon.name}</h2>
          <div className="badges detail-badges">
            {pokemon.types && pokemon.types.map((t) => (
              <span key={t.id} className={`type-badge type-${t.name.toLowerCase()}`}>{t.name}</span>
            ))}
          </div>
          <div className="stats-header" style={{ marginTop: '20px' }}>
            <h3>Base stats</h3>
            <span>Total {totalStats}</span>
          </div>
          <div className="stats-list">
            {statsList.map((stat) => (
              <div className="stat-row" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <div className="stat-track">
                  <i style={{ 
                    width: `${Math.min((stat.value / 160) * 100, 100)}%`,
                    background: statColors[stat.label] 
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}