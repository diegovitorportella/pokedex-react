package com.pokedex.api.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Coleção "trainers": guarda os ids dos Pokémon do treinador (relação N:N do SQL). */
@Document(collection = "trainers")
public record Trainer(@Id Integer id, String name, int badges, List<Integer> pokemonIds) {
}
