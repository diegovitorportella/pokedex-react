import React from 'react';

export default function SearchBar({ query, setQuery }) {
  return (
    <label className="search-box">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
      </svg>
      <input
        type="search"
        placeholder="Pesquisar Pokémon por nome ou ID..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <kbd>⌘ K</kbd>
    </label>
  );
}