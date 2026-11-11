// Cliente da API REST (Spring Boot). URL configurável via VITE_API_URL.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. O backend está rodando em ' + BASE_URL + '?');
  }

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const body = await response.json();
      if (body.fields) {
        message = Object.entries(body.fields).map(([f, m]) => `${f}: ${m}`).join('; ');
      } else if (body.error) {
        message = body.error;
      }
    } catch {
      // resposta sem corpo JSON
    }
    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  // params opcionais: { name, type } -> GET /pokemons?name=...&type=...
  getPokemons: ({ name = '', type = '' } = {}) => {
    const qs = new URLSearchParams();
    if (name) qs.set('name', name);
    if (type) qs.set('type', type);
    const query = qs.toString();
    return request(`/pokemons${query ? `?${query}` : ''}`);
  },
  getPokemon: (id) => request(`/pokemons/${id}`),
  createPokemon: (pokemon) => request('/pokemons', { method: 'POST', body: JSON.stringify(pokemon) }),
  updatePokemon: (id, pokemon) => request(`/pokemons/${id}`, { method: 'PUT', body: JSON.stringify(pokemon) }),
  deletePokemon: (id) => request(`/pokemons/${id}`, { method: 'DELETE' }),
  getTypes: () => request('/types'),
  getTrainers: () => request('/trainers'),
};
