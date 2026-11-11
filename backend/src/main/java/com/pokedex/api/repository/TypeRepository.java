package com.pokedex.api.repository;

import com.pokedex.api.model.PokemonType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TypeRepository extends MongoRepository<PokemonType, Integer> {
}
