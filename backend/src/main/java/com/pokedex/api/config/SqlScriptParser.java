package com.pokedex.api.config;

import com.pokedex.api.model.Pokemon;
import com.pokedex.api.model.PokemonType;
import com.pokedex.api.model.Stats;
import com.pokedex.api.model.Trainer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Lê o Script_Pokedex.sql (INSERTs do MySQL) e o converte para o modelo de documentos do MongoDB.
 * Cada tupla de VALUES vira uma lista de valores (números ou strings entre aspas simples).
 */
public final class SqlScriptParser {

    private static final Pattern INSERT = Pattern.compile(
            "INSERT\\s+INTO\\s+(\\w+)\\s*\\([^)]*\\)\\s*VALUES\\s*(.*?);", Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern TUPLE = Pattern.compile("\\(((?:'(?:[^']|'')*'|[^()'])*)\\)");
    private static final Pattern VALUE = Pattern.compile("'((?:[^']|'')*)'|(-?\\d+)");

    public record Parsed(List<Pokemon> pokemons, List<PokemonType> types, List<Trainer> trainers) {
    }

    private SqlScriptParser() {
    }

    public static Parsed parse(String sql) {
        Map<String, List<List<String>>> tables = new HashMap<>();
        Matcher insert = INSERT.matcher(sql);
        while (insert.find()) {
            List<List<String>> rows = tables.computeIfAbsent(insert.group(1).toLowerCase(), k -> new ArrayList<>());
            Matcher tuple = TUPLE.matcher(insert.group(2));
            while (tuple.find()) {
                List<String> values = new ArrayList<>();
                Matcher v = VALUE.matcher(tuple.group(1));
                while (v.find()) {
                    values.add(v.group(1) != null ? v.group(1).replace("''", "'") : v.group(2));
                }
                rows.add(values);
            }
        }

        List<PokemonType> types = tables.getOrDefault("types", List.of()).stream()
                .map(r -> new PokemonType(Integer.valueOf(r.get(0)), r.get(1))).toList();
        Map<Integer, PokemonType> typeById = new HashMap<>();
        types.forEach(t -> typeById.put(t.id(), t));

        // Relação N:N Pokémon x Tipo -> lista de tipos embutida no documento (ordem do script preservada)
        Map<Integer, List<PokemonType>> typesByPokemon = new HashMap<>();
        for (List<String> r : tables.getOrDefault("rel_pokemon_type", List.of())) {
            typesByPokemon.computeIfAbsent(Integer.valueOf(r.get(0)), k -> new ArrayList<>())
                    .add(typeById.get(Integer.valueOf(r.get(1))));
        }

        List<Pokemon> pokemons = tables.getOrDefault("pokemon", List.of()).stream().map(r -> {
            int id = Integer.parseInt(r.get(0));
            Stats stats = new Stats(num(r, 2), num(r, 3), num(r, 4), num(r, 5), num(r, 6), num(r, 7));
            // Pokémon sem linha na relação (ex.: Mew) ficam como "Typeless" (id 0)
            List<PokemonType> pts = typesByPokemon.getOrDefault(id, List.of(typeById.get(0)));
            return new Pokemon(id, r.get(1), stats, pts);
        }).toList();

        // Relação N:N Treinador x Pokémon -> lista de ids embutida no treinador (duplicatas preservadas)
        Map<Integer, List<Integer>> pokemonByTrainer = new HashMap<>();
        for (List<String> r : tables.getOrDefault("rel_trainer_pokemon", List.of())) {
            pokemonByTrainer.computeIfAbsent(Integer.valueOf(r.get(0)), k -> new ArrayList<>())
                    .add(Integer.valueOf(r.get(1)));
        }
        List<Trainer> trainers = tables.getOrDefault("trainers", List.of()).stream().map(r -> {
            int id = Integer.parseInt(r.get(0));
            return new Trainer(id, r.get(1), num(r, 2), pokemonByTrainer.getOrDefault(id, List.of()));
        }).toList();

        return new Parsed(pokemons, types, trainers);
    }

    private static int num(List<String> row, int i) {
        return Integer.parseInt(row.get(i));
    }
}
