import { useEffect, useState } from 'react';
import '../css/PokemonForm.css';

const statFields = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'specialAttack', label: 'Sp. Atk' },
  { key: 'specialDefense', label: 'Sp. Def' },
  { key: 'speed', label: 'Speed' },
];

// Formulário de cadastro/edição. Se "pokemon" vier preenchido, edita; senão, cadastra.
export default function PokemonForm({ pokemon, types, onSave, onClose }) {
  const isEdit = Boolean(pokemon);
  const [name, setName] = useState(pokemon?.name ?? '');
  const [stats, setStats] = useState(
    pokemon?.stats ?? { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 }
  );
  const [typeIds, setTypeIds] = useState(pokemon?.types.map((t) => t.id) ?? []);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const toggleType = (id) =>
    setTypeIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return setError('Informe o nome.');
    if (typeIds.length === 0) return setError('Escolha ao menos um tipo (máx. 2).');

    const payload = {
      name: name.trim(),
      stats: Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, Number(v)])),
      types: types.filter((t) => typeIds.includes(t.id)),
    };

    setSaving(true);
    setError('');
    try {
      await onSave(payload);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="modal-layer form-layer" role="dialog" aria-modal="true">
      <button className="modal-backdrop" onClick={onClose} aria-label="Fechar formulário" />
      <form className="pokemon-form" onSubmit={handleSubmit}>
        <h2>{isEdit ? `Editar ${pokemon.name}` : 'Novo Pokémon'}</h2>

        <label className="form-field">
          <span>Nome</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoFocus />
        </label>

        <div className="form-field">
          <span>Tipos (até 2)</span>
          <div className="form-types">
            {types.map((t) => (
              <button
                type="button"
                key={t.id}
                className={`type-badge type-${t.name.toLowerCase()} ${typeIds.includes(t.id) ? 'selected' : ''}`}
                onClick={() => toggleType(t.id)}
                aria-pressed={typeIds.includes(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-stats">
          {statFields.map(({ key, label }) => (
            <label className="form-field" key={key}>
              <span>{label}</span>
              <input
                type="number"
                min="0"
                max="255"
                value={stats[key]}
                onChange={(e) => setStats((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </label>
          ))}
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
}
