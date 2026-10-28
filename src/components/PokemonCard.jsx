import React from 'react';
import '../css/PokemonCard.css';

const padId = (id) => `#${String(id).padStart(3, '0')}`;
const imageUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

export default function PokemonCard({ pokemon, onClick, isFavorite, onToggleFavorite }) {
  const mainType = pokemon.types && pokemon.types.length > 0 
    ? pokemon.types[0].name.toLowerCase() 
    : 'normal';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(pokemon.id);
  };

  return (
    <button
      className={`pokemon-card card-${mainType}`}
      onClick={onClick}
      aria-label={`Ver detalhes do ${pokemon.name}`}
    >
      <button 
        className="favorite-btn" 
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        title="Favoritar"
      >
        {isFavorite ? '⭐' : '☆'}
      </button>

      <span className="card-id">{padId(pokemon.id)}</span>
      <span className="card-orb" />
      <img src={imageUrl(pokemon.id)} alt={pokemon.name} />
      <span className="card-content">
        <strong>{pokemon.name}</strong>
        <span className="badges">
          {pokemon.types && pokemon.types.map((t) => (
            <span key={t.id} className={`type-badge type-${t.name.toLowerCase()}`}>
              {t.name}
            </span>
          ))}
        </span>
      </span>
      <span className="card-arrow" aria-hidden="true">↗</span>
    </button>
  );
}