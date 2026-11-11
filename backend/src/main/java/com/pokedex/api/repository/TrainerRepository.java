package com.pokedex.api.repository;

import com.pokedex.api.model.Trainer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrainerRepository extends MongoRepository<Trainer, Integer> {
}
