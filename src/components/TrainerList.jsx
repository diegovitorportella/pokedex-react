import React, { useEffect } from 'react';
import '../css/TrainerList.css';

const imageUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

const getTrainerImageUrl = (name) => {
  const nameMap = {
    'ash': 'ash',
    'brock': 'brock',
    'misty': 'misty',
    'lt. surge': 'ltsurge',
    'erika': 'erika',
    'koga': 'koga',
    'sabrina': 'sabrina',
    'blaine': 'blaine',
    'giovanni': 'giovanni',
    'gary': 'blue',
    'team rocket': 'teamrocket',
    'lance': 'lance'
  };
  const key = name.toLowerCase();
  const spriteName = nameMap[key] || key.replace(/[^a-z0-9]/g, '');
  return `https://play.pokemonshowdown.com/sprites/trainers/${spriteName}.png`;
};

export default function TrainerList({ trainers, pokemonList, onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    document.body.classList.add('panel-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('panel-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  const getPokemon = (id) => pokemonList.find(p => p.id === id);

  return (
    <div className="modal-layer" role="dialog" aria-modal="true">
      <button className="modal-backdrop" onClick={onClose} aria-label="Fechar lista de treinadores" />
      
      <div className="trainer-modal">
        <button className="close-button" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
        
        <h2>Líderes e Treinadores</h2>
        
        <div className="trainer-grid">
          {trainers.map(trainer => (
            <div className="trainer-card" key={trainer.id}>
              
              <div className="trainer-header">
                <div className="trainer-profile">
                  <div className="trainer-avatar-wrapper">
                    <img 
                      src={getTrainerImageUrl(trainer.name)} 
                      alt={trainer.name} 
                      className="trainer-avatar"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="trainer-info">
                    <h3>{trainer.name}</h3>
                    <span className="badges-count">🏅 {trainer.badges} Insígnias</span>
                  </div>
                </div>
              </div>

              <div className="trainer-pokemon">
                {trainer.pokemonIds.map((pokeId, index) => {
                  const p = getPokemon(pokeId);
                  return p ? (
                    <div className="trainer-poke-slot" key={`${trainer.id}-${pokeId}-${index}`}>
                      <img src={imageUrl(pokeId)} alt={p.name} title={p.name} />
                    </div>
                  ) : null;
                })}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}