package com.pokedex.api.controller;

import com.pokedex.api.model.PokemonType;
import com.pokedex.api.model.Trainer;
import com.pokedex.api.repository.TrainerRepository;
import com.pokedex.api.repository.TypeRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/** Endpoints de leitura de tipos e treinadores (desafio opcional). */
@RestController
@RequestMapping("/api")
public class CatalogController {

    private final TypeRepository types;
    private final TrainerRepository trainers;

    public CatalogController(TypeRepository types, TrainerRepository trainers) {
        this.types = types;
        this.trainers = trainers;
    }

    @GetMapping("/types")
    public List<PokemonType> types() {
        return types.findAll().stream().sorted(Comparator.comparing(PokemonType::id)).toList();
    }

    @GetMapping("/trainers")
    public List<Trainer> trainers() {
        return trainers.findAll().stream().sorted(Comparator.comparing(Trainer::id)).toList();
    }

    @GetMapping("/trainers/{id}")
    public Trainer trainer(@PathVariable int id) {
        return trainers.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treinador não encontrado"));
    }
}
