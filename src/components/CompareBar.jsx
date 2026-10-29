import React from 'react';
import '../css/PokemonCompare.css';

const imageUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

export default function CompareBar({ selected, onRemove, onClear, onCompare }) {
  if (selected.length === 0) return null;

  const slots = [selected[0], selected[1]];
  const ready = selected.length === 2;

  return (
    <div className="compare-bar" role="region" aria-label="Pokémon selecionados para comparação">
      <div className="compare-slots">
        {slots.map((pokemon, index) => (
          <React.Fragment key={index}>
            {index === 1 && <span className="compare-vs">VS</span>}
            {pokemon ? (
              <button
                className="compare-slot filled"
                onClick={() => onRemove(pokemon.id)}
                title={`Remover ${pokemon.name}`}
                aria-label={`Remover ${pokemon.name} da comparação`}
              >
                <img src={imageUrl(pokemon.id)} alt="" />
                <span>{pokemon.name}</span>
              </button>
            ) : (
              <span className="compare-slot empty">
                <i />
                <span>Escolha outro</span>
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="compare-actions">
        <button className="compare-clear" onClick={onClear}>Limpar</button>
        <button className="compare-go" onClick={onCompare} disabled={!ready}>
          Comparar
        </button>
      </div>
    </div>
  );
}
