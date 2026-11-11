package com.pokedex.api.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record Stats(
        @Min(0) @Max(255) int hp,
        @Min(0) @Max(255) int attack,
        @Min(0) @Max(255) int defense,
        @Min(0) @Max(255) int specialAttack,
        @Min(0) @Max(255) int specialDefense,
        @Min(0) @Max(255) int speed) {
}
