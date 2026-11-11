package com.pokedex.api.service;

import com.pokedex.api.model.Pokemon;
import com.pokedex.api.repository.PokemonRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PokemonService {

    private final PokemonRepository repository;

    public PokemonService(PokemonRepository repository) {
        this.repository = repository;
    }

    public List<Pokemon> list(String name, String type) {
        // "#025" e "25" também funcionam: o parâmetro name aceita nome ou ID
        String term = name == null ? "" : name.trim().replaceFirst("^#", "");
        boolean hasName = !term.isBlank();
        boolean hasType = type != null && !type.isBlank();
        List<Pokemon> result;
        if (hasName && term.chars().allMatch(Character::isDigit)) {
            String digits = term.replaceFirst("^0+(?=.)", "");
            result = repository.findAll().stream()
                    .filter(p -> String.valueOf(p.id()).contains(digits))
                    .toList();
            if (hasType) {
                result = result.stream()
                        .filter(p -> p.types().stream().anyMatch(t -> t.name().equalsIgnoreCase(type.trim())))
                        .toList();
            }
        } else if (hasName) {
            result = repository.findByNameContainingIgnoreCase(term);
            if (hasType) {
                result = result.stream()
                        .filter(p -> p.types().stream().anyMatch(t -> t.name().equalsIgnoreCase(type.trim())))
                        .toList();
            }
        } else if (hasType) {
            result = repository.findByTypesNameIgnoreCase(type.trim());
        } else {
            result = repository.findAll();
        }
        return result.stream().sorted(Comparator.comparing(Pokemon::id)).toList();
    }

    public Pokemon get(int id) {
        return repository.findById(id).orElseThrow(() -> notFound(id));
    }

    public Pokemon create(Pokemon pokemon) {
        int id;
        if (pokemon.id() == null) {
            id = repository.findAll().stream().mapToInt(Pokemon::id).max().orElse(0) + 1;
        } else {
            id = pokemon.id();
            if (repository.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um Pokémon com o id " + id);
            }
        }
        return repository.save(pokemon.withId(id));
    }

    public Pokemon update(int id, Pokemon pokemon) {
        if (!repository.existsById(id)) {
            throw notFound(id);
        }
        return repository.save(pokemon.withId(id));
    }

    public void delete(int id) {
        if (!repository.existsById(id)) {
            throw notFound(id);
        }
        repository.deleteById(id);
    }

    private ResponseStatusException notFound(int id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Pokémon " + id + " não encontrado");
    }
}
