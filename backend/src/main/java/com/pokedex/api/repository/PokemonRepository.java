package com.pokedex.api.repository;

import com.pokedex.api.model.Pokemon;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PokemonRepository extends MongoRepository<Pokemon, Integer> {
    List<Pokemon> findByNameContainingIgnoreCase(String name);

    List<Pokemon> findByTypesNameIgnoreCase(String typeName);
}
