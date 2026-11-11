package com.pokedex.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Tipo de Pokémon. Coleção "types"; também embutido dentro de cada Pokémon. */
@Document(collection = "types")
public record PokemonType(@Id Integer id, String name) {
}
