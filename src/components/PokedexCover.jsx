import { useState, useEffect } from 'react';
import '../css/PokedexCover.css';

// Capa de abertura: uma Pokédex fechada que o usuário abre para ligar o app.
// Fases: fechada -> abrindo -> iniciando -> onLigar()
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
        {/* topo: lente e LEDs */}
        <span className="cover__lens" aria-hidden="true"><i /></span>
        <span className="cover__leds" aria-hidden="true" />

        {/* interior: visor e controles */}
        <span className="cover__bezel" aria-hidden="true">
          <span className="cover__screen">
            <span className="cover__ball"><i /></span>
            <span className="cover__boot">POKÉDEX</span>
            <span className="cover__sweep" />
          </span>
        </span>
        <span className="cover__key" aria-hidden="true" />
        <span className="cover__pill cover__pill--a" aria-hidden="true" />
        <span className="cover__pill cover__pill--b" aria-hidden="true" />
        <span className="cover__grill" aria-hidden="true" />
        <span className="cover__dpad" aria-hidden="true" />

        {/* tampa que abre */}
        <span className="cover__lid" aria-hidden="true">
          <span className="cover__emblem"><i /></span>
        </span>
      </button>
      <p className="cover__hint" role="status" aria-live="polite">
        {legenda}
      </p>
    </div>
  );
}
