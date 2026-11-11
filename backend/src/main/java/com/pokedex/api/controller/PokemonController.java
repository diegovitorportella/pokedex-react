package com.pokedex.api.controller;

import com.pokedex.api.model.Pokemon;
import com.pokedex.api.service.PokemonService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pokemons")
public class PokemonController {

    private final PokemonService service;

    public PokemonController(PokemonService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pokemon> list(@RequestParam(required = false) String name,
                              @RequestParam(required = false) String type) {
        return service.list(name, type);
    }

    @GetMapping("/{id}")
    public Pokemon get(@PathVariable int id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<Pokemon> create(@Valid @RequestBody Pokemon pokemon) {
        Pokemon saved = service.create(pokemon);
        return ResponseEntity.created(URI.create("/api/pokemons/" + saved.id())).body(saved);
    }

    @PutMapping("/{id}")
    public Pokemon update(@PathVariable int id, @Valid @RequestBody Pokemon pokemon) {
        return service.update(id, pokemon);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
