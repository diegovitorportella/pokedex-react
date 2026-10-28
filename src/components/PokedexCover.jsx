import React, { useState, useEffect } from 'react';
import '../css/PokedexCover.css';
import pokedexAberta from '../assets/images/pokedex-aberta.webp';
import pokedexFechada from '../assets/images/pokedex-fechada.webp';

export default function PokedexCover({ onLigar }) {
  const [fase, setFase] = useState('fechada');

  useEffect(() => {
    if (fase === 'abrindo') {
      setTimeout(() => setFase('iniciando'), 750);
    }
    if (fase === 'iniciando') {
      setTimeout(() => onLigar(), 1100);
    }
  }, [fase, onLigar]);

  const abrir = () => {
    if (fase !== 'fechada') return;
    setFase('abrindo');
  };

  const legenda = {
    fechada: 'Toque na Pokédex para abrir',
    abrindo: 'Abrindo...',
    iniciando: 'Iniciando a Pokédex...'
  }[fase];

  return (
    <div className="cover" data-fase={fase}>
      <button
        type="button"
        className="cover__device"
        onClick={abrir}
        disabled={fase !== 'fechada'}
        aria-label="Abrir a Pokédex"
      >
        <img className="cover__img" src={pokedexAberta} alt="" draggable="false" />
        <span className="cover__lens" aria-hidden="true" />
        <span className="cover__led" aria-hidden="true" />
        <span className="cover__scan" aria-hidden="true" />
        <img className="cover__lid" src={pokedexFechada} alt="" draggable="false" />
      </button>
      <p className="cover__hint" role="status" aria-live="polite">
        {legenda}
      </p>
    </div>
  );
}