import { useEffect } from 'react';
import '../css/PokemonCompare.css';

const padId = (id) => `#${String(id).padStart(3, '0')}`;
const imageUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

const statKeys = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'specialAttack', label: 'Sp. Atk' },
  { key: 'specialDefense', label: 'Sp. Def' },
  { key: 'speed', label: 'Speed' },
];

const MAX_STAT = 160;

const getTotal = (pokemon) =>
  statKeys.reduce((acc, stat) => acc + pokemon.stats[stat.key], 0);

const mainType = (pokemon) =>
  pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].name.toLowerCase() : 'normal';

function Fighter({ pokemon, side }) {
  return (
    <div className={`compare-fighter side-${side} card-${mainType(pokemon)}`}>
      <span className="compare-fighter-id">{padId(pokemon.id)}</span>
      <img src={imageUrl(pokemon.id)} alt={pokemon.name} />
      <h3>{pokemon.name}</h3>
      <div className="badges">
        {pokemon.types && pokemon.types.map((t) => (
          <span key={t.id} className={`type-badge type-${t.name.toLowerCase()}`}>{t.name}</span>
        ))}
      </div>
    </div>
  );
}

export default function PokemonCompare({ left, right, onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    document.body.classList.add('panel-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('panel-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [onClose]);

  if (!left || !right) return null;

  const leftTotal = getTotal(left);
  const rightTotal = getTotal(right);

  let leftWins = 0;
  let rightWins = 0;
  statKeys.forEach(({ key }) => {
    if (left.stats[key] > right.stats[key]) leftWins += 1;
    if (right.stats[key] > left.stats[key]) rightWins += 1;
  });

  let verdict = 'Empate técnico: os dois somam o mesmo total.';
  if (leftTotal > rightTotal) {
    verdict = `${left.name} tem ${leftTotal - rightTotal} pontos a mais no total e vence em ${leftWins} de 6 atributos.`;
  } else if (rightTotal > leftTotal) {
    verdict = `${right.name} tem ${rightTotal - leftTotal} pontos a mais no total e vence em ${rightWins} de 6 atributos.`;
  }

  const sideClass = (a, b) => (a > b ? 'win' : a < b ? 'lose' : 'tie');

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Comparação de Pokémon">
      <button className="modal-backdrop" onClick={onClose} aria-label="Fechar comparação" />

      <div className="compare-modal">
        <button className="close-button" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>

        <div className="compare-header">
          <Fighter pokemon={left} side="left" />
          <span className="compare-header-vs">VS</span>
          <Fighter pokemon={right} side="right" />
        </div>

        <div className="compare-stats">
          {statKeys.map(({ key, label }) => {
            const a = left.stats[key];
            const b = right.stats[key];
            return (
              <div className="compare-row" key={key}>
                <strong className={`compare-value ${sideClass(a, b)}`}>{a}</strong>
                <div className="compare-track to-left">
                  <i
                    className={sideClass(a, b)}
                    style={{ width: `${Math.min((a / MAX_STAT) * 100, 100)}%` }}
                  />
                </div>
                <span className="compare-label">{label}</span>
                <div className="compare-track to-right">
                  <i
                    className={sideClass(b, a)}
                    style={{ width: `${Math.min((b / MAX_STAT) * 100, 100)}%` }}
                  />
                </div>
                <strong className={`compare-value ${sideClass(b, a)}`}>{b}</strong>
              </div>
            );
          })}

          <div className="compare-row compare-total">
            <strong className={`compare-value ${sideClass(leftTotal, rightTotal)}`}>{leftTotal}</strong>
            <span />
            <span className="compare-label">Total</span>
            <span />
            <strong className={`compare-value ${sideClass(rightTotal, leftTotal)}`}>{rightTotal}</strong>
          </div>
        </div>

        <p className="compare-verdict">{verdict}</p>
      </div>
    </div>
  );
}
