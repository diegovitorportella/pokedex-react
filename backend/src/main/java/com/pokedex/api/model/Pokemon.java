package com.pokedex.api.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** Coleção "pokemons". O formato é o mesmo consumido pelo frontend. */
@Document(collection = "pokemons")
public record Pokemon(
        @Id Integer id,
        @NotBlank @Size(max = 40) String name,
        @NotNull @Valid Stats stats,
        @NotEmpty List<@Valid PokemonType> types) {

    public Pokemon withId(Integer newId) {
        return new Pokemon(newId, name, stats, types);
    }
}
