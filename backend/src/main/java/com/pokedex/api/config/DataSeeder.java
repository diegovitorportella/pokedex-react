package com.pokedex.api.config;

import com.pokedex.api.repository.PokemonRepository;
import com.pokedex.api.repository.TrainerRepository;
import com.pokedex.api.repository.TypeRepository;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/** Popula o MongoDB a partir do Script_Pokedex.sql quando a coleção "pokemons" está vazia. */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final PokemonRepository pokemons;
    private final TypeRepository types;
    private final TrainerRepository trainers;
    private final String sqlPath;

    public DataSeeder(PokemonRepository pokemons, TypeRepository types, TrainerRepository trainers,
                      @Value("${pokedex.seed.sql-path}") String sqlPath) {
        this.pokemons = pokemons;
        this.types = types;
        this.trainers = trainers;
        this.sqlPath = sqlPath;
    }

    @Override
    public void run(String... args) throws Exception {
        long existing = pokemons.count();
        if (existing > 0) {
            log.info("Coleção 'pokemons' já populada ({} documentos); seed ignorado.", existing);
            return;
        }
        SqlScriptParser.Parsed data = SqlScriptParser.parse(readScript());
        types.saveAll(data.types());
        pokemons.saveAll(data.pokemons());
        trainers.saveAll(data.trainers());
        log.info("Seed concluído: {} pokemons, {} types, {} trainers.",
                data.pokemons().size(), data.types().size(), data.trainers().size());
    }

    private String readScript() throws Exception {
        Path file = Path.of(sqlPath);
        if (Files.exists(file)) {
            return Files.readString(file, StandardCharsets.UTF_8);
        }
        // Fallback: cópia do script embutida no jar (src/main/resources/Script_Pokedex.sql)
        return new String(new ClassPathResource("Script_Pokedex.sql").getInputStream().readAllBytes(),
                StandardCharsets.UTF_8);
    }
}
