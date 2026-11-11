package com.pokedex.api.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class SqlScriptParserTest {

    private final SqlScriptParser.Parsed data = parse();

    private static SqlScriptParser.Parsed parse() {
        try {
            return SqlScriptParser.parse(Files.readString(Path.of("../Script_Pokedex.sql"), StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    @Test
    void countsMatchScript() {
        assertEquals(151, data.pokemons().size());
        assertEquals(18, data.types().size());
        assertEquals(12, data.trainers().size());
    }

    @Test
    void pikachuAndEscapedName() {
        var pikachu = data.pokemons().get(24);
        assertEquals("Pikachu", pikachu.name());
        assertEquals(90, pikachu.stats().speed());
        assertEquals("Electric", pikachu.types().get(0).name());
        assertEquals("Farfetch'd", data.pokemons().get(82).name());
    }

    @Test
    void relations() {
        assertEquals("Typeless", data.pokemons().get(150).types().get(0).name());
        assertEquals(java.util.List.of(25, 3, 6, 9, 131, 143), data.trainers().get(0).pokemonIds());
        assertEquals(5, data.trainers().get(11).pokemonIds().size());
    }
}
